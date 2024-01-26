const { apiToken } = require('../config/firebaseConfig.cjs');
module.exports = async (req, res, next) => {
    let apiTokenHeader = req.headers.authorization;
    apiTokenHeader = apiTokenHeader.replace('Bearer ', '');
    try {
      if(apiTokenHeader === apiToken) {
        next();
      }
      else{
        res.status(401).json({ error: 'Invalid API token' });
      }
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Invalid API token' });
    }
  };