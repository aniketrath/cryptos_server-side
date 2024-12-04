const CoinStat = require('../models/CoinStats');
const calculatePercentageChange = require('../utils/percentageChange');

/**
 * Service to fetch 50 random entries from the CoinStat collection
 * and calculate the percentage change between the latest two ticker_history objects.
 *
 * @returns {Promise<Array>} An array of coin objects with all params from the database
 *                           and an additional 'percent_change' param.
 */
const getSuggestions = async () => {
  try {
    // Fetch 50 random coins from the database
    const randomCoins = await CoinStat.aggregate([{ $sample: { size: 5 } }]);

    // Process each coin to calculate percentage change
    const coinsWithChange = randomCoins.map((coin) => {
      // Ensure the coin has at least two ticker history entries
      if (!coin.ticker_history || coin.ticker_history.length < 2) {
        throw new Error(`Insufficient ticker history for coin: ${coin.id}`);
      }

      // Extract the latest and second latest ticker history objects
      const latest = coin.ticker_history[coin.ticker_history.length - 1];
      const previous = coin.ticker_history[coin.ticker_history.length - 2];

      // Ensure both objects have a valid price property
      if (typeof latest.price !== 'number' || typeof previous.price !== 'number') {
        throw new Error(`Missing or invalid price data in ticker history for coin: ${coin.id}`);
      }

      // Calculate percentage change using the utility function
      const percentChange = calculatePercentageChange(latest.price, previous.price);

      // Return the coin object with an additional 'percent_change' property
      return { ...coin, percent_change: percentChange };
    });

    return coinsWithChange;
  } catch (error) {
    console.error('Error in getSuggestions:', error);
    throw new Error('Failed to fetch and process suggestions');
  }
};

module.exports = {
  getSuggestions,
};
