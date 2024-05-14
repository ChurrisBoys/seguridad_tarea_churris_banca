const UserRepository = require('./userRepository.js');

class UserService {
  constructor(db) {
    this.userRepository = new UserRepository(db);
  }

    async GetUserByUsername(username) {
        return this.userRepository.GetUserByUsername(username);
    }
}

module.exports = UserService;