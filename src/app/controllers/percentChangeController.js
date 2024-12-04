const { updatePercentChange } = require('../services/percentChangeService');

// Controller to handle the /percent-change route
const calculateAndUpdatePercentChange = async (req, res) => {
  try {
    // Call the service to calculate and update the percent change for each coin
    await updatePercentChange();

    res.status(200).json({ message: 'Percent change updated successfully!' });
  } catch (error) {
    console.error('Error in calculateAndUpdatePercentChange:', error.message);
    res.status(500).json({ message: 'Error updating percent change', error: error.message });
  }
};

module.exports = { calculateAndUpdatePercentChange };
