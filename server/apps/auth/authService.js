const { compare } = require('bcrypt');
class AuthService {
    constructor(userService, JWTSigningStrategy) {
        this.userService = userService;
        this.JWTSigningStrategy = JWTSigningStrategy;
    }

    async ComparePassword(user, inputedPassword) {
        return compare(inputedPassword, user.password);
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
        user = await this.GetUser(username);
        if (await this.ComparePassword(user, inputedPassword)) {
            return this.sign(user);
        } else {
            throw new Error('Invalid username or password');
        }
    }

}

module.exports = AuthService;