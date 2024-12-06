const axios = require('axios'); // For making HTTP requests
const cron = require('node-cron'); // For scheduling tasks
require('dotenv').config();
const chalk = require('chalk'); // For colored console output

const expressServerUrl = process.env.SERVER_URL; // Adjust to your Express server URL
const loginUrl = '/auth/login'; // Adjust to your login endpoint
const username = process.env.USERNAME; // Your username
const password = process.env.PASSWD; // Your password

// Variable to store the token in memory
let token = null;

// Function to log in and retrieve the token
async function getToken() {
  try {
    console.log('Requesting token...');
    const response = await axios.post(`${expressServerUrl}${loginUrl}`, {
      username,
      password,
    });

    // Assuming the response contains a token field
    token = response.data.token;
    if (!token) {
      console.error('Failed to retrieve the token');
      return null;
    }
    console.log(chalk.green('Token retrieved successfully'));
    return token;
  } catch (error) {
    console.error(chalk.red('Error logging in to Express server:', error.message));
    return null;
  }
}

// Utility to get the formatted date
function getFormattedDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}:${hours}${minutes}`;
}

// Function to call an API with Bearer token
async function callApi(endpoint) {
  try {
    const timestamp = getFormattedDate();
    console.log(chalk.blue(`${timestamp} 200 PASSED Calling ${chalk.yellow(endpoint)} with Bearer token...`));
    const response = await axios.get(`${expressServerUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Optional: check if Content-Type is needed
      },
    });
    console.log(chalk.blue(`${timestamp} ${response.status} PASSED Response from ${chalk.yellow(endpoint)}`));
  } catch (error) {
    const timestamp = getFormattedDate();
    const statusCode = error.response ? error.response.status : '500'; // Default to 500 if no response
    console.error(chalk.blue(`${timestamp} ${statusCode} FAILED Error calling ${chalk.yellow(endpoint)}:\n${error.message}`));
  }
}

// Function to schedule the cron jobs
function scheduleApiCalls() {
  // Schedule the 24-hour APIs to run once immediately and then every 24 hours
  const run24HourApis = async () => {
    console.log('Running 24-hour APIs...', new Date());
    await callApi('/update/coin-list');
    await callApi('/update/global-update');
  };

  // Run immediately for the first time
  run24HourApis();
  // Schedule to run every 24 hours after that
  cron.schedule('0 0 * * *', run24HourApis); // Run at midnight (every 24 hrs)

  // Schedule the hourly APIs to run once immediately and then every hour
  const runHourlyApis = async () => {
    console.log('Running hourly APIs...', new Date());
    await callApi('/update/coin-stats');
    await callApi('/update/percent-change');
  };
  // Run immediately for the first time
  runHourlyApis();
  // Schedule to run every hour after that
  cron.schedule('0 * * * *', runHourlyApis); // Run every hour

  // Schedule the 5-minute internal DB health check APIs
  const dbHealthCheckEndpoints = async () => {
    console.log('Running 5-Min Internal DB APIs...', new Date());
    await callApi('/app/suggestions');
    await callApi('/app/trending');
    await callApi('/app/global/status');
    await callApi('/app/gainers');
    await callApi('/app/losers');
  };
  // Run immediately for the first time
  dbHealthCheckEndpoints();
  // Schedule to run every 5 minutes
  cron.schedule('*/5 * * * *', dbHealthCheckEndpoints);
}

// Main function to get token and start scheduling
async function startScheduler() {
  // If no token is already in memory, retrieve it
  if (!token) {
    console.log('No token found, logging in...');
    token = await getToken();
  }

  if (token) {
    scheduleApiCalls();
  } else {
    console.error(chalk.red('Unable to start scheduler due to missing token'));
  }
}

// Start the scheduler
startScheduler();
