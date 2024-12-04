const axios = require('axios');
const Coin = require('../models/Coin');

const getCoinsData = async () => {
  try {
    const response = await axios.get('https://api.coinpaprika.com/v1/coins');
    const coinData = response.data;

    // Filter out coins with rank 0 and sort by rank
    const filteredAndSortedCoins = coinData
      .filter(coin => coin.rank !== 0)  // Exclude coins with rank 0
      .sort((a, b) => a.rank - b.rank); // Sort by rank in ascending order

    // Map the filtered and sorted coins to the Coin model format
    const coinsToInsert = filteredAndSortedCoins.slice(0, 10).map(coin => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      rank: coin.rank,
      is_new: coin.is_new,
      is_active: coin.is_active,
      type: coin.type,
    }));

    return coinsToInsert;
  } catch (error) {
    throw new Error('Error fetching or processing coin data: ' + error.message);
  }
};

const insertCoins = async (coins) => {
  try {
    // Drop the collection before inserting new data
    await Coin.collection.drop();
    console.log('Collection dropped successfully');

    // Insert new coins
    await Coin.insertMany(coins);
    console.log('Coins inserted successfully');
  } catch (error) {
    if (error.message === 'ns not found') {
      // This error means the collection does not exist yet, which is okay
      console.log('Collection does not exist, creating new collection.');
      await Coin.insertMany(coins);
      console.log('Coins inserted successfully');
    } else {
      throw new Error('Error inserting coins into DB: ' + error.message);
    }
  }
};

module.exports = { getCoinsData, insertCoins };
