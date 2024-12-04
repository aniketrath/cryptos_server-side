// controllers/globalController.js

const GlobalStat = require('../models/GlobalData');

const getGlobalStats = async (req, res) => {
  try {
    // Fetch the GlobalCoinStats document (assuming only one document exists)
    const globalStats = await GlobalStat.findOne();

    if (!globalStats) {
      return res.status(404).json({ message: 'Global coin stats not found' });
    }

    // Return the global stats
    res.status(200).json(globalStats);
  } catch (error) {
    console.error('Error fetching global stats:', error);
    res.status(500).json({ message: 'Failed to fetch global stats', error: error.message });
  }
};

module.exports = { getGlobalStats };
