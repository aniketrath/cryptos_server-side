const { getCoinsData, insertCoins, getCoinById } = require('../services/coinService');

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
const getCoin = async (req, res) => {
  const { id } = req.query; // Expecting ?id=<id> in the query string
  if (!id) {
    return res.status(400).json({ error: "ID parameter is required" });
  }
  try {
    const coin = await getCoinById(id);
    return res.status(200).json(coin); // Send the coin details as JSON
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


module.exports = { updateCoinDatabase, getCoin };
