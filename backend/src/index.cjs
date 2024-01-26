const express = require('express');
const cors = require('cors');
const admin = require('./firebase/firebaseAdmin.cjs');
const countryCodes = require('./routes/countryCodes.cjs');
const parametersKeyValue = require('./routes/parametersKeyValue.cjs');
const fetchApiToken = require('./routes/fetchApiToken.cjs');
const parameters = require('./routes/parameters.cjs');

const app = express();
app.use(cors());
// Set up middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/countryCodes', countryCodes);
app.use('/parameters', parameters);
app.use('/parametersKeyValue', parametersKeyValue);
app.use('/fetchApiToken', fetchApiToken);

// Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
module.exports = app;