const express = require('express');
const { updateCoinDatabase } = require('../controllers/coinController');
const { updateCoinStats } = require('../controllers/coinStatsController');
const { updateGlobalStats } = require('../controllers/globalDataController')

const router = express.Router();

// Define the route to update the coin database
router.get('/coin-list', updateCoinDatabase)
router.get('/coin-stats', updateCoinStats)
router.get('/global-update',updateGlobalStats)


module.exports = router;
