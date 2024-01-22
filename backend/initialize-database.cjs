const admin = require('firebase-admin');
const { arrayToObject } = require('./helperFunctions.cjs');
const { serviceAccount, databaseURL } = require('./firebaseConfig.cjs');
const { countryCodesArray } = require('./firebaseConfig.cjs');
const countryCodes = {countryCodes: countryCodesArray};

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL,
});

// Get a reference to the root of your database
const db = admin.database();
const rootRef = db.ref();
const projectId = 'case-study-241cf';

var dummyUsers = [
  { email: 'user1@example.com', password: 'password1' },
  { email: 'user2@example.com', password: 'password2' },
];

// Update parameters for the specified project
const dateNow = Date.now();
//format now as a date
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

// Write the dummy data to the database
// const createDatabase = async() => {
//   return new Promise((resolve, reject) => {
//     rootRef.set(databaseSkeleton, (error) => {
//       if (error) {
//         console.error('Error writing dummy data to the database:', error);
//         reject(error);
//       } else {
//         console.log('Dummy data has been successfully written to the database.');
//         resolve();
//       }
//     });
//   });
// } 

const addCountryCodes = async() => {
  return new Promise((resolve, reject) => {
    rootRef.set(countryCodes, (error) => {
      if (error) {
        console.error('Error writing country codes to the database:', error);
        reject(error);
      } else {
        console.log('Country codes data has been successfully written to the database.');
        resolve();
      }
    });
  });
} 
  // Write the updated data to the database
  const addDummyProjects = async(dummyParameters) => {
    return new Promise((resolve, reject) => {
      // Get a reference to the project in the database
      const projectRef = admin.database().ref(`/projects/${projectId}`);
      dummyParameters.forEach((parameter) => {
        // Create a new child with a specified key
        const newParameterRef = projectRef.child(parameter.key);
        newParameterRef.set(parameter, (error) => {
          if (error) {
            console.error('Error updating project parameters:', error);
            reject(error);
          } else {
            console.log('Project parameters updated successfully.');
            resolve();
          }
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
  
  const authenticateUsersAndAddProjects = async (dummyParameters, users) => {
    try {
      await addCountryCodes();
      await addDummyProjects(dummyParameters);
      const userPromises = users.map(user => authenticateOneUser(user));
      await Promise.all(userPromises);
      await admin.app().delete();
    } 
    catch (error) {
      console.error('Error authenticating dummy users', error.message);
    }
  };
  
  authenticateUsersAndAddProjects(dummyProjectParameters, dummyUsers);