const router = require('express').Router();
const productsRoutes = require('./products');
const usersRoutes = require('./users');
const categoriesRoutes = require('./categories');


router.use('/products', productsRoutes);
router.use('/users', usersRoutes);
router.use('/categories', categoriesRoutes);


module.exports = router;