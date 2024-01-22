const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { check, validationResult } = require('express-validator');

const app = express();
app.use(cors());
const { serviceAccount, databaseURL } = require('./firebaseConfig.cjs');


// Firebase Admin SDK setup
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL
});

// Set up middleware to parse JSON requests
app.use(express.json());

// Middleware to validate Firebase ID token
const validateFirebaseToken = async (req, res, next) => {
  const idToken = req.headers.authorization;
  console.log(req.headers)

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid Firebase ID token' });
  }
};

// Add a new parameter for a project if it doesn't exist
app.post('/:projectId', validateFirebaseToken, [
  check('key').not().isEmpty(),
  check('value').not().isEmpty(),
  check('description').not().isEmpty()
], async (req, res) => {
  try {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId } = req.params;
    const projectParameters = req.body;

    // Get a reference to the parameter in the database
    const parameterRef = admin.database().ref(`/projects/${projectId}/${projectParameters.key}`);

    // Check if the parameter exists
    const parameterSnapshot = await parameterRef.once('value');
    if (parameterSnapshot.exists()) {
      return res.status(405).json({ error: 'Parameter already exists!' });
    }
    // Get a reference to the project in the database
    const projectRef = admin.database().ref(`/projects/${projectId}`);

    // Create a new child with a specified key
    const newParameterRef = projectRef.child(projectParameters.key);

    const newProjectParameter = {
      value: projectParameters.value,
      description: projectParameters.description,
      key: projectParameters.key,
      createDate: new Date(Date.now()).toISOString(),
      lastUpdateDate: new Date(Date.now()).toISOString()
    };

    // Set the value of the new child
    await newParameterRef.set(newProjectParameter);
    // await newParameterRef.set(newProjectParameter);
    res.json({ message: 'Parameter added' });

  } catch (error) {
    console.error('Error updating project parameters:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project parameters route with Firebase ID token validation
app.put('/:projectId', validateFirebaseToken, [
  check('key').not().isEmpty()
], async (req, res) => {
    try {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { projectId } = req.params;
      const projectParameters = req.body;
  
      // Get a reference to the project in the database
      const projectRef = admin.database().ref(`/projects/${projectId}`);
      // Get a reference to the parameter in the database
      const parameterRef = admin.database().ref(`/projects/${projectId}/${projectParameters.key}`);

      // Check if the parameter exists
      const parameterSnapshot = await parameterRef.once('value');
      if (!parameterSnapshot.exists()) {
        return res.status(405).json({ error: 'Parameter doesn\'t exist!' });
      }
      const newProjectParameter = {
        key: projectParameters.key,
        lastUpdateDate: new Date(Date.now()).toISOString()
      }
      if(projectParameters.value !== undefined) {
        newProjectParameter["value"] = projectParameters.value;
      }
      if(projectParameters.description !== undefined) {
        newProjectParameter["description"] = projectParameters.description;
      }
      console.log(newProjectParameter)

      // Update the project parameters
      await parameterRef.update(newProjectParameter);
  
      res.json({ message: 'Project parameters updated successfully' });
    } catch (error) {
      console.error('Error updating project parameters:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
// Serving route with predefined API token check
app.delete('/:projectId', validateFirebaseToken, [
    check('key').not().isEmpty()
  ], async (req, res) => {
    try {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      console.log(req.body)
      const { projectId } = req.params;
      const { key } = req.body;
  
      // Get a reference to the parameter in the database
      const parameterRef = admin.database().ref(`/projects/${projectId}/${key}`);
  
      // Check if the parameter exists
      const parameterSnapshot = await parameterRef.once('value');
      if (!parameterSnapshot.exists()) {
        return res.status(404).json({ error: 'Parameter not found' });
      }
      // Delete the parameter
      await parameterRef.remove();
      res.json({ message: 'Parameter deleted successfully', key });
    } catch (error) {
      console.error('Error deleting parameter:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Serving route with predefined API token check
app.get('/:projectId', validateFirebaseToken, async (req, res) => {
      try {
        const { projectId } = req.params;
    
        // Get project data from the database
        const projectSnapshot = await admin.database().ref(`/projects/${projectId}`).once('value');
        const projectData = projectSnapshot.val();
        console.log(projectData)
        if (projectData !== null) {
          res.json( projectData );
        } else {
          res.json({});
          //res.status(404).json({ error: 'Project not found' });
        }
      } catch (error) {
        console.error('Error serving project:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

// Serving route with predefined API token check
app.get('/:projectId/:parameter', validateFirebaseToken, async (req, res) => {
    try {
      const { projectId, parameter } = req.params;
      console.log(projectId, parameter)
  
      // Get project data from the database
      const projectSnapshot = await admin.database().ref(`/projects/${projectId}/${parameter}`).once('value');
      if(projectSnapshot.exists()) {
        const projectData = projectSnapshot.val();
        res.json( projectData );
      }
      else{
        res.status(404).json({ error: 'Parameter not found' });
      }
    } catch (error) {
      console.error('Error serving project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// Example route for user login
// app.post('/login', async (req, res) => {
//   const idToken = req.body.idToken; // Get the firebase ID token from the request

//   try {
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     const uid = decodedToken.uid;

//     // Fetch additional user information from the Realtime Database
//     const userSnapshot = await admin.database().ref(`/users/${uid}`).once('value');
//     const userData = userSnapshot.val();
//     console.log('User data from Realtime Database:', userData);

//     res.json({ message: 'Login successful', user: userData });
//   } catch (error) {
//     console.error('Error verifying ID token:', error);
//     res.status(401).json({ error: 'Incorrect username or password' });
//   }
// });