const { fetchCoinDetailsAndStats } = require('../services/coinStatsService');
const CoinStat = require('../models/CoinStats');
const Coin = require('../models/Coin'); // Original coins collection

const updateCoinStats = async (req, res) => {
  try {
    // Fetch 15 random unique IDs not updated in the last 4 hours
    const ids = await Coin.aggregate([
      {
        $lookup: {
          from: "coinstats", // CoinStat collection
          localField: "id",   // Field in Coin collection
          foreignField: "id", // Field in CoinStat collection
          as: "stats",        // Resulting array will be named "stats"
        },
      },
      {
        $match: {
          "stats": { $size: 0 }, // No matching records in the CoinStats collection
        },
      },
      { $sample: { size: 15 } }, // Randomly select 15 coins
      { $project: { id: 1, _id: 0 } }, // Include only the `id` field
    ]);

    // If no coins are found, respond with a message
    if (ids.length === 0) {
      return res.status(200).json({ message: 'No coins need updating.' });
    }
    // Append additional elements to the `ids` array
    ids.push({ id: "btc-bitcoin" });
    ids.push({ id: "eth-ethereum" });

    // Loop through each ID and fetch its details and stats
    for (const { id } of ids) {
      const coinData = await fetchCoinDetailsAndStats(id); // Fetch data from external API

      // Upsert (update or insert) the data into CoinStat collection
      await CoinStat.findOneAndUpdate({ id: coinData.id }, coinData, { upsert: true, new: true });
    }

    res.status(200).json({ message: 'Coin stats updated successfully!' });
  } catch (error) {
    console.error('Error updating coin stats:', error);
    res.status(500).json({ message: 'Error updating coin stats', error: error.message });
  }
};

module.exports = { updateCoinStats };
