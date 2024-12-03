const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Connect to the User Database
        const userDB = await mongoose.createConnection(process.env.MONGO_USER_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to User Database successfully');

        // Connect to the App Database
        const appDB = await mongoose.createConnection(process.env.MONGO_APP_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to App Database successfully');

        // Return connections
        return { userDB, appDB };
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;