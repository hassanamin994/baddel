const router = require('express').Router();
const Product = require('../models/Product');
const validator = require('validator');
const passport = require('passport');
const mongoose = require('mongoose');
const requireAuth = passport.authenticate('jwt', {session: false});
const { MONGOOSE_VALIDATION_ERROR, UNAUTHORIZED } = require('../config/types');
const { uploadImages } = require('../middlewares/imageUpload');

router.get('/', (req, res) => {
    const page = req.query.page || 1;   
    // remove page from being a query filter 
    delete req.query.page ;
    
    const skip = page == 1 ? 0: (page-1) * 10;
    const limit = 100; 
    
    const query = req.query; 
    const searchQuery = {} ; 

    Object.keys(query).forEach(key => {
        if(key == 'category')
            searchQuery[key] = mongoose.Types.ObjectId(query[key]);
        else
            searchQuery[key] = new RegExp(query[key],'i') ;
    })

    console.log(searchQuery)
    Product.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort([['createdAt', 1]])
    .then(products => {
        res.json(products);
    })
    .catch(err => {
        console.log(err)
        next(err);
    })
});


router.post('/', requireAuth, uploadImages, (req, res, next) => {
    const { title, location, price, trade_with, category, images } = req.body;
    const user = req.user;
    var product = new Product({
        title,
        location,
        price,
        images,
        trade_with,
        user: user.id,
        category
    });

    product.save((err, p) => {
        if(err) {
            return next({type: MONGOOSE_VALIDATION_ERROR, payload: err});
        }

        res.json(p);
    })
})

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
    .then(product => {
        res.json(product);
    })
    .catch(err => {
        next(err);
    })
});

router.patch('/:id', requireAuth, (req, res, next) => {
    // collect attributes to be updated
    const updateAttrs = req.body;

    // prevent updating user field
    delete updateAttrs['user'];
    Product.findById(req.params.id)
    .then( product => {
        // enable user to update only their products
        console.log(typeof parseInt(product.user), typeof parseInt(req.user._id))
        if(!req.user._id.equals(product.user)) {
            console.log(product.user != req.user._id)
            return next({type: UNAUTHORIZED})
        }
        Object.keys(updateAttrs).forEach(key => {
            product[key] = updateAttrs[key];
            console.log(key, updateAttrs[key])
        });

        product.save((err, product) => {
            if(err) return next(err);
            console.log(product);
            return res.json(product);
        });
    })
    .catch(err => {
        return next(err);
    })
});


module.exports = router;