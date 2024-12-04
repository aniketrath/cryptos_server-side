const { getTopGainers, getTopLosers } = require('../services/gainersLosersService');

/**
 * Controller for the `/gainers` route.
 * Returns the top 5 coins with the highest positive percent change.
 */
const gainersController = async (req, res) => {
  try {
    const topGainers = await getTopGainers();
    res.status(200).json(topGainers);
  } catch (error) {
    console.error('Error fetching top gainers:', error);
    res.status(500).json({ message: 'Failed to fetch top gainers', error: error.message });
  }
};

/**
 * Controller for the `/losers` route.
 * Returns the top 5 coins with the highest negative percent change.
 */
const losersController = async (req, res) => {
  try {
    const topLosers = await getTopLosers();
    res.status(200).json(topLosers);
  } catch (error) {
    console.error('Error fetching top losers:', error);
    res.status(500).json({ message: 'Failed to fetch top losers', error: error.message });
  }
};

module.exports = {
  gainersController,
  losersController,
};
