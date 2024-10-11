const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect(process.env.DB_LOCAL_URL)
        .then(con => {
            console.log(`MongoDB connected`);
        })
        .catch(err => {
            console.error(`Error: ${err.message}`);
        });
};

module.exports = connectDB;
