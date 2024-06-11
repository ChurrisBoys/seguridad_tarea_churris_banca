const readFile = require('../../libraries/FileSystem/FSutils');
const { verifySignature, getPublicKeyFromCertificate, convertKeyObjectToCryptoKey } = require('../../libraries/Crypto/cryptoUtils');
const createTransaction = require('./bankingCGI');

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
        const CryptoPublicKey = getPublicKeyFromCertificate(certificate);

        // Convert public key to CryptoKey object
        let publicKey = await convertKeyObjectToCryptoKey(CryptoPublicKey);

        // Verify signature
        isValid = await verifySignature(publicKey, signature, data);

        // Return result
        return isValid;
    }

    async createTransaction(username, transactionData) {
        try {
            await createTransaction(username, transactionData.recipient, transactionData.amount);
        } catch (error) {
            throw error;
        }
    }

}

module.exports = BankingService;