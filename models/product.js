const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema; // We will use this objectId to indicate that this product is associated with that document or product specific category

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        min: 5,
        max: 35
    },
    description: {
        type: String,
        trim: true,
        required: true,
        min: 10,
        max: 50
    },
    price: {
        type: Number,
        trim: true,
        required: true,
    },
    category: {
        type: ObjectId,
        ref: 'Category', // Same name as we export Category Model
        required: true
    },
    stock: {
        type: Number
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    }
}, { timestamps: true } );

module.exports = mongoose.model('Product', productSchema);