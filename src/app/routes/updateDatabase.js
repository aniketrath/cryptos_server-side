const express = require('express');
const axios = require('axios');
const Coin = require('../models/Coin'); // Adjust the path based on your project structure

const router = express.Router();

// Define the route to update the database with new coin data
router.get('/coin-list', async (req, res) => {
  try {
    // Fetch coin data from CoinPaprika API
    const response = await axios.get('https://api.coinpaprika.com/v1/coins');
    const coinData = response.data;

    if (!coinData || coinData.length === 0) {
      throw new Error('Error from CoinPaprika: ', response);
    }

    // Sort the data by rank in ascending order (or descending if you want the highest rank first)
    const sortedCoins = coinData
      .filter(coin => coin.rank !== 0)  // Exclude coins with rank 0
      .sort((a, b) => a.rank - b.rank);
    console.log("Sorted Data By Rank from Response @ CoinParika")
    // Slice the first 1000 coins after sorting
    const coinsToInsert = sortedCoins.slice(0, 1000).map(coin => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      rank: coin.rank,
      is_new: coin.is_new,
      is_active: coin.is_active,
      type: coin.type
    }));

    // Insert the sliced data in a batch (500 items)
    await Coin.insertMany(coinsToInsert);

    // Send a response to the client indicating the operation was successful
    res.status(200).json({ message: 'Coin data updated successfully!' });
  } catch (error) {
    console.error('Error fetching or saving coin data:', error.message);
    res.status(500).json({ message: 'Error updating coin data', error: error.message });
  }
});

module.exports = router;
