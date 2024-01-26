const express = require('express');
const router = express.Router();
const db = require('../firebase/firebaseDb.cjs');
const validateFirebaseToken = require('../middleware/validateFirebaseToken.cjs');
const { check, validationResult } = require('express-validator');
const { arrayToObject, trimObjectValues } = require('../shared/helperFunctions.cjs');
const { returnCountryCodeFromParams, returnCountryCodeFromBody, getCountryCodes } = require('../shared/countryCodesHelperFunctions.cjs');
const { getProcessString, checkAndAddToProcessSet, removeFromProcessSet } = require('../globals/processSet.cjs');

// Add a new parameter for a project if it doesn't exist
router.post('/', validateFirebaseToken, [
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
      const countryCodes = await getCountryCodes();
  
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
  router.put('/', validateFirebaseToken, [
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
  router.delete('/', validateFirebaseToken, [
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
  router.get('/cc/:cc?', validateFirebaseToken, async (req, res) => {
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
  router.get('/:key/:cc?', validateFirebaseToken, async (req, res) => {
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

  module.exports = router;