const CoinStat = require('../models/CoinStats');
const log = require('../utils/logger')
// Helper function to calculate percent change
const calculatePercentChange = (oldPrice, newPrice) => {
  log('[INFO]',`Calculating Percent Change`);
  if (!oldPrice || !newPrice) return 0;
  return ((newPrice - oldPrice) / oldPrice) * 100;
};

// Service to get all coins, calculate percentage change, and update the database
const updatePercentChange = async () => {
  try {
    // Fetch all coins from the CoinStat collection
    const coins = await CoinStat.find();
    // Loop through each coin and calculate percent change
    for (const coin of coins) {
      const tickerHistory = coin.ticker_history;
      if (tickerHistory.length >= 2) {
        // Get the last two entries from ticker_history
        const latest = tickerHistory[0];
        const secondLatest = tickerHistory[1];

        // Calculate the percent change between the two prices
        const percentChange = calculatePercentChange(secondLatest.price, latest.price);

        // Update the coin document with the new percent change
        await CoinStat.findOneAndUpdate(
          { id: coin.id },
          { change_24hr: percentChange },
          { new: true }
        );
      }
    }

    log('[SUCCESS]',`Calculating Insertion/Updation Sucessfull`);
  } catch (error) {
    log('[FAILURE]',`Error updating percent change : ${error}`);
    throw new Error('Error updating percent change');
  }
};

module.exports = { updatePercentChange };
