const axios = require('axios');
const Coin = require('../models/Coin');
const CoinStat = require('../models/CoinStats');
const log = require('../utils/logger')
require('dotenv').config();

const FOREIGN_API = process.env.FOREIGN_API;

const getCoinsData = async () => {
  try {
    log('[INFO]', `Collecting Coin Details from Foreign API`);
    const response = await axios.get(`${FOREIGN_API}/coins`);
    const coinData = response.data;
    log('[SUCCESS]', `Fetching Coin Name List from Foreign API`);
    // Filter out coins with rank 0 and sort by rank
    const filteredAndSortedCoins = coinData
      .filter(coin => coin.rank !== 0)  // Exclude coins with rank 0
      .sort((a, b) => a.rank - b.rank); // Sort by rank in ascending order

    // Map the filtered and sorted coins to the Coin model format
    const coinsToInsert = filteredAndSortedCoins.slice(0, 1000).map(coin => ({
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
    log('[FAILURE]', `Error fetching or processing coin data: ${error.message}`);
    throw new Error('Error fetching or processing coin data: ' + error.message);
  }
};

const insertCoins = async (coins) => {
  try {
    log('[INFO]', `Initiation Coin Insertion.`);
    // Drop the collection before inserting new data
    await Coin.collection.drop();
    log('[SUCCESS]', `Coin List Collection dropped successfully`);
    await CoinStat.collection.drop();
    log('[SUCCESS]', `Coin Stats Collection dropped successfully`);
    log('[SUCCESS]', `Welcome to a new Day .Now start working with Fresh Data`);
    // Insert new coins
    await Coin.insertMany(coins);
    log('[SUCCESS]', `Coin List Insertion to Db completed successfully`);
  } catch (error) {
    if (error.message === 'ns not found') {
      // This error means the collection does not exist yet, which is okay
      log('[SUCCESS]', `Coin List Collection Generated successfully`);
      await Coin.insertMany(coins);
      log('[SUCCESS]', `Coin List Insertion to Db completed successfully`);
    } else {
      log('[FAILURE]', `Coin List Insertion Failed : ${error.message}`);
      throw new Error('Error inserting coins into DB: ' + error.message);
    }
  }
};

const getCoinById = async (id) => {
  log('[INFO]', `Collecting Coin Details for ${id} from Database`)
  try {
    const coin = await CoinStat.findOne({ id }); // Query by the "id" field
    if (!coin) {
      throw new Error("Coin not found");
    }
    log('[SUCCESS]', `Coin Data Retrieved successfully`);
    return coin;
  } catch (error) {
    log('[FAILURE]', `Coin List Insertion Failed : ${error.message}`)
    throw new Error('Error inserting coins into DB: ' + error.message);
  }
};

module.exports = { getCoinsData, insertCoins, getCoinById };
