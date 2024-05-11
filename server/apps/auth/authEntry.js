const express = require('express');
const router = express.Router();
const AuthService = require('./AuthService'); // Assuming AuthService is in the same directory
const UserService = require('../services/UserService'); 

const authService = new AuthService(new UserService()); 

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const token = await authService.LogIn(username, password);
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

module.exports = router;