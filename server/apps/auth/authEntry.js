const express = require('express');
const router = express.Router();
const AuthService = require('./authService'); // Assuming AuthService is in the same directory
const HS384Strategy = require('../../libraries/JWT/HS384Strategy'); // Assuming HS384Strategy is in the same directory

function createAuthRouter(userService) {
    const jwtSigning = new HS384Strategy(process.env.JWT_SECRET);
    const authService = new AuthService(userService, jwtSigning);

    router.post('/login', async (req, res) => {
        const { username, password } = req.body;

        try {
            const token = await authService.LogIn(username, password);
            console.log('Token:', token);
            res.json({ token }); 
            
        } catch (error) {
            // More specific error handling 
            if (error.message === 'Invalid username or password') {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            // Handle other potential errors 
            console.error(error); 
            res.status(500).json({ message: 'Internal server error' }); 
        }
    }); 



    return router;
}

module.exports = createAuthRouter;
