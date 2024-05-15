// Implement the repository pattern for the user entity

class UserRepository {
    constructor(db) {
        this.db = db;
    }

    // Get a user by username
    async GetUserByUsername(username) {
        try {
            const rows = await this.db.query('SELECT * FROM Users WHERE username = ?', [username]);
            console.log('rows:', rows);
            return rows.length > 0 ? rows[0] : null;
        } catch (err) {
            console.error('Failed to fetch user:', err);
            throw new Error('Failed to fetch user');
        }
    }
}

module.exports = UserRepository;