const { getSuggestions } = require('../services/suggestionsService');

/**
 * Controller to handle suggestions route.
 */
const suggestionsController = async (req, res) => {
  try {
    const suggestions = await getSuggestions();
    res.status(200).json(suggestions);
  } catch (error) {
    console.error('Error in suggestionsController:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
};

module.exports = {
  suggestionsController,
};
