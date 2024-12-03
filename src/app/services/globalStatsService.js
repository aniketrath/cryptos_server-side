// services/globalStatsService.js
const axios = require('axios');
const GlobalCoinStats = require('../models/GlobalData'); // Adjust path as needed

// Function to fetch data from the global endpoint and return the processed result
const fetchGlobalStatsData = async () => {
  try {
    // Fetch data from the global endpoint
    const response = await axios.get('https://api.coinpaprika.com/v1/global');
    const globalData = response.data;

    // Return the data in the required format
    return {
      market_cap_usd: globalData.market_cap_usd,
      volume_24h_usd: globalData.volume_24h_usd,
      bitcoin_dominance_percentage: globalData.bitcoin_dominance_percentage,
      cryptocurrencies_number: globalData.cryptocurrencies_number,
      market_cap_ath_value: globalData.market_cap_ath_value,
      market_cap_ath_date: globalData.market_cap_ath_date,
      volume_24h_ath_value: globalData.volume_24h_ath_value,
      volume_24h_ath_date: globalData.volume_24h_ath_date,
      market_cap_change_24h: globalData.market_cap_change_24h,
      volume_24h_change_24h: globalData.volume_24h_change_24h,
      last_updated: globalData.last_updated,
    };
  } catch (error) {
    console.error("Error fetching global data:", error);
    throw new Error("Error fetching global data", error);
  }
};

// Function to save the fetched global data to MongoDB
const saveGlobalStats = async (globalStats) => {
  try {
    // Drop the existing collection
    await GlobalCoinStats.collection.drop();

    const newGlobalStats = new GlobalCoinStats(globalStats);
    await newGlobalStats.save();
    console.log("Global data saved successfully.");
  } catch (error) {
    console.error("Error saving global data:", error);
    throw new Error("Error saving global data");
  }
};

// Export functions for use in the controller
module.exports = {
  fetchGlobalStatsData,
  saveGlobalStats,
};
