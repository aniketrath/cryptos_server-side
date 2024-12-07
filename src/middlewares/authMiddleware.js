const jwt = require('jsonwebtoken');
const log = require('../app/utils/logger')

// Secret key from environment variables
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const getFormattedDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-based
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}:${hours}${minutes}`;
};

// Middleware to authenticate requests using JWT
const authenticateJWT = (req, res, next) => {

  const timestamp = getFormattedDate()
  // Extract the JWT from the 'Authorization' header
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  // Get the IP address of the user
  const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
  log('[WARNING]',`Access Attempt from ip ${userIP}`);
  if (!token) {
    log('[FAILURE]',`Access Denied to ip ${userIP}`);
    return res
      .status(403)
      .json({ message: "Forbidden: Server can't determine any token 😿 . Try after Logging in 💀?? " });
  }

  // Verify the JWT
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      log('[FAILURE]',`Access Denied to ip ${userIP} due to use of Invalid TOKEN `);
      return res
        .status(403)
        .json({ message: 'Forbidden: Invalid token in use. You will be reported to the Admin 💀' });
    }
    log('[SUCCESS]',`Valid request from IP: ${userIP}, User: ${decoded.id || 'Unknown'}`)
    // Attach the decoded user information to the request object
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateJWT;
