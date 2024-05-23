const jwt = require('jsonwebtoken');
const HS384Strategy = require('../JWT/HS384Strategy'); // Adjust the path as needed

const jwtSigning = new HS384Strategy(process.env.JWT_SECRET); // Get the secret from environment variables

function authenticateToken(req, res, next) {
  // Get the token from the Authorization header (Bearer token)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // If no token, return unauthorized

  // Verify the token
  jwtSigning.verify(token)
    .then(user => {
      req.user = user; // Store user data in the request object
      next(); // Move on to the next middleware or route handler
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(403); // Forbidden if token is invalid
    });
}

module.exports = authenticateToken; 