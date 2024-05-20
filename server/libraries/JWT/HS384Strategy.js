const JWTSigningStrategy = require('./JWTSigningStrategy');
const jwt = require('jsonwebtoken');

class HS384Strategy extends JWTSigningStrategy {
  constructor(secretKey) {
    super(secretKey);
  }

  sign(payload) {
    return jwt.sign(payload, this.secretKey, { algorithm: 'HS384' }, { expiresIn: '1h' });
  }

  verify(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secretKey, { algorithms: ['HS384'] }, (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  }
}

module.exports = HS384Strategy;