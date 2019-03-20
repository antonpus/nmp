const mongoose = require('mongoose');
const config = require('../../config/appconfig');

let dbInitialized = false;

const init = () => {
    if (dbInitialized) {
        console.log("MongoDB has been  already initialized");
        return;
    }
    mongoose.connect(config.mongodb.url, {dbName: config.mongodb.db});

    mongoose.connection.on('error', err => {
        console.error("MongoDB connection error: " + err);
    });

    mongoose.connection.on('connected', () => {
        console.info("Successfully connected to MongoDB");
        dbInitialized = true;
    });
};

module.exports = init;