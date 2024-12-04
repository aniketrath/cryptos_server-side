const CoinStat = require('../models/CoinStats');

/**
 * Service to fetch 5 random entries from the CoinStat collection
 * and return the data including the 'percent_change' stored in the database.
 *
 * @returns {Promise<Array>} An array of 5 random coin objects with all params from the database
 *                           and the 'percent_change' param already stored in the database.
 */
const getSuggestions = async () => {
  try {
    // Fetch 5 random coins from the database
    const randomCoins = await CoinStat.aggregate([{ $sample: { size: 5 } }]);
    // Return the fetched coins, which will include all parameters from the database including percent_change
    return randomCoins;
  } catch (error) {
    console.error('Error in getSuggestions:', error);
    throw new Error('Failed to fetch and process suggestions');
  }
};

module.exports = {
  getSuggestions,
};
