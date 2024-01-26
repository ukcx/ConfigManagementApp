// firebaseConfig.js
require('dotenv').config();

module.exports = {
    serviceAccount: JSON.parse(process.env.SERVICE_ACCOUNT_KEY),
    apiToken: process.env.API_TOKEN,
    countryCodesArray: ["DEFAULT", "TR", "EN", "TH", "FR"]
  };
  