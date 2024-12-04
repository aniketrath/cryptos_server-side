const jwt = require('jsonwebtoken');

// Secret key from environment variables
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

// Middleware to authenticate requests using JWT
const authenticateJWT = (req, res, next) => {
  // Extract the JWT from the 'Authorization' header
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: "Forbidden: Server can't determine any token 😿 . Try after Logging in 💀?? " });
  }

  // Verify the JWT
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid token in use . You will be reported to the Admin 💀' });
    }
    // Attach the decoded user information to the request object
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateJWT;
