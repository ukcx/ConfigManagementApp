const admin = require('firebase-admin');
const { serviceAccount } = require('../config/firebaseConfig.cjs');
// Firebase Admin SDK setup
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;