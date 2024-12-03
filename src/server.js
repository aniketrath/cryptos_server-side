// Initialize environment variables from .env file
require('dotenv').config();
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
// Import the database connection function
const connectDB = require('./config/database');
//Import Routes :
const updateDatabase = require('./app/routes/updateRoutes');
const { log } = require('console');

// Initialize Express app @6000 by env
const app = express();
const port = process.env.PORT || 3000;
// Middleware to parse JSON bodies
app.use(express.json());
connectDB();


// Calling Imported Routes with Prefixes :
app.use('/update', updateDatabase);



// Default route to check if the server is working
app.get('/', (req, res) => {
    console.log("Server is Accessed")
    res.send('Server is running');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
