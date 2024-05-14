const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    price: {
        type: Number
    },
    oldPrice: {
        type: Number
    },
    stock:{
        type: String
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    images: {
        type: Array
    },
    brand: {
        type: String
    },
    review:{
        type: Number
    },
    category: {
        type: String
    },
    rating: {
        type: Number
    },
    reviews: {
        type: Array
    },
    size: {
        type: Number
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    created_by: {
        type: Date,
        default: Date.now
    },
    updated_by: {
        type: Date,
        default: Date.now
    },

    thumbnai: {
        type: String,
    },
});

const productModel = mongoose.model('Product', productSchema);
module.exports = productModel;
