const mongoose = require('mongoose');
const { Schema } = mongoose;
 
const counterSchema = new Schema({
   total: {
    type: Number,
    default: 0
   },
   name: {
    type: String,
   }
});

module.exports = mongoose.model('Counter', counterSchema);