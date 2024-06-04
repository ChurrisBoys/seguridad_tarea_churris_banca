import React, { useState } from 'react';
import Layout from "../Common/Layout";

// Input Components (with validation)
const AmountInput = () => {
    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState('');

    const handleChange = (event) => {
        const value = event.target.value;
        setAmount(value);

        if (value <= 0) {
            setAmountError('Amount must be greater than 0');
        } else {
            setAmountError('');
        }
    };

    return (
        <div>
            <label htmlFor="amount">Amount:</label>
            <input
                type="number"
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

function handleKeyUpload(privateKey) {
    let keyData = '';

    if (!privateKey) {
        alert('Please upload a private key file');
        return;
    }

    // Read the file, discartting the header and footer
    const reader = new FileReader();
    reader.onload() = async (event) => {
        const key = event.target.result;
        keyData = key.split('\n').slice(1, -1).join('');
    }
    reader.readAsText(privateKey);

    return keyData;
}

function importKey(keyData) {
    let importedKey = null;

    if (!keyData) {
        alert('Error importing key');
        return;
    }

    keyData = atob(keyData);

    // Prepare the keydata
    const keyDataArray = str2ab(keyData);

    // Import the key
    crypto.subtle.importKey(
        'pkcs8',
        keyDataArray,
        {
            name: 'RSA-OAEP',
            hash: 'SHA-384'
        },
        false,
        ['sign']
    ).then((key) => {
        importedKey = key;
    }).catch((error) => {
        console.error('Error importing key:', error);
    });

    return importedKey;
}

function prepareDataForSigning(transactionData) {
    const dataBuffer = new TextEncoder().encode(transactionData);

    return dataBuffer;
}

function signData(importedKey, dataToSend) {
    let signedData = null;

    if (!importedKey) {
        alert('Error signing data');
        return;
    }

    // Sign the data
    crypto.subtle.sign("RSASSA-PKCS1-v1_5", importedKey, dataToSend)
        .then((signature) => {
            signedData = signature;
        })
        .catch((error) => {
            console.error('Error signing data:', error);
        });

    return signedData;
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

        let keyData = handleKeyUpload(privateKey);
        let importedKey = importKey(keyData);

        // Form data is now validated and ready to be sent to the server
        const transactionData = {
            amount,
            recipient,
        };

        let dataToSend = prepareDataForSigning(transactionData);

        // Sign the data
        let signature = signData(importedKey, dataToSend);

        // Send the signed data to the server
        const response = await fetch(`${config.BASE_URL}/createTransaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                transactionData,
                signature
            })
        });

        if (response.status == 403) {
            alert('You must be logged in, error: ' + response.status);
        }

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        alert('Transaction created successfully');

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

export default CreateTransaction; // No need for a separate component function