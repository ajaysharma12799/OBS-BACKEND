const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productCartSchema = new mongoose.Schema({ 
    /* 
        Schema for Product present in Cart
        NOTE:- Product can be of any Variety and can be any number of Quantity
    */
    product: {
        type: ObjectId,
        ref: 'Product'
    },
    name: String,
    count: Number,
    price: Number
});

const orderSchema = new mongoose.Schema({ // Order Schema 
    products: [productCartSchema],
    transaction_ID: {},
    amount: {
        type: Number
    },
    address: String,
    status: {
        type: String,
        default: 'Recieved',
        enum: [ 'Cancelled', 'Delivered', 'Shipped', 'Processing', 'Recieved' ]
    },
    updated: Date,
    user: {
        type: ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const ProductCart = mongoose.model('ProductCart', productCartSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = { Order, ProductCart };