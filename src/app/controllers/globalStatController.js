// controllers/globalController.js
const log = require('../utils/logger')

const GlobalStat = require('../models/GlobalData');

const getGlobalStats = async (req, res) => {
  try {
    // Fetch the GlobalCoinStats document (assuming only one document exists)
    log('[INFO]', `Collecting Global Data`);
    const globalStats = await GlobalStat.findOne();

    if (!globalStats) {
      log('[FAILURE]', `Global Data Not Presend in Database . PLease Update Database`);
      return res.status(404).json({ message: 'Global coin stats not found' });
    }
    log('[SUCCESS]', `Global Data Retrieved successfully`);
    // Return the global stats
    res.status(200).json(globalStats);
  } catch (error) {
    console.error('Error fetching global stats:', error);
    log('[FAILURE]', `Error fetching global stats: ${error}`);
    res.status(500).json({ message: 'Failed to fetch global stats', error: error.message });
  }
}; 

module.exports = { getGlobalStats };
