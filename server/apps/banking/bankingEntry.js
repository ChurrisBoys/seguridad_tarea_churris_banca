const express = require('express');
const router = express.Router();
const authenticateToken = require('../../libraries/Session/authMiddleware');
const { validateAmount, validateUsername } = require('../../libraries/Validators/validators');
const BankingService = require('./bankingService');
const logger = require('../../libraries/Log/logger');

function createBankingRouter() {
    bankingService = new BankingService();

    router.post('/createTransaction', authenticateToken, async (req, res) => {
        const { transactionData, signature } = req.body;

        if (!transactionData || !signature) {
            return res.status(400).json({ message: 'Missing required data' });
        }

        if (!transactionData.amount || !transactionData.recipient) {
            return res.status(400).json({ message: 'Invalid transaction data' });
        }

        if (!validateAmount(transactionData.amount)) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        if (!validateUsername(transactionData.recipient)) {
            return res.status(400).json({ message: 'Invalid recipient' });
        }

        data = JSON.stringify(transactionData);
        dataSignature = hexStringToArrayBuffer(signature);

        try {
            // Verify signature
            dataToVerify = new TextEncoder().encode(data);
            const isValid = await bankingService.verifySignature(req.user.username, dataSignature, dataToVerify);
            if (!isValid) {
                return res.status(400).json({ message: 'Invalid signature. Cannot verify user' });
            }

            // Create transaction
            await bankingService.createTransaction(req.user.username, transactionData);
            res.status(200).json({ message: 'Transaction created' });

        } catch (error) {
            logger.error('Error creating transaction:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });



    return router;
}

function hexStringToArrayBuffer(hexString) {
    // Remove any potential whitespace from the hex string
    const cleanedHexString = hexString.replace(/\s/g, '');

    // Ensure the hex string has an even length
    if (cleanedHexString.length % 2 !== 0) {
        throw new Error('Invalid hex string: Length must be even.');
    }

    // Create an ArrayBuffer with half the length of the hex string
    const buffer = new ArrayBuffer(cleanedHexString.length / 2);
    const view = new Uint8Array(buffer);

    // Convert each pair of hex characters to a byte
    for (let i = 0; i < cleanedHexString.length; i += 2) {
        view[i / 2] = parseInt(cleanedHexString.substring(i, i + 2), 16);
    }

    return buffer;
}

module.exports = createBankingRouter;
