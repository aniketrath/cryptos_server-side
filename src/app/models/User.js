const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Removes unnecessary whitespace
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Ensures email is unique in the collection
        lowercase: true,  // Automatically converts the email to lowercase
        trim: true,  // Removes unnecessary whitespace
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set creation date
    },
});

// Pre-save hook to hash the password before saving it
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10); // Generate salt
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
        next();
    } catch (error) {
        next(error);
    }
});

// Add a method to verify passwords
userSchema.methods.isPasswordMatch = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);