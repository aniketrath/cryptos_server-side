const { getTrendingCoins } = require('../services/trendingService');

/**
 * Controller to handle the `/trending` route,
 * which returns the list of coins sorted by their 24h trading volume.
 */
const trendingController = async (req, res) => {
  try {
    // Fetch the trending coins
    const trendingCoins = await getTrendingCoins();

    // Return the sorted coins as the response
    res.status(200).json(trendingCoins);
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    res.status(500).json({ message: 'Failed to fetch trending coins', error: error.message });
  }
};

module.exports = {
  trendingController,
};
