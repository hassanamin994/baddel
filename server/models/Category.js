const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./Product');

const categorySchema = new Schema({
    name: {
        type: String,
        required: 'Name field is required'
    },
}, { timestamps: true });


module.exports = mongoose.model('Category', categorySchema);