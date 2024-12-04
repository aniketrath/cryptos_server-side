const express = require('express');
const { suggestionsController } = require('../controllers/suggestionsController');
const { trendingController } = require('../controllers/trendingController');
const { gainersController, losersController } = require('../controllers/gainersLosersController');
const { getGlobalStats } = require('../controllers/globalStatController');

const router = express.Router();

router.get('/suggestions', suggestionsController);
router.get('/trending', trendingController);
router.get('/gainers', gainersController);
router.get('/losers', losersController);
router.get('/global/status', getGlobalStats);

module.exports = router;
