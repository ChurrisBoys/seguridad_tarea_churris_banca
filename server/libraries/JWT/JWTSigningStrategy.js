class JWTSigningStrategy {
    constructor(secretKey) {
        this.secretKey = secretKey;
    }

    sign(payload) {
        throw new Error('Not implemented');
    }

    verify(token) {
        throw new Error('Not implemented');
    }
}

module.exports = JWTSigningStrategy;