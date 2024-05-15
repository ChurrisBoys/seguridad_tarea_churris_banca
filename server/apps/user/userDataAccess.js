const mysql = require('mysql');

class UserDataAccess {
    constructor(connection) {
        this.connection = connection;
    }

    async GetUserByUsername(username) {
        const query = 'SELECT * FROM Users WHERE username = ?';
        const values = [username];
        
        await this.connection.query(query, values, (err, results) => {
            if (err) {
                console.error('Error fetching user by username: ' + err.stack);
            }
            return results[0];
        });
    }
}