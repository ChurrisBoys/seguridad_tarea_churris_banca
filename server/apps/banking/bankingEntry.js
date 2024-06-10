const express = require('express');
const router = express.Router();
const authenticateToken = require('../../libraries/Session/authMiddleware');
const {validateAmount, validateUsername } = require('../../libraries/Validators/validators');
const BankingService = require('./bankingService')

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
        dataSignature = Buffer.from(signature, 'hex');
    
        try {
            // Verify signature
            const isValid = await bankingService.verifySignature(req.user.username, dataSignature, data);
            if (!isValid) {
                return res.status(400).json({ message: 'Invalid signature. Cannot verify user'});
            }

            return res.status(200).json({ message: 'Transaction created successfully' });
    
            // Create transaction
            // const transaction = await createTransaction(transactionData);
    
            // res.json({ transaction });
    
        } catch (error) {
            console.error('Error creating transaction:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });



    return router;
}

module.exports = createBankingRouter;
