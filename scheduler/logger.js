const fs = require('fs');
const path = require('path');
const chalk = require('chalk'); // For colored console output

// Path to the log file
const SCHEDULER_FILE_PATH = '/var/tmp/cryptos/scheduler.log';

// Ensure the log file and directory exist
const ensureLogFileExists = () => {
  const dir = path.dirname(SCHEDULER_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true }); // Create directory if it doesn't exist
  }
  if (!fs.existsSync(SCHEDULER_FILE_PATH)) {
    fs.writeFileSync(SCHEDULER_FILE_PATH, ''); // Create the file if it doesn't exist
  }
};

// Function to get the formatted date
const getFormattedDate = () => {
  const now = new Date();
  return now.toISOString().replace('T', ' ').slice(0, 19); // Format: YYYY-MM-DD HH:mm:ss
};

// Logging utility
const log = ({ level, status = '', statusCode = '', message = '', endpoint = '' }) => {
  // Ensure the log file exists
  ensureLogFileExists();
  // Get the formatted timestamp
  const timestamp = getFormattedDate();

  let levelColor;
  if (level === '[SUCCESS]') {
    levelColor = chalk.bold.green(level);
  }else if (status === '[FAILURE]') {
    levelColor = chalk.bold.red(level);
  }else if (level === '[WARNING]') {
    levelColor = chalk.bold.yellow(level);
  }else if (level === '[INFO]') {
    levelColor = chalk.bold.gray(level);
  } else {
    levelColor = level; // Fallback for unformatted status
  }

  // Format log entry for console and file
  const formattedConsoleMessage = `${chalk.bold.white(timestamp)} ${levelColor} ${chalk.green(status)} ${chalk.yellow(`${statusCode}`)} ${chalk.cyan(message)} ${chalk.yellow(endpoint)}`;
  const formattedFileMessage = `${timestamp} ${level} Status: ${status} StatusCode: ${statusCode} Message: ${message} Endpoint: ${endpoint}\n`;

  // Log to console with colored formatting
  console.log(formattedConsoleMessage);
  // Append log entry to the file
  fs.appendFileSync(SCHEDULER_FILE_PATH, formattedFileMessage, 'utf8');
};

module.exports = log;
