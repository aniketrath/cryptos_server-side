const fs = require('fs');
const path = require('path');
const chalk = require('chalk'); // For colored console output
// Path to the log file
const LOG_FILE_PATH = '/var/log/server/backend.log';
// Ensure the directory and file exist
const ensureLogFileExists = () => {
  const dir = path.dirname(LOG_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true }); // Create directory if it doesn't exist
  }
  if (!fs.existsSync(LOG_FILE_PATH)) {
    fs.writeFileSync(LOG_FILE_PATH, ''); // Create the file if it doesn't exist
  }
};
// Function to get the formatted date
const getFormattedDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-based
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}:${hours}${minutes}`;
};

// Logging utility
const log = (status, msg) => {
  // Ensure the log file exists
  ensureLogFileExists();
  // Get the formatted timestamp
  const timestamp = getFormattedDate();
  // Determine status color
  let statusColor;
  if (status === '[SUCCESS]') {
    statusColor = chalk.bold.green(status);
  }else if (status === '[FAILURE]') {
    statusColor = chalk.bold.red(status);
  }else if (status === '[WARNING]') {
    statusColor = chalk.bold.yellow(status);
  }else if (status === '[INFO]') {
    statusColor = chalk.bold.gray(status);
  } else {
    statusColor = status; // Fallback for unformatted status
  }
  // Format the log message
  const formattedMessage = `${timestamp} ${status} ${msg}`;
  // Log to console with colored status
  console.log(`${timestamp} ${statusColor} ${msg}`);
  // Append log to the file
  fs.appendFileSync(LOG_FILE_PATH, formattedMessage + '\n', 'utf8');
};

module.exports = log;
