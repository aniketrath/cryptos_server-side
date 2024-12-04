const CoinStat = require('../models/CoinStats');

/**
 * Service to fetch the trending coins sorted by the latest 24h volume.
 *
 * @returns {Promise<Array>} An array of coins sorted by volume in descending order.
 */
const getTrendingCoins = async () => {
  try {
    // Fetch all coins from the CoinStat collection
    const coins = await CoinStat.find();

    // Sort coins based on the latest volume_24h from the ticker_history (descending order)
    const sortedCoins = coins.sort((a, b) => {
      const latestA = a.ticker_history[a.ticker_history.length - 1];
      const latestB = b.ticker_history[b.ticker_history.length - 1];
      return latestB.volume_24h - latestA.volume_24h;
    });

    return sortedCoins;
  } catch (error) {
    console.error('Error in getTrendingCoins:', error);
    throw new Error('Failed to fetch trending coins');
  }
};

module.exports = {
  getTrendingCoins,
};
