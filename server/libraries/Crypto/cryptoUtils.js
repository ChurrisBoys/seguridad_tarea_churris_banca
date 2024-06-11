// This file contains utility functions for crypto operations
const crypto = require('crypto');
const { subtle } = globalThis.crypto;

async function verifySignature(publicKey, signature, data) {
    return await subtle.verify('RSASSA-PKCS1-v1_5', publicKey, signature, data);
}

function getPublicKeyFromCertificate(certificate) {
    return crypto.createPublicKey(certificate);
}

async function convertKeyObjectToCryptoKey(keyObject) {
    let exportedSpkiPem = keyObject.export({ type: 'spki', format: 'pem' });
    console.log(exportedSpkiPem);
    exportedSpkiPem = preparePublicKeyForImport(exportedSpkiPem);
    return await subtle.importKey('spki', exportedSpkiPem, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-384' }, false, ['verify']);
}

function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function preparePublicKeyForImport(publicKey) {
    let keyData = publicKey.replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', '').replace(/\n/g, '');
    keyData = atob(keyData);
    keyData = str2ab(keyData);
    return keyData;
}



module.exports = { verifySignature, getPublicKeyFromCertificate, convertKeyObjectToCryptoKey };