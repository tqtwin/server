const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderdate: {
        type: Date,
        default: Date.now
    },
    deliverydate: {
        type: Date
    },
    total: {
        type: Number,
        required: true
    },
    code: {
        type: String
    },
    recipientname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    note: {
        type: String
    },
    status: {
        type: String
    },
    username: {
        type: String
    },
    email: {
        type: String
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            image:{
                type: String,
                required: true
            },
            name:{
                type: String,
                required: true
            }
        }
    ]
});

const orderModel = mongoose.model('order', orderSchema);
module.exports = orderModel;
