const CoinStat = require('../models/CoinStats');

/**
 * Fetches 50 random entries from the CoinStat collection,
 * calculates percentage change using the `price` field in the last two entries of the ticker_history.
 * 
 * @returns {Array} Array of coin objects with an additional `percent_change` parameter.
 */

const getSuggestions = async () => {
    try {
        // Fetch 50 random entries from the collection
        const randomCoins = await CoinStat.aggregate([{ $sample: { size: 5 } }]);

        // Map over the coins to calculate percent_change
        const coinsWithChange = randomCoins.map((coin) => {
            if (!coin.ticker_history || coin.ticker_history.length < 2) {
                throw new Error(`Insufficient ticker history for coin: ${coin.id}`);
            }
            const latest = coin.ticker_history[coin.ticker_history.length - 1];
            const previous = coin.ticker_history[coin.ticker_history.length - 2];
            // Ensure the price fields exist
            if (!latest.price || !previous.price) {
                throw new Error(`Missing price data in ticker history for coin: ${coin.id}`);
            }
            // Calculate percentage change
            const percentChange = ((latest.price - previous.price) / previous.price) * 100;
            // Return the coin data with an added percent_change field
            return { ...coin, percent_change: percentChange.toFixed(2) };
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
