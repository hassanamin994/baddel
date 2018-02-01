var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Pleaase provide a name for the product'
    },
    description: String,
    location: String,
    trade_with: [{type: String}],
    price: String,
    images: [{type: String}],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: 'Category field can not be empty'
    }
}, { timestamps: true });


// auto populate user and category fields
function populateUser(next) {
    this.populate('user');
    next();
}

function populateCategory(next) {
    this.populate('category');
    next();
}

productSchema.pre('find', populateCategory, populateUser );
productSchema.pre('findOne', populateCategory, populateUser);
productSchema.pre('findAll', populateCategory, populateUser);

module.exports = mongoose.model('Product', productSchema);