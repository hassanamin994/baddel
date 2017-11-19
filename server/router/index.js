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

module.exports = router;