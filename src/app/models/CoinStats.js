const mongoose = require('mongoose');

// Define the schema for the Coin model
const coinSchema = new mongoose.Schema({
    logo: {
        type: String,
        required: true, // The logo image URL
    },
    symbol: {
        type: String,
        required: true,
        unique: true,  // Ensures that the symbol is unique across the collection
        trim: true,  // Removes unnecessary whitespace
    },
    price_usd: {
        type: Number,
        required: true,  // The price in USD
    },
    price_btc: {
        type: Number,
        required: true,  // The price in BTC
    },
    ohlc_history: [
        {
            type: [String],  // Array of numbers, each representing [open, high, low, close]
            required: false,  // You can choose whether it's required or optional
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,  // Automatically set creation date
    },
});

// Create and export the Coin model
module.exports = mongoose.model('CoinStat', coinSchema);
