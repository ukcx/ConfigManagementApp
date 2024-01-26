const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();
module.exports = db;