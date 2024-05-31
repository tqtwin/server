const mongoose = require('mongoose');

// Tạo schema cho coupon
const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true // Mã coupon phải là duy nhất
    },
    discountPercentage: {
        type: Number,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    // Tạo thuộc tính active để kiểm tra coupon có còn hiệu lực hay không
    active: {
        type: Boolean,
        default: true
    },


});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
