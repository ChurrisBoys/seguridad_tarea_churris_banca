// This file contains utility functions for crypto operations
const crypto = require('crypto');
const webcrypto = require('crypto').webcrypto

function verifySignature(publicKey, signature, data) {
    return webcrypto.subtle.verify('RSASSA-PKCS1-v1_5', publicKey, signature, data);
}

function getPublicKeyFromCertificate(certificate) {
    return crypto.createPublicKey(certificate);
}

function convertKeyObjectToCryptoKey(keyObject) {
    let pem = keyObject.export({ type: 'spki', format: 'pem' });
    return webcrypto.subtle.importKey('spki', new TextEncoder().encode(pem), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-384' }, false, ['verify']);
}

module.exports = { verifySignature, getPublicKeyFromCertificate, convertKeyObjectToCryptoKey };