const router = require('express').Router();
const Product = require('../models/Product');
const validator = require('validator');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});
const { MONGOOSE_VALIDATION_ERROR, UNAUTHORIZED } = require('../config/types');

router.get('/', (req, res) => {
    const page = req.query.page || 1;    
    const skip = page == 1 ? 0: (page-1) * 10;
    const limit = 10; 
    
    const { filter, value } = req.query; 
    const searchQuery = {} ; 

    console.log(searchQuery);
    
    if(filter && value) {
        searchQuery[filter] = new RegExp(value,'i') ;
    }

    Product.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort([['createdAt', 1]])
    .then(products => {
        res.json(products);
    })
    .catch(err => {
        next(err);
    })
});


router.post('/', requireAuth, (req, res, next) => {
    const { title, location, price, trade_with, category } = req.body;
    console.log(req.user);
    const user = req.user;
    var product = new Product({
        title,
        location,
        price,
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