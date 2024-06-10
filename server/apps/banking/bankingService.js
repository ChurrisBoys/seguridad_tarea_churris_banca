const readFile = require('../../libraries/FileSystem/FSutils');
const { verifySignature, getPublicKeyFromCertificate, convertKeyObjectToCryptoKey } = require('../../libraries/Crypto/cryptoUtils');

class BankingService {
    
    async getCertificate(username) {
        // Get public key from file
        const publicKey = await readFile(process.env.USER_CRT_PATH, `${username}.crt`);
        return publicKey;
    }

    async verifySignature(username, signature, data) {
        // Check for public key
        let isValid = false;

        const certificate = await this.getCertificate(username);
        if (!certificate) {
            return isValid;
        }

        // Import public key
        const publicKey = getPublicKeyFromCertificate(certificate);

        // Convert public key to CryptoKey object
        publicKey = await convertKeyObjectToCryptoKey(publicKey);

        // Verify signature
        isValid = verifySignature(publicKey, signature, data);

        // Return result
        return isValid;
    }
  
}

module.exports = BankingService;