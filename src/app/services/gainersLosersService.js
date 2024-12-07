const CoinStat = require('../models/CoinStats');
const log = require('../utils/logger')

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
            log('[SUCCESS]',`Looks like Nobody Gained`);
            return { message: 'Looks like Nobody Gained' };
        }
        // Sort coins based on the percent_change in descending order
        const sortedGainers = coins.sort((a, b) => b.change_24hr - a.change_24hr);
        log('[SUCCESS]',`Today's Gainers retrieved Successfully`);
        return sortedGainers;
    } catch (error) {
        log('[FAILURE]',`Error in getTopGainers: ${error}`);
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
            log('[SUCCESS]',`Looks like Nobody Lost`);
            return { message: 'Looks like Nobody Lost'};
        }
        // Sort coins based on the percent_change in ascending order (most negative first)
        const sortedLosers = coins.sort((a, b) => a.percent_change - b.percent_change);
        return sortedLosers;
    } catch (error) {
        log('[FAILURE]',`Error in getTopLosers: ${error}`);
        throw new Error('Failed to fetch top losers');
    }
};

module.exports = {
    getTopGainers,
    getTopLosers,
};
