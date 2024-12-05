const axios = require('axios');
require('dotenv').config();

const FOREIGN_API = process.env.FOREIGN_API;

// Fetch detailed data for a coin by its id
const fetchCoinDetailsAndStats = async (id) => {
  try {
    // Fetch OHLCV data for today
    const ohlcvResponse = await axios.get(`${FOREIGN_API}/coins/${id}/ohlcv/today`);
    const ohlcvData = ohlcvResponse.data[0];
    console.log(`${id} > OHLCV Data Retrieved Successfully`)
    // Fetch main coin details
    const coinResponse = await axios.get(`${FOREIGN_API}/coins/${id}`);
    const coinData = coinResponse.data;
    console.log(`${id} > Coin Data Retrieved Successfully`)
    // Fetch historical ticker data for the last 90 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);
    const formattedStartDate = startDate.toISOString().split('T')[0]; 
    const tickerResponse = await axios.get(`${FOREIGN_API}/tickers/${id}/historical?start=${formattedStartDate}&interval=1d`);
    const tickerHistory = tickerResponse.data;
    console.log(`${id} > Coin Ticker Data Retrieved Successfully from Starting Date as : ${formattedStartDate} `) 

    return {
      id: coinData.id,
      name: coinData.name,
      logo: coinData.logo,
      symbol: coinData.symbol,
      rank: coinData.rank,
      is_new: coinData.is_new,
      is_active: coinData.is_active,
      type: coinData.type,
      open: ohlcvData.open,
      high: ohlcvData.high,
      low: ohlcvData.low,
      close: ohlcvData.close,
      volume: ohlcvData.volume,
      ticker_history: tickerHistory.map((ticker) => ({
        timestamp: ticker.timestamp,
        price: ticker.price,
        volume_24h: ticker.volume_24h,
        market_cap: ticker.market_cap,
      })),
    };
  } catch (error) {
    console.error(`Error fetching details for coin ${id}:`, error);
    throw new Error(`Error fetching details for coin ${id}`);
  }
};

module.exports = { fetchCoinDetailsAndStats };
