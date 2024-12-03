// controllers/globalStatsController.js
const { fetchGlobalStatsData, saveGlobalStats } = require('../services/globalStatsService');

// Controller function to fetch and save global stats data
const updateGlobalStats = async (req, res) => {
  try {
    // Fetch global stats data
    const globalStats = await fetchGlobalStatsData();

    // Save the fetched data to the database
    await saveGlobalStats(globalStats);

    // Send a success response to the client
    res.status(200).json({ message: 'Global stats updated successfully' });
  } catch (error) {
    console.error("Error in updateGlobalStats:", error);
    res.status(500).json({ message: 'Error updating global stats', error: error.message });
  }
};

// Export controller functions for use in the route file
module.exports = {
  updateGlobalStats,
};
