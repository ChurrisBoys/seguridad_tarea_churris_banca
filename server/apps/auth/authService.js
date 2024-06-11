const { compare } = require('bcrypt');
const logger = require('../../libraries/Log/logger');
class AuthService {
    constructor(userService, JWTSigningStrategy) {
        this.userService = userService;
        this.JWTSigningStrategy = JWTSigningStrategy;
    }

    async ComparePassword(user, inputedPassword) {
        return await compare(inputedPassword, user.password);
    }

    async GetUser(username) {
        return await this.userService.GetUserByUsername(username);
    }

    sign(user) {
        const payload = {
            username: user.username,
        };
        return this.JWTSigningStrategy.sign(payload);
    }

    verifyToken(token) {
        return this.JWTSigningStrategy.verify(token);
    }

    async LogIn(username, inputedPassword) {
        var user = await this.GetUser(username);
        if (!user) {
            logger.error('User not found');
            throw new Error('User not found');
        }
        if (await this.ComparePassword(user, inputedPassword)) {
            logger.info('User logged in');
            return this.sign(user);
        } else {
            logger.error('Invalid username or password');
            throw new Error('Invalid username or password');
        }
    }

}

module.exports = AuthService;