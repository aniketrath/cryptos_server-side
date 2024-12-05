const { fetchCoinDetailsAndStats } = require('../services/coinStatsService');
const CoinStat = require('../models/CoinStats');
const Coin = require('../models/Coin'); // Original coins collection

const updateCoinStats = async (req, res) => {
  try {
    // Define the cutoff time (4 hours ago)
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);

    // Fetch 15 random unique IDs not updated in the last 4 hours
    const ids = await Coin.aggregate([
      {
        $lookup: {
          from: "coinstats", // CoinStat collection
          localField: "id",
          foreignField: "id",
          as: "stats",
        },
      },
      {
        $match: {
          $or: [
            { "stats.updatedAt": { $exists: false } }, // No stats exist
            { "stats.updatedAt": { $lt: fourHoursAgo } }, // Not updated in the last 4 hours
          ],
        },
      },
      { $sample: { size: 15 } }, // Randomly select 15 coins
      { $project: { id: 1, _id: 0 } }, // Include only the `id` field
    ]);

    // If no coins are found, respond with a message
    if (ids.length === 0) {
      return res.status(200).json({ message: 'No coins need updating.' });
    }

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
