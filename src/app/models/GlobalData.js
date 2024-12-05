const mongoose = require('mongoose');

// Define the schema for the GlobalCoinStats model
const globalCoinStatsSchema = new mongoose.Schema({
    market_cap_usd: {
        type: Number,
        required: true,
    },
    volume_24h_usd: {
        type: Number,
        required: true,
    },
    bitcoin_dominance_percentage: {
        type: Number,
        required: true,
    },
    cryptocurrencies_number: {
        type: Number,
        required: true,
    },
    market_cap_ath_value: {
        type: Number,
        required: true,
    },
    market_cap_ath_date: {
        type: String, // Timestamp string
        required: true,
    },
    volume_24h_ath_value: {
        type: Number,
        required: true,
    },
    volume_24h_ath_date: {
        type: String, // Timestamp string
        required: true,
    },
    market_cap_change_24h: {
        type: Number,
        required: true,
    },
    volume_24h_change_24h: {
        type: Number,
        required: true,
    },
    last_updated: {
        type: Number, // Unix timestamp
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,  // Automatically set creation date
    },
},
{
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Create and export the GlobalCoinStats model
module.exports = mongoose.model('GlobalCoinStats', globalCoinStatsSchema);
