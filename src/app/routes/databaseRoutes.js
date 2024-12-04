const express = require('express');
const { suggestionsController } = require('../controllers/suggestionsController');

const router = express.Router();

router.get('/suggestions', suggestionsController);

module.exports = router;
