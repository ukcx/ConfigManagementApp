const admin = require('../firebase/firebaseAdmin.cjs');
// Middleware to validate Firebase ID token
module.exports = async (req, res, next) => {
    let idToken = req.headers.authorization;
    try {
      idToken = idToken.replace('Bearer ', '');
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Invalid Firebase ID token' });
    }
  };