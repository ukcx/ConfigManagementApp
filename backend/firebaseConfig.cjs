// firebaseConfig.js
require('dotenv').config();

module.exports = {
    serviceAccount: JSON.parse(process.env.SERVICE_ACCOUNT_KEY),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    countryCodesArray: ["TR", "EN", "TH", "FR"]
  };
  