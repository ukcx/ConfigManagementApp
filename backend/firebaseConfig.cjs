// firebaseConfig.js
require('dotenv').config();

module.exports = {
    serviceAccount: JSON.parse(process.env.SERVICE_ACCOUNT_KEY),
    databaseURL: process.env.databaseURL,
    countryCodesArray: ["TR", "EN", "TH", "FR"]
  };
  