import JWTSigningStrategy from "./JWTSigningStrategy";
const jwt = require('jsonwebtoken');

class HS384Strategy extends JWTSigningStrategy {
    constructor(secretKey) {
        super(secretKey);
    }

    sign(payload) {
        return jwt.sign(payload, this.secretKey, { algorithm: 'HS384' });
    }

    verify(token) {
        return jwt.verify(token, this.secretKey);
    }
}

module.exports = HS384Strategy;