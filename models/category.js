const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        min: 5,
        max: 25,
        unique: true
    }
}, { timestamps: true } );

module.exports = mongoose.model('Category', categorySchema);