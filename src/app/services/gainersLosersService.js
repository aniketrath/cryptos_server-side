const CoinStat = require('../models/CoinStats');

/**
 * Service to fetch the top gainers sorted by highest positive percent change.
 *
 * @returns {Promise<Array>} An array of coins with the highest positive percent changes.
 */
const getTopGainers = async () => {
    try {
        // Fetch all coins from the CoinStat collection
        const coins = await CoinStat.find({ change_24hr: { $gt: 0 } }); // Filter only positive percent change
        if(coins.length == 0){
            return { message: 'Looks like Nobody Gained 😒' };
        }
        // Sort coins based on the percent_change in descending order
        const sortedGainers = coins.sort((a, b) => b.change_24hr - a.change_24hr);
        return sortedGainers;
    } catch (error) {
        console.error('Error in getTopGainers:', error);
        throw new Error('Failed to fetch top gainers');
    }
};

/**
 * Service to fetch the top losers sorted by highest negative percent change.
 *
 * @returns {Promise<Array>} An array of coins with the highest negative percent changes.
 */
const getTopLosers = async () => {
    try {
        // Fetch all coins from the CoinStat collection
        const coins = await CoinStat.find({ percent_change: { $lt: 0 } }); // Filter only negative percent change
        if(coins.length === 0){
            return { message: 'Looks like Nobody Lost 😁'};
        }
        // Sort coins based on the percent_change in ascending order (most negative first)
        const sortedLosers = coins.sort((a, b) => a.percent_change - b.percent_change);
        return sortedLosers;
    } catch (error) {
        console.error('Error in getTopLosers:', error);
        throw new Error('Failed to fetch top losers');
    }
};

module.exports = {
    getTopGainers,
    getTopLosers,
};
