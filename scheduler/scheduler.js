require('dotenv').config();
const axios = require('axios');
const cron = require('node-cron');
const { Mutex } = require('async-mutex');
const log = require('./logger');

// Environment Variables
const expressServerUrl = process.env.SERVER_URL;
const loginUrl = '/auth/login';
const username = process.env.USERNAME;
const password = process.env.PASSWD;

// Validate environment variables
if (!expressServerUrl || !username || !password) {
  log({ level: '[FAILURE]', message: 'Unable to determine ENV_VARIABLES!' });
  process.exit(1);
}

// Mutex for synchronization
const mutex = new Mutex();

// Variable to store the token
let token = null;

// Function to log in and retrieve the token
async function getToken() {
  try {
    log({ level: '[INFO]', status: '200', message: 'Acquiring TOKEN', endpoint: '/login' });
    const response = await axios.post(`${expressServerUrl}${loginUrl}`, { username, password });
    token = response.data.token;
    if (!token) {
      log({ level: '[FAILURE]', status: '500', message: 'Token acquisition failed', endpoint: '/login' });
      return null;
    }
    log({ level: '[SUCCESS]', status: '200', message: 'Token acquired successfully', endpoint: '/login' });
    return token;
  } catch (error) {
    log({
      level: '[FAILURE]',
      status: '500',
      message: `Error acquiring token: ${error.message}`,
      endpoint: '/login',
    });
    return null;
  }
}

// Function to call an API with the token
async function callApi(endpoint) {
  await mutex.runExclusive(async () => {
    try {
      const url = `${expressServerUrl}${endpoint}`;
      log({ level: '[INFO]', message: `@: ${url}` });
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      log({
        level: '[SUCCESS]',
        status: response.status,
        message: 'API call successful',
        endpoint,
      });
    } catch (error) {
      const statusCode = error.response ? error.response.status : '500';
      const errorMessage = error.response
        ? JSON.stringify(error.response.data, null, 2)
        : error.message;
      log({
        level: '[FAILURE]',
        status: statusCode,
        message: `API call failed: ${errorMessage}`,
        endpoint,
      });
      if (statusCode === 401) {
        log({ level: '[WARNING]', message: 'Token expired. Re-authenticating...' });
        token = await getToken();
      }
    }
  });
}

// Queue structure to manage execution order
async function executeInOrder(...tasks) {
  for (const task of tasks) {
    await task();
  }
}

// Function to schedule API calls
function scheduleApiCalls() {
  const run24HourApis = async () => {
    log({ level: '[INFO]', message: 'Running 24-hour APIs...' });
    await callApi('/update/coin-list');
    await callApi('/update/global-update');
  };

  const runHourlyApis = async () => {
    log({ level: '[INFO]', message: 'Running hourly APIs...' });
    await callApi('/update/coin-stats');
    await callApi('/update/percent-change');
  };

  const run5MinApis = async () => {
    log({ level: '[INFO]', message: 'Running 5-minute APIs...' });
    await callApi('/app/suggestions');
    await callApi('/app/trending');
    await callApi('/app/global/status');
    await callApi('/app/gainers');
    await callApi('/app/losers');
  };

  // Ensure execution order for immediate runs
  executeInOrder(run24HourApis, runHourlyApis, run5MinApis);

  // Schedule tasks
  cron.schedule('0 0 * * *', async () => {
    await executeInOrder(run24HourApis, runHourlyApis, run5MinApis); // Runs at midnight
  });

  cron.schedule('0 * * * *', async () => {
    await executeInOrder(runHourlyApis, run5MinApis); // Hourly run
  });

  cron.schedule('*/5 * * * *', async () => {
    await run5MinApis(); // 5-minute run
  });
}

// Main function to start the scheduler
async function startScheduler() {
  if (!token) {
    log({ level: '[INFO]', message: 'No token found. Logging in...' });
    token = await getToken();
  }

  if (token) {
    scheduleApiCalls();
  } else {
    log({ level: '[FAILURE]', message: 'Unable to start scheduler due to missing TOKEN.' });
    process.exit(1);
  }
}

// Start the scheduler
startScheduler();
