const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./Product');

const categorySchema = new Schema({
    name: {
        type: String,
        required: 'Name field is required'
    },
    icon: String,
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    }
}, { timestamps: true });


module.exports = mongoose.model('Category', categorySchema);