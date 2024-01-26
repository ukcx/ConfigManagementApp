const crypto = require('crypto');

function generateApiToken() {
    return crypto.randomBytes(64).toString('hex');
}

console.log(generateApiToken());