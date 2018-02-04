const router = require('express').Router();
const Category = require('../models/Category');
const { MONGOOSE_ERROR } = require('../config/types');

router.get('/', (req, res, next) => {
    Category.find()
    .then(categories => res.json(categories))
    .catch(err => next(err));
});

router.post('/', (req, res, next) => {
    const { name, icon, parentId } = req.body;
    var category = new Category({
        name,
        icon,
        parentId
    });
    category.save((err, c) => {
        if(err) {
            return next({type: MONGOOSE_ERROR, payload: err});
        }
        return res.json(c);
    })
});

router.delete('/:id', (req, res) => {
    const id = req.param.id;
    Category.findByIdAndRemove(id, (err, result) => {
        if (err) {
            return res.status(422).end('error removing category')
        };
        return res.json({success: true});
    })
});

module.exports = router;