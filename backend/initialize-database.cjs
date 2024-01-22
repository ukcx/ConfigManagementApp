const admin = require('firebase-admin');

const { serviceAccount, databaseURL } = require('./firebaseConfig.cjs');
const countryCodes = {countryCodes: ["TR", "EN", "TH", "FR"]};

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
    value: 1000,
    description: 'Number of free API calls per month',
    createDate: now,
    lastUpdateDate: now
  },
  {
    key: 'supportEmail',
    value: 'support@example.co',
    description: 'Support email address',
    createDate: now,
    lastUpdateDate: now
  },
  {
    key: 'privacyPage',
    value: 'https://example.comm/privacy_en.html',
    description: 'URL of the privacy policy page',
    createDate: now,
    lastUpdateDate: now
  },
  {
    key: 'minimumVersion',
    value: ['1.0', '1.0'],
    description: 'Minimum supported app version',
    createDate: now,
    lastUpdateDate: now
  },
  {
    key: 'latestVersion',
    value: '2.1',
    description: 'Latest supported app version',
    createDate: now,
    lastUpdateDate: now
  },
  {
    key: 'compressionQuality',
    value: 0.7,
    description: 'Image compression quality',
    createDate: now,
    lastUpdateDate: now
  },
  {
    key: 'btnText',
    value: 'Try now!',
    description: 'Text on the button',
    createDate: now,
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