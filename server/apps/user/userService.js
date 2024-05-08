import UserRepository from './userRepository';

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

    async GetUserByUsername(username) {
        return await this.userRepository.GetUserByUsername(username);
    }
}