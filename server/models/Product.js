var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Pleaase provide a name for the product'
    },
    location: String,
    trade_with: [{type: String}],
    price: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })


module.exports = mongoose.model('Product', productSchema);