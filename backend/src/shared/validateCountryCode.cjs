const db = require('../firebase/firebaseDb.cjs');
module.exports = {
    validateCountryCode: async (cc)=>{
        try{
          const ctSnapshot = await db.collection('countryCodes').get();
          let countryCodes = [];
          ctSnapshot.forEach((doc) => {
            countryCodes = doc.data().countryCodes;
          });
      
          if(!countryCodes.includes(cc)) {
            return false;
          }
          return true;
        }
        catch(error){
          return false
        }
    },
};
