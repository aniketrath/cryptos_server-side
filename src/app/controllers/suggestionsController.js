const { getSuggestions } = require('../services/suggestionsService');

/**
 * Controller for fetching coin suggestions.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const suggestionsController = async (req, res, next) => {
  try {
    const suggestions = await getSuggestions();
    res.status(200).json(suggestions); // Ensure `res` is properly used here
  } catch (error) {
    console.error('Error in suggestionsController:', error);
    res.status(500).json({ error: error.message }); // Ensure `res` is properly used for errors
  }
};

module.exports = {
  suggestionsController,
};
