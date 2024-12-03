const { getCoinsData, insertCoins } = require('../services/coinService');

const updateCoinDatabase = async (req, res) => {
  try {
    const coins = await getCoinsData();
    await insertCoins(coins);
    res.status(200).json({ message: 'Coin data updated successfully!' });
  } catch (error) {
    console.error('Error processing coin data:', error);
    res.status(500).json({ message: 'Error updating coin data', error: error.message });
  }
};

module.exports = { updateCoinDatabase };
