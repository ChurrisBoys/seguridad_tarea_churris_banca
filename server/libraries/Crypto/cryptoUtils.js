// This file contains utility functions for crypto operations
const crypto = require('crypto');

function verifySignature(publicKey, signature, data) {
    const verify = crypto.createVerify('SHA384');
    verify.update(data);
    verify.end();
    return verify.verify(publicKey, signature);
}

function getPublicKeyFromCertificate(certificate) {
    return crypto.createPublicKey(certificate);
}

module.exports = { verifySignature, getPublicKeyFromCertificate };