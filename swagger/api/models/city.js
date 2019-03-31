const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    country: String,
    lastModifiedDate: {
        type: Date
    }
});

citySchema.pre('save', function (next) {
    this.lastModifiedDate = new Date();
    next();
});

const city = mongoose.model('City', citySchema);

module.exports = city;
