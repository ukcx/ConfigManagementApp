// firebaseConfig.js
require('dotenv').config();

module.exports = {
    serviceAccount: JSON.parse(process.env.SERVICE_ACCOUNT_KEY),
    countryCodesArray: ["DEFAULT", "TR", "EN", "TH", "FR"]
  };
  