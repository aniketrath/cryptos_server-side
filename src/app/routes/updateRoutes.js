const express = require('express');
const { updateCoinDatabase } = require('../controllers/coinController');

const router = express.Router();

// Define the route to update the coin database
router.get('/coin-list', updateCoinDatabase);

module.exports = router;
