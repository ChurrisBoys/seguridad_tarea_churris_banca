const mysql = require('mysql');

class UserDataAccess {
    constructor(connection) {
        this.connection = connection;
    }

    async getUserByUsername(username) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Users WHERE username = ?';
            const values = [username];

            this.connection.query(query, values, (err, results) => {
                if (err) {
                    console.error('Error fetching user by username:', err);
                    reject(err); // Reject the promise on error
                } else {
                    resolve(results[0]); // Resolve with the first result (or null if none)
                }
            });
        });
    }
}

module.exports = UserDataAccess;