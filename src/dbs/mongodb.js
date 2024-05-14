const mongoose = require('mongoose');

const connectMongoDB = () => {
    const URI = "mongodb+srv://admin:admin@admin.qboa2og.mongodb.net/webadmin"
    mongoose.connect(URI).then(() => {
        console.log('Connected to MongoDB')
    }).catch((error) => {
        console.log('Error connecting to MongoDB', error)
    })
}

module.exports = connectMongoDB;
