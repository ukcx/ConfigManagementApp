const express = require('express');
const router = express.Router();
const db = require('../firebase/firebaseDb.cjs');

router.get('/', async (req, res) => {
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

module.exports = router;