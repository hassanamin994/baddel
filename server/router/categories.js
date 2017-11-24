const router = require('express').Router();
const Category = require('../models/Category');
const { MONGOOSE_ERROR } = require('../config/types');

router.get('/', (req, res, next) => {
    Category.find()
    .then(categories => res.json(categories))
    .catch(err => next(err));
});

router.post('/', (req, res, next) => {
    const name = req.body.name;
    var category = new Category({
        name
    });
    category.save((err, c) => {
        if(err) {
            return next({type: MONGOOSE_ERROR, payload: err});
        }
        return res.json(c);
    })
});


module.exports = router;