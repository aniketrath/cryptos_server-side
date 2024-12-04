const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// Registration route
router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await register(req, res);
  }
);

// Login route
router.post(
  '/login',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await login(req, res);
  }
);

// Logout route
router.post('/logout', async (req, res) => {
  await logout(req, res);
});

module.exports = router;
