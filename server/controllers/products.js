const validator = require('validator');
const passport = require('passport');
const mongoose = require('mongoose');
const requireAuth = passport.authenticate('jwt', { session: false });
const { MONGOOSE_VALIDATION_ERROR, UNAUTHORIZED } = require('../config/types');
const { uploadImages } = require('../middlewares/imageUpload');

const config = require('../config');
const responseUtils = require('../utils/responseUtils');
const Product = require('../models/Product');


const products = {

    getAll: function (req, res) {
        const page = req.query.page || 1;
        // remove page from being a query filter 
        delete req.query.page;

        const skip = page == 1 ? 0 : (page - 1) * 10;
        const limit = 100;

        const query = req.query;
        const searchQuery = {};

        Object.keys(query).forEach(key => {
            if (key == 'category')
                searchQuery[key] = mongoose.Types.ObjectId(query[key]);
            else
                searchQuery[key] = new RegExp(query[key], 'i');
        })

        console.log(searchQuery)
        Product.find(searchQuery)
            .skip(skip)
            .limit(limit)
            .sort([['createdAt', 1]])
            .then(products => {
                return responseUtils.jsonSuccess(res, products);
            })
            .catch(err => {
                return responseUtils.jsonError(res, 'An error has occured, please try again');
            })
    },

    create: function (req, res) {
        const { title, location, price, trade_with, category, images } = req.body;
        const user = req.user;
        var product = new Product({
            title,
            location,
            price,
            images,
            trade_with,
            owner: user.id,
            category
        });

        product.save((err, p) => {
            if (err) {
                return responseUtils.jsonError(res, 'An error has occured, please try again');
            }
            return responseUtils.jsonSuccess(res, product);
        })
    },

    getById: function (req, res) {
        const id = req.params.id;
        Product.findById(id)
            .then(product => {
                return responseUtils.jsonSuccess(res, product);
            })
            .catch(err => {
                return responseUtils.jsonError(res, 'An error has occured, please try again');
            })
    },

    updateProduct: function (req, res) {
        // collect attributes to be updated
        const updateAttrs = req.body;

        // prevent updating user field
        delete updateAttrs['owner'];
        Product.findById(req.params.id)
            .then(product => {
                // enable user to update only their products
                if (!req.user._id.equals(product.owner)) {
                    console.log(product.user != req.user._id)
                    return responseUtils.jsonNotAuthorized(res);
                }
                Object.keys(updateAttrs).forEach(key => {
                    product[key] = updateAttrs[key];
                });

                product.save((err, product) => {
                    if (err) {
                        return responseUtils.jsonError(res, 'An error has occured, please try again');   
                    }
                    return responseUtils.jsonSuccess(res, product);
                });
            })
            .catch(err => {
                return responseUtils.jsonError(res, 'An error has occured, please try again');
            })
    }


}


module.exports = exports = products;