/**
 * Calculates the percentage change between two numbers.
 *
 * @param {number} latest - The latest value.
 * @param {number} previous - The previous value.
 * @returns {number} The percentage change, rounded to two decimal places.
 * @throws {Error} If previous is zero (to avoid division by zero).
 */
const calculatePercentageChange = (latest, previous) => {
    if (previous === 0) {
      throw new Error('Previous value cannot be zero when calculating percentage change.');
    }
    const percentChange = ((latest - previous) / previous) * 100;
    return parseFloat(percentChange.toFixed(2));
  };
  
  module.exports = calculatePercentageChange;
  