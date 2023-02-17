const mongoose = require('mongoose');
const { Schema } = mongoose;
 
const userSchema = new Schema({
    email: { 
        type: String,
        unique : true
    },
    password: String,
    name: String,
    phone: String,
    nickname: String,
    profile: String
});

module.exports = mongoose.model('User', userSchema);