const mongoose = require('mongoose');

// Define the schema for the Coin model
const coinSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,  // Assuming the "id" is unique for each cryptocurrency
    },
    name: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: true,
    },
    symbol: {
        type: String,
        required: true,
    },
    rank: {
        type: Number,
        required: true,
    },
    is_new: {
        type: Boolean,
        default: false,  // Default to false if not specified
    },
    is_active: {
        type: Boolean,
        default: true,   // Default to true if not specified
    },
    type: {
        type: String,
        enum: ["coin", "token"], // You can adjust this enum based on expected values
        required: true,
    },
    change_24hr: {
        type: String,
    },
    ticker_history: [
        {
            timestamp: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            volume_24h: {
                type: Number,
                required: true,
            },
            market_cap: {
                type: Number,
                required: true,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,  // Automatically set creation date
    },
});

// Create and export the Coin model
module.exports = mongoose.model('CoinStat', coinSchema);
