const mongoose = require('mongoose');

// Tạo schema cho từng sản phẩm trong giỏ hàng
const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    price: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
});

// Tạo schema cho giỏ hàng
const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [cartItemSchema],
    total: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Tính tổng giá trị của giỏ hàng trước khi lưu
cartSchema.pre('save', function(next) {
    this.total = this.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    next();
});

const cartModel = mongoose.model('Cart', cartSchema);
module.exports = cartModel;
