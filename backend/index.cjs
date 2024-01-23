const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const { arrayToObject, trimObjectValues } = require('./helperFunctions.cjs');
const { countryCodesArray } = require('./firebaseConfig.cjs');
const countryCodes = countryCodesArray;

const app = express();
app.use(cors());
const { serviceAccount, databaseURL } = require('./firebaseConfig.cjs');
const processSet = new Set();

// Firebase Admin SDK setup
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL
});

// Set up middleware to parse JSON requests
app.use(express.json());

const getProcessString = (projectId, countryCode, key) => {
  return `${projectId}-${countryCode}-${key}`;
}

const checkAndAddToProcessSet = async (processString) => {
  if(processSet.has(processString)) {
    return false;
  }
  else{
    processSet.add(processString);
    return true;
  }
}

const removeFromProcessSet = async (processString) => {
  processSet.delete(processString);
}

const validateCountryCode = async (cc)=>{
  try{
    const ctSnapshot = await admin.database().ref(`/countryCodes`).once('value');
    const countryCodes = ctSnapshot.val();
    if(!countryCodes.includes(cc)) {
      return false;
    }
    return true;
  }
  catch(error){
    return false
  }
}

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

const validateAPIToken = async (req, res, next) => {
  const apiToken = req.headers.authorization;
  try {
    if(apiToken === process.env.API_TOKEN) {
      next();
    }
    else{
      res.status(401).json({ error: 'Invalid API token' });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid API token' });
  }
};

//Example route for user login
app.post('/login',  validateFirebaseToken, async (req, res) => {
  try {
    res.json({ message: 'Login successful', apiToken: process.env.API_TOKEN });
  } catch (error) {
    console.error('Error verifying firebase ID token:', error);
    res.status(401).json({ error: 'Error verifying firebase ID token' });
  }
});

app.get('/:projectId/countryCodes', async (req, res) => {
  try {
    // Get country codes data from the database
    const countryCodesSnapshot = await admin.database().ref(`/countryCodes`).once('value');
    const codesData = countryCodesSnapshot.val();
    res.json( codesData );

  } catch (error) {
    console.error('Error serving project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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
    const projectParameters = trimObjectValues(req.body);

    // Get a reference to the parameter in the database
    const parameterRef = admin.database().ref(`/projects/${projectId}/${projectParameters.key}`);
    const parameterSnapshot = await parameterRef.once('value');
    if (parameterSnapshot.exists()) {
      return res.status(405).json({ error: 'Parameter already exists!' });
    }
    // Get a reference to the project in the database
    const projectRef = admin.database().ref(`/projects/${projectId}`);

    // Create a new child with a specified key
    const newParameterRef = projectRef.child(projectParameters.key);

    const newProjectParameter = {
      value: arrayToObject(countryCodes, projectParameters.value, false),
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
app.put('/:projectId/:countryCode', validateFirebaseToken, [
  check('key').not().isEmpty()
], async (req, res) => {
  const projectParameters = trimObjectValues(req.body);
  const processString = getProcessString(req.params.projectId, req.params.countryCode, projectParameters.key);
  console.log(processString);
    try {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { projectId, countryCode } = req.params;
      
      if(!await validateCountryCode(countryCode)) {
        return res.status(404).json({ error: 'Country code not found' });
      }
      if(!checkAndAddToProcessSet(processString)){
        removeFromProcessSet(processString);
        return res.status(405).json({ error: 'Another request already in process' });
      }

      // Get a reference to the parameter in the database
      const parameterRef = admin.database().ref(`/projects/${projectId}/${projectParameters.key}`);
      const parameterSnapshot = await parameterRef.once('value');
      if (!parameterSnapshot.exists()) {
        removeFromProcessSet(processString);
        return res.status(405).json({ error: 'Parameter doesn\'t exist!' });
      }
      const newProjectParameter = {
        key: projectParameters.key,
        lastUpdateDate: new Date(Date.now()).toISOString(),
      };
      // if(projectParameters.description !== undefined) {
      //   newProjectParameter["description"] = projectParameters.description;
      // }
      console.log(newProjectParameter);
      // Update the project parameters
      await parameterRef.update(newProjectParameter);

      const valueRef = admin.database().ref(`/projects/${projectId}/${projectParameters.key}/value/${countryCode}`);
      if(projectParameters.value !== undefined && projectParameters.value !== null) {
        valueRef.set(projectParameters.value);
      }
      removeFromProcessSet(processString);
      res.json({ message: 'Project parameters updated successfully' });
    } 
    catch (error) {
      console.error('Error updating project parameters:', error);
      removeFromProcessSet(processString);
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
      const { projectId } = req.params;
      const projectParameters = trimObjectValues(req.body);
      const key = projectParameters.key;
  
      // Get a reference to the parameter in the database
      const parameterRef = admin.database().ref(`/projects/${projectId}/${key}`);
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
app.get('/:projectId/:countryCode', validateAPIToken, async (req, res) => {
      try {
        const { projectId, countryCode } = req.params;
        if(!await validateCountryCode(countryCode)) {
          return res.status(404).json({ error: 'Country code not found' });
        }
        // Get project data from the database
        const projectSnapshot = await admin.database().ref(`/projects/${projectId}`).once('value');
        const projectData = projectSnapshot.val();

        if (projectData !== null) {
          for (const [key, value] of Object.entries(projectData)) {
            projectData[key].value = value.value[countryCode];
          }
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
app.get('/:projectId/:countryCode/:key', validateAPIToken, async (req, res) => {
    try {
      const { projectId, countryCode, key } = req.params;
      if(!await validateCountryCode(countryCode)) {
        return res.status(404).json({ error: 'Country code not found' });
      }
      // Get project data from the database
      const projectSnapshot = await admin.database().ref(`/projects/${projectId}/${key}`).once('value');
      if(projectSnapshot.exists()) {
        const projectData = projectSnapshot.val();
        projectData.value = projectData.value[countryCode];
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
