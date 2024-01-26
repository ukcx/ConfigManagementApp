const db = require('../firebase/firebaseDb.cjs');
const { validateCountryCode } = require('./validateCountryCode.cjs');
module.exports = {
  getCountryCodes: async () => {
      try {
          const ctSnapshot = await db.collection('countryCodes').get();
          let countryCodes = [];
          ctSnapshot.forEach((doc) => {
              countryCodes = doc.data().countryCodes;
          });
          return countryCodes;
      }
      catch (error) {
          console.log(error);
      }
  },
  returnCountryCodeFromBody: async (req) => {
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
  },
  returnCountryCodeFromParams: async (req) => {
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
};