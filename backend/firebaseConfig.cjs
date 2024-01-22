// firebaseConfig.js
require('dotenv').config();

module.exports = {
    serviceAccount: require('./accountKey/ServiceAccountKey.json'),
    databaseURL: process.env.databaseURL,
  };
  