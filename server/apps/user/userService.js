const UserRepository = require('./userDataAccess.js');

class UserService {
  constructor(db) {
    this.userRepository = new UserRepository(db);
  }

    async GetUserByUsername(username) {
        return this.userRepository.getUserByUsername(username);
    }
}

module.exports = UserService;