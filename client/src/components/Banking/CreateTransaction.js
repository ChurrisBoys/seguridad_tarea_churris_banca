import React, { useState } from 'react';
import Layout from "../Common/Layout";
import config from '../../config'; // Make sure you have a config file for your BASE_URL

// Input Components (with validation)
const AmountInput = () => {
    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState('');
    const regex = /^\d{1,6}(\.\d{1,3})?$/

    const handleChange = (event) => {
        const value = event.target.value;
        setAmount(value);

        if (!regex.test(value)) {
            setAmountError('Amount must be a number with up to 6 digits before the decimal and up to 3 digits after the decimal');
        } else {
            setAmountError('');
        }
    };

    return (
        <div>
            <label htmlFor="amount">Amount:</label>
            <input
                type="text"
                id="amount"
                name="amount"
                value={amount}
                onChange={handleChange}
            />
            {amountError && <div className="error">{amountError}</div>}
        </div>
    );
};

const RecipientInput = () => {
    const [recipient, setRecipient] = useState('');
    const [recipientError, setRecipientError] = useState('');

    const handleChange = (event) => {
        const value = event.target.value;
        setRecipient(value);

        if (value.length < 3) {
            setRecipientError('Recipient username must be at least 3 characters');
        } else {
            setRecipientError('');
        }
    };

    return (
        <div>
            <label htmlFor="recipient">Recipient username:</label>
            <input
                type="text"
                id="recipient"
                name="recipient"
                value={recipient}
                onChange={handleChange}
            />
            {recipientError && <div className="error">{recipientError}</div>}
        </div>
    );
};

// Private Key Input (with warnings)
const PrivateKeyInput = () => {
    const [privateKeyFile, setPrivateKeyFile] = useState(null);

    const handleChange = (event) => {
        setPrivateKeyFile(event.target.files[0]);
    };

    return (
        <div>
            <div className="warning">
                <h2>WARNING: INSECURE KEY UPLOAD</h2>
                <p>
                    Uploading your private key file is highly insecure and should NEVER be done in a real-world application.
                </p>
                <p>
                    This method is only allowed for this specific project. Do NOT use this key file for any other purpose.
                </p>
            </div>
            <label htmlFor="privateKey">Private Key (.key file):</label>
            <input
                type="file"
                id="privateKey"
                name="privateKey"
                accept=".key"
                onChange={handleChange}
            />
        </div>
    );
};

function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

async function handleKeyUpload(privateKey) {
    if (!privateKey) {
        alert('Please upload a private key file');
        return null;
    }

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const key = event.target.result;
            const keyData = key.replace('-----BEGIN PRIVATE KEY-----', '').replace('-----END PRIVATE KEY-----', '').replace(/\n/g, '');
            resolve(keyData);
        };
        reader.readAsText(privateKey);
    });
}

async function importKey(keyData) {
    if (!keyData) {
        alert('Error importing key');
        return null;
    }

    keyData = atob(keyData);
    const keyDataArray = str2ab(keyData);

    try {
        const importedKey = await crypto.subtle.importKey(
            'pkcs8',
            keyDataArray,
            {
                name: 'RSASSA-PKCS1-v1_5',
                hash: 'SHA-384'
            },
            true,
            ['sign']
        );
        return importedKey;
    } catch (error) {
        console.error('Error importing key:', error);
        alert('Error importing key. Please check the file and try again.');
        return null;
    }
}

function prepareDataForSigning(transactionData) {
    const dataBuffer = new TextEncoder().encode(JSON.stringify(transactionData));
    return dataBuffer;
}

async function createTransactionRequest(transactionData, signature) {
    try {
        const token = localStorage.getItem('token'); // Get JWT token 
        const response = await fetch(`${config.BASE_URL}/banking/createTransaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token // Include JWT in header
            },
            body: JSON.stringify({
                transactionData,
                signature
            })
        });

        return response;
    } catch (error) {
        console.error('Error sending transaction:', error);
        alert('Error sending transaction. Please try again later.');
    }
}

async function signData(importedKey, dataToSend) {
    if (!importedKey) {
        alert('Error signing data');
        return null;
    }

    try {
        const signatureBuffer = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", importedKey, dataToSend);
        // Convert signature to hexadecimal string
        const signatureHex = Array.from(new Uint8Array(signatureBuffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
        return signatureHex;
    } catch (error) {
        console.error('Error signing data:', error);
        alert('Error signing data.');
        return null;
    }
}

// Main CreateTransaction Component
const CreateTransaction = () => {
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Get form data
        const amount = event.target.amount.value;
        const recipient = event.target.recipient.value;
        const privateKey = event.target.privateKey.files[0];

        // Validate form data
        if (amount <= 0) {
            alert('Amount must be greater than 0');
            return;
        }

        if (recipient.length < 3) {
            alert('Recipient username must be at least 3 characters');
            return;
        }

        // Handle key upload and import (async/await)
        const keyData = await handleKeyUpload(privateKey);
        const importedKey = await importKey(keyData);

        // Form data is now validated and ready to be sent to the server
        const transactionData = {
            amount,
            recipient,
        };

        // Prepare data and sign - async/await 
        const dataToSend = prepareDataForSigning(transactionData);
        const signature = await signData(importedKey, dataToSend);

        if (!signature) {
            return; // Exit if signing failed
        }

        const response =
            await createTransactionRequest(transactionData, signature);

        if (response.status === 400) {
            alert('Invalid signature');
        } else if (response.status === 200) {
            alert('Transaction created successfully');
        } else {
            alert('Error creating transaction. Please try again later.');
        }
    };

    return (
        <Layout>
            <h1>Create Transaction</h1>
            <form onSubmit={handleSubmit}>
                <AmountInput />
                <RecipientInput />
                <PrivateKeyInput />
                <button type="submit">Create Transaction</button>
            </form>
        </Layout>
    );
};

export default CreateTransaction;


