const express = require('express');
const router = express.Router();
const { apiToken } = require('../config/firebaseConfig.cjs');

router.post('/', async (req, res) => {
    try {
      res.json({ message: 'Login successful', apiToken: apiToken });
    } catch (error) {
      console.error('Error verifying firebase ID token:', error);
      res.status(401).json({ error: 'Error verifying firebase ID token' });
    }
  });

module.exports = router;