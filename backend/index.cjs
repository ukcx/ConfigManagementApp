const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');

const app = express();
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

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid Firebase ID token' });
  }
};

// Example route for user login
app.post('/login', async (req, res) => {
  const idToken = req.body.idToken; // Get the firebase ID token from the request

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Fetch additional user information from the Realtime Database
    const userSnapshot = await admin.database().ref(`/users/${uid}`).once('value');
    const userData = userSnapshot.val();
    console.log('User data from Realtime Database:', userData);

    res.json({ message: 'Login successful', user: userData });
  } catch (error) {
    console.error('Error verifying ID token:', error);
    res.status(401).json({ error: 'Incorrect username or password' });
  }
});


// Update project parameters route with Firebase ID token validation
app.put('/:projectId', validateFirebaseToken, async (req, res) => {
    try {
      const { projectId } = req.params;
      const projectParameters = req.body;
      console.log(projectParameters)
  
      // Get a reference to the project in the database
      const projectRef = admin.database().ref(`/projects/${projectId}`);
      
      // Update the project parameters
      await projectRef.update(projectParameters);
  
      res.json({ message: 'Project parameters updated successfully' });
    } catch (error) {
      console.error('Error updating project parameters:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Serving route with predefined API token check
  app.delete('/:projectId', validateFirebaseToken, async (req, res) => {
    try {
      const { projectId } = req.params;
      const { parameter } = req.body;
  
      // Get a reference to the parameter in the database
      const parameterRef = admin.database().ref(`/projects/${projectId}/${parameter}`);
  
      // Check if the parameter exists
      const parameterSnapshot = await parameterRef.once('value');
      if (!parameterSnapshot.exists()) {
        return res.status(404).json({ error: 'Parameter not found' });
      }
      // Delete the parameter
      await parameterRef.remove();
      res.json({ message: 'Parameter deleted successfully', parameter });
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
    
        if (projectData) {
          res.json({ projectData });
        } else {
          res.status(404).json({ error: 'Project not found' });
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
