const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
//tạo các thuộc tính user
name: {
    type: String,
    required: true
},
age: {
    type: Number,
    required: true
},
address: {
    type: String,

},
phone: {
    type: String,

},
email: {
    type: String,
    required: true
},
tinhtrang:{
    type: String,
},
role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
},
//tạo thuộc tính
username:{
    type: String,
    required: true
},
password: {
    type: String,
    required: true
},
avatar:{
    type: String,
}

});

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
