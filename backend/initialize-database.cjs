const admin = require('firebase-admin');
const { arrayToObject } = require('./helperFunctions.cjs');
const { serviceAccount, databaseURL } = require('./firebaseConfig.cjs');
const { countryCodesArray } = require('./firebaseConfig.cjs');
const { getFirestore } = require('firebase-admin/firestore');
const countryCodes = {countryCodes: countryCodesArray};
require('dotenv').config();

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  //databaseURL: databaseURL,
});

// Get a reference to the root of your database
const db = getFirestore();

var dummyUsers = [
  { email: 'user1@example.com', password: 'password1' },
  { email: 'user2@example.com', password: 'password2' },
];

// Update parameters for the specified project
const dateNow = Date.now();
const now = new Date(dateNow).toISOString();

const dummyProjectParameters = [
  {
    key: 'freeUsageLimit',
    value: arrayToObject(countryCodes.countryCodes, 1000, true),
    description: 'Number of free API calls per month',
    createDate: new Date(dateNow).toISOString(),
    lastUpdateDate: now
  },
  {
    key: 'supportEmail',
    value: arrayToObject(countryCodes.countryCodes, 'support@example.co', true),
    description: 'Support email address',
    createDate: new Date(dateNow - 1000).toISOString(),
    lastUpdateDate: now
  },
  {
    key: 'privacyPage',
    value: arrayToObject(countryCodes.countryCodes, 'https://example.co/privacy', true),
    description: 'URL of the privacy policy page',
    createDate: new Date(dateNow - 2000).toISOString(),
    lastUpdateDate: now
  },
  {
    key: 'minimumVersion',
    value: arrayToObject(countryCodes.countryCodes, '1.0', true),
    description: 'Minimum supported app version',
    createDate: new Date(dateNow - 3000).toISOString(),
    lastUpdateDate: now
  },
  {
    key: 'latestVersion',
    value: arrayToObject(countryCodes.countryCodes, '1.1', true),
    description: 'Latest supported app version',
    createDate: new Date(dateNow - 4000).toISOString(),
    lastUpdateDate: now
  },
  {
    key: 'compressionQuality',
    value: arrayToObject(countryCodes.countryCodes, 0.5, true),
    description: 'Image compression quality',
    createDate: new Date(dateNow - 5000).toISOString(),
    lastUpdateDate: now
  },
  {
    key: 'btnText',
    value: arrayToObject(countryCodes.countryCodes, 'Click me!', true),
    description: 'Text on the button',
    createDate: new Date(dateNow - 6000).toISOString(),
    lastUpdateDate: now
  }
];

const addCountryCodes = async() => {
  return db.collection('countryCodes').doc('countryCodes').set(countryCodes)
    .then(() => {
      console.log('Country codes data has been successfully written to the database.');
    })
    .catch((error) => {
      console.error('Error writing country codes to the database:', error);
      throw error; // This will reject the promise returned by addCountryCodes
    });
};

  // Write the updated data to the database
  const addDummyParameters = async(dummyParameters) => {
    return new Promise((resolve, reject) => {
      dummyParameters.forEach((parameter) => {
        const { key, value, description, createDate, lastUpdateDate } = parameter;
        console.log(value)
        db.collection('parameters').doc(key).set({
          description: description,
          createDate: createDate,
          lastUpdateDate: lastUpdateDate,
          value: value,
          key: key
        })
          .then(() => {
            console.log('Dummy parameters have been successfully written to the database.');
            resolve();
          })
          .catch((error) => {
            console.error('Error writing dummy parameters to the database:', error);
            reject(error);
          });
      });
    });
  };

  const authenticateOneUser = async (user) => {
    try {
      const { email, password } = user;
      const userCredential = await admin.auth().createUser({
        email: email,
        password: password,
        disabled: false,
        emailVerified: true
      });
      const uid = userCredential.uid;
      
      // await rootRef.child(`/users/${uid}`).update({ email: email });
      console.log('Dummy user authenticated:', uid);
    } catch (error) {
      console.error('Error authenticating dummy user:', error.message); 
    }
  };
  
  const initializeDatabase = async (dummyParameters, users) => {
    try {
      await addCountryCodes();
      await addDummyParameters(dummyParameters);
      const userPromises = users.map(user => authenticateOneUser(user));
      await Promise.all(userPromises);
      // const newParameter = {
      //   value: "arrayToObject(countryCodes, projectParameters.value, false)",
      //   description: "projectParameters.description",
      //   key: "projectParameters.key",
      //   createDate: new Date(Date.now()).toISOString(),
      //   lastUpdateDate: new Date(Date.now()).toISOString()
      // };
      // await db.collection('parameters').doc("dsadsasd").set(newParameter);
      
      await admin.app().delete();
    } 
    catch (error) {
      console.error('Error initializing database', error.message);
    }
  };
  
  initializeDatabase(dummyProjectParameters, dummyUsers);