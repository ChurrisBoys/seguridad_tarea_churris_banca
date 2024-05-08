import JWTSigningStrategy from '../../libraries/JWT/JWTSigningStrategy';


class AuthService {
    constructor(userService) {
        this.userService = userService;
    }

    async ComparePassword(user, inputedPassword) {
        return user.password === inputedPassword;
    }

    async GetUser(username) {
        return await this.userService.GetUserByUsername(username);
    }

    sign(user) {
        const payload = {
            username: user.username,
        };
        return JWTSigningStrategy.sign(payload);
    }

    verifyToken(token) {
        return JWTSigningStrategy.verify(token);
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