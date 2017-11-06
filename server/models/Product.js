var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: String,
    location: String,
    trade_with: [{type: String}],
    price: String
})


module.exports = mongoose.model('Product', productSchema);