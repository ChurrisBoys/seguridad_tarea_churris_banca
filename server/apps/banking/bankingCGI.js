const logger = require("../../libraries/Log/logger");
const axios = require('axios');
const https = require('https');
const fs = require('fs');
// DEBUG AND TESTING ONLY

const options = {
    key: fs.readFileSync(process.env.SERVER_PK),
    cert: fs.readFileSync(process.env.SERVER_CRT), // TODO: Add more security to the access of the private key cert from javascript based attacks or related
    ca_cert: fs.readFileSync(process.env.CA_CRT)
};

async function createTransaction(username, receiver, amount) {
    try {
        const response = await axios.post('http://172.24.131.198/cgi-bin/seguridad_tarea_churris_banca_cgi/bin/seguridad_tarea_churris_banca_cgi.cgi?a=CT',
            `&${username}&${receiver}&${amount}`,
            {
                headers: {
                    'Content-Type': 'text/plain'
                },
                
                // httpsAgent: new https.Agent({
                //     cert: options.cert,
                //     key: options.key,
                //     ca: options.ca_cert
                // })
            });
        logger.info(`Transaction created: user ${username} created a transaction to ${receiver}`);

        console.log("data:" + response.data);

    } catch (error) {
        logger.error('Error creating transaction:', error);
        throw error;
    }
}

module.exports = createTransaction;