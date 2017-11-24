const router = require('express').Router();
const productsRoutes = require('./products');
const usersRoutes = require('./users');
const categoriesRoutes = require('./categories');
const authRoutes = require('./auth');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false});

router.get('/', requireAuth, (req, res) => {
    console.log(req.user);
    res.send('You\'re authenticated');

});
router.use('/products', productsRoutes);
router.use('/users', usersRoutes);
router.use('/categories', categoriesRoutes);
router.use('/auth', authRoutes);


// validation error handler
router.use('*', (err, req, res, next) => {
    const errors = [];
    switch(err.type) {
        case 'MONGOOSE':
            const validationErrors = err.payload.errors;
            Object.keys(validationErrors).forEach(key => {
                errors.push(validationErrors[key].message);
            })
            break
    }
    res.status(422).send(errors || 'Something went wrong');
    console.log(err)
})

module.exports = router;