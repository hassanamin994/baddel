const router = require('express').Router();
const productsRoutes = require('./products');
const usersRoutes = require('./users');
const categoriesRoutes = require('./categories');
const authRoutes = require('./auth');

router.use('/products', productsRoutes);
router.use('/users', usersRoutes);
router.use('/categories', categoriesRoutes);
router.use('/auth', authRoutes);

module.exports = router;