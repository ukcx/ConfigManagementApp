const express = require('express');
const router = express.Router();
const validateApiToken = require('../middleware/validateApiToken.cjs');
const db = require('../firebase/firebaseDb.cjs');
const { returnCountryCodeFromParams } = require('../shared/countryCodesHelperFunctions.cjs');

// Serving route with predefined API token check
router.get('/:cc?', validateApiToken, async (req, res) => {
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

module.exports = router;