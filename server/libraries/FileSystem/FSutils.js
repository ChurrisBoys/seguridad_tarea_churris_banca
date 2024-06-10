const fs = require('fs');

async function readFile(pathToSearch, nameOfFile) {
    return new Promise((resolve, reject) => {
        fs.readFile(`${pathToSearch}/${nameOfFile}`, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        }
        );
    }
    );
}

module.exports = readFile;