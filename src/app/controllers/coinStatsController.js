const { fetchCoinDetailsAndStats } = require('../services/coinStatsService');
const CoinStat = require('../models/CoinStats');
const Coin = require('../models/Coin'); // Original coins collection

const updateCoinStats = async (req, res) => {
  try {
    // Fetch all unique ids from the `coins` collection
    const ids = await Coin.distinct('id');
    if (ids.length === 0) {
      return res.status(404).json({ message: 'No coin IDs found in the database.' });
    }
    // Loop through each id and fetch its details and stats
    for (const id of ids) {
      const coinData = await fetchCoinDetailsAndStats(id); // Fetch data from APIs
      await CoinStat.findOneAndUpdate({ id: coinData.id }, coinData, { upsert: true }); // Upsert the data into CoinStat collection
    }

    res.status(200).json({ message: 'Coin stats updated successfully!' });
  } catch (error) {
    console.error('Error updating coin stats:', error);
    res.status(500).json({ message: 'Error updating coin stats', error: error.message });
  }
};

module.exports = { updateCoinStats };
