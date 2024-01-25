const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const { getFirestore } = require('firebase-admin/firestore');
const { arrayToObject, trimObjectValues } = require('./helperFunctions.cjs');
const { countryCodesArray } = require('./firebaseConfig.cjs');
const countryCodes = countryCodesArray;

const app = express();
app.use(cors());

const { serviceAccount } = require('./firebaseConfig.cjs');
const processSet = new Set();

// Firebase Admin SDK setup
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();
// Set up middleware to parse JSON requests
app.use(express.json());

const getProcessString = (key) => {
  return `${key}`;
}

const checkAndAddToProcessSet = (processString) => {
  if(processSet.has(processString)) {
    return false;
  }
  else{
    processSet.add(processString);
    return true;
  }
}

const removeFromProcessSet = (processString) => {
  processSet.delete(processString);
}

const returnCountryCodeFromBody = async (req) => {
  const reqCountryCode = req.body.countryCode;
  //console.log(reqCountryCode)
  if(reqCountryCode === undefined || reqCountryCode === null) {
    return "DEFAULT";
  }
  else{
    if(!await validateCountryCode(reqCountryCode)) {
      return "DEFAULT";
    }
    return reqCountryCode;
  }
}

const returnCountryCodeFromParams = async (req) => {
  const reqCountryCode = req.params.cc;
  if(reqCountryCode === undefined || reqCountryCode === null) {
    return "DEFAULT";
  }
  else{
    if(!await validateCountryCode(reqCountryCode)) {
      return "DEFAULT";
    }
    return reqCountryCode;
  }
}

const validateCountryCode = async (cc)=>{
  try{
    const ctSnapshot = await db.collection('countryCodes').get();
    let countryCodes = [];
    ctSnapshot.forEach((doc) => {
      countryCodes = doc.data().countryCodes;
    });

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
app.post('/fetchApiToken', async (req, res) => {
  try {
    res.json({ message: 'Login successful', apiToken: process.env.API_TOKEN });
  } catch (error) {
    console.error('Error verifying firebase ID token:', error);
    res.status(401).json({ error: 'Error verifying firebase ID token' });
  }
});

app.get('/countryCodes', async (req, res) => {
  try {
    // Get country codes data from the database
    const countryCodesSnapshot = await db.collection('countryCodes').get();
    let data = {}
    countryCodesSnapshot.forEach((doc) => {
      data = doc.data().countryCodes;
    });
    console.log(data);
    res.json( data );
  } catch (error) {
    console.error('Error serving project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new parameter for a project if it doesn't exist
app.post('/parameters', validateFirebaseToken, [
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
    const projectParameters = trimObjectValues(req.body);
    const parameterSnapshot = await db.collection('parameters').doc(projectParameters.key).get();
    if (parameterSnapshot.exists) {
      return res.status(405).json({ error: 'Parameter already exists!' });
    }

    const newParameter = {
      value: arrayToObject(countryCodes, projectParameters.value, false),
      description: projectParameters.description,
      key: projectParameters.key,
      createDate: new Date(Date.now()).toISOString(),
      lastUpdateDate: new Date(Date.now()).toISOString()
    };
    await db.collection('parameters').doc(projectParameters.key).set(newParameter);
    res.json({ message: 'Parameter added' });

  } catch (error) {
    console.error('Error updating project parameters:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project parameters route with Firebase ID token validation
app.put('/parameters', validateFirebaseToken, [
  check('key').not().isEmpty()
], async (req, res) => {
  const parameters = trimObjectValues(req.body);
  const processString = getProcessString(parameters.key);
  //console.log(processString);
    try {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const countryCode = await returnCountryCodeFromBody(req);
      // Get a reference to the parameter in the database
      const parameterSnapshot = await db.collection('parameters').doc(parameters.key).get();
      if (!parameterSnapshot.exists) {
        return res.status(405).json({ error: 'Parameter doesn\'t exist!' });
      }
      if(!checkAndAddToProcessSet(processString)){
        removeFromProcessSet(processString);
        return res.status(405).json({ error: 'Another request already in process' });
      }

      //console.log(parameters.value)
      const values = parameterSnapshot.data();
      values.lastUpdateDate = new Date(Date.now()).toISOString()
      if(parameters.value !== undefined && parameters.value !== null) {
        //console.log("countryCode val", values.value[countryCode])
        values.value[countryCode] = parameters.value;
      }
      await db.collection('parameters').doc(parameters.key).update(values);
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
app.delete('/parameters', validateFirebaseToken, [
    check('key').not().isEmpty()
  ], async (req, res) => {
    try {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const projectParameters = trimObjectValues(req.body);
      const key = projectParameters.key;
      
      // Get a reference to the parameter in the database
      const parameterSnapshot = await db.collection('parameters').doc(key).get();
      if (!parameterSnapshot.exists) {
        return res.status(404).json({ error: 'Parameter not found' });
      }
      // Delete the parameter
      await db.collection('parameters').doc(key).delete();
      res.json({ message: 'Parameter deleted successfully', key });
    } catch (error) {
      console.error('Error deleting parameter:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
// Serving route with predefined API token check
app.get('/parameters/cc/:cc?', validateFirebaseToken, async (req, res) => {
  try {
    const countryCode = await returnCountryCodeFromParams(req);
    const parameterSnapshot = await db.collection('parameters').get();
    let data = {}
    parameterSnapshot.forEach((doc) => {
      data[doc.id] = doc.data();
      //console.log(countryCode)
      data[doc.id].value = doc.data().value[countryCode]
    });
    //console.log(data)

    if (data !== null) {
      res.json( data );
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
app.get('/parametersKeyValue/:cc?', validateAPIToken, async (req, res) => {
  try {
    const countryCode = await returnCountryCodeFromParams(req);
    const parameterSnapshot = await db.collection('parameters').get();
    let data = {}
    parameterSnapshot.forEach((doc) => {
      data[doc.id] = doc.data().value[countryCode];
    });
    //console.log(data)

    if (data !== null) {
      res.json( data );
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
app.get('/parameters/:key/:cc?', validateFirebaseToken, async (req, res) => {
    try {
      const { key } = req.params;
      //console.log("cc: ", req.params.cc)
      const countryCode = await returnCountryCodeFromParams(req);
      //console.log("cc: ", countryCode)
      // Get project data from the database
      const parameterSnapshot = await db.collection('parameters').doc(key).get();
      if(parameterSnapshot.exists) {
        const data = parameterSnapshot.data();
        data.value = data.value[countryCode];
        res.json( data );
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
//module.exports = app;