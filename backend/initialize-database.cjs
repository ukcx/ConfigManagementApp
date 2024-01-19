const admin = require('firebase-admin');
const bcrypt = require('bcrypt');

const { serviceAccount, databaseURL } = require('./firebaseConfig.cjs');

const firebaseConfig = {
  apiKey: "AIzaSyA9jqFzpEufd09PK2gPQY767AbVLq5psIo",
  authDomain: "case-study-241cf.firebaseapp.com",
  databaseURL: "https://case-study-241cf-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "case-study-241cf",
  storageBucket: "case-study-241cf.appspot.com",
  messagingSenderId: "563450836284",
  appId: "1:563450836284:web:c2a19a7e714c0be86cda39",
  measurementId: "G-R7TZGJQ1DR"
};

// Initialize Firebase Admin SDK
admin.initializeApp({
  firebaseConfig,
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL,
});

// Get a reference to the root of your database
const db = admin.database();
const rootRef = db.ref();

var databaseSkeleton = {
  projects: {},
  users: {}
};
var dummyUsers = [
  { email: 'ugurkagancakir@gmail.com', password: 'password1' },
  { email: 'user2@example.com', password: 'password2' },
];
// Get the project ID (replace 'yourProjectId' with an actual project ID)
const projectId = 'case-study-241cf';
// Update parameters for the specified project
const dummyProjectParameters = {
  freeUsageLimit: 5,
  supportEmail: 'support@example.co',
  privacyPage: 'https://example.comm/privacy_en.html',
  minimumVersion: '1.0',
  latestVersion: '2.1',
  compressionQuality: 0.7,
  btnText: 'Try now!',
};

// Write the dummy data to the database
const createDatabase = async() => {
  return new Promise((resolve, reject) => {
    rootRef.set(databaseSkeleton, (error) => {
      if (error) {
        console.error('Error writing dummy data to the database:', error);
        reject(error);
      } else {
        console.log('Dummy data has been successfully written to the database.');
        resolve();
      }
    });
  });
} 
  // Write the updated data to the database
  const addDummyProjects = async() => {
    return new Promise((resolve, reject) => {
      rootRef.child(`projects/${projectId}`).update(dummyProjectParameters, (error) => {
        if (error) {
          console.error('Error updating project parameters:', error);
          reject(error);
        } else {
          console.log('Project parameters updated successfully.');
          resolve();
        }
      });
    });
  };

  const authenticateAndAddOneUserToDatabase = async (user) => {
    try {
      const { email, password } = user;
      const userCredential = await admin.auth().createUser({
        email: email,
        password: password,
        disabled: false,
        emailVerified: true
      });
      const uid = userCredential.uid;
      
      await rootRef.child(`/users/${uid}`).update({ email: email });
      console.log('Dummy user authenticated:', uid);
    } catch (error) {
      console.error('Error authenticating dummy user:', error.message);
      throw error;
    }
  };
  
  const authenticateAndAddUsersToDatabase = async (users) => {
    try {
      await createDatabase();
      await addDummyProjects();
      const userPromises = users.map(user => authenticateAndAddOneUserToDatabase(user));
      await Promise.all(userPromises);
      await admin.app().delete();
    } 
    catch (error) {
      console.error('Error authenticating dummy users', error.message);
      throw error;
    }
  };
  
  authenticateAndAddUsersToDatabase(dummyUsers);