const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        // We do not exit process during development to prevent server crashing entirely on startup just because URI is incomplete
        // process.exit(1); 
    }
};

module.exports = connectDB;
