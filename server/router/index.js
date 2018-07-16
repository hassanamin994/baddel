const router = require('express').Router();
const productsRoutes = require('./products');
const usersRoutes = require('./users');
const categoriesRoutes = require('./categories');
const authRoutes = require('./auth');
const passport = require('passport');
const { uploadImages } = require('../middlewares/imageUpload');
const { MONGOOSE_VALIDATION_ERROR, UNAUTHORIZED } = require('../config/types');

// controllers
const usersController = require('../controllers/users');
const categoriesController = require('../controllers/categories');
const productsController = require('../controllers/products');
const authController = require('../controllers/auth');

const requireAuth = passport.authenticate('jwt', {session: false});
const authSignin = passport.authenticate('local', {session: false});

router.get('/', requireAuth, (req, res) => {
    console.log(req.user);
    res.send('You\'re authenticated');

});

/*
    Routes Prefixes: 
        a - requires authentication
        g - global ( no auth required )
*/

// auth
router.post('/g/auth/signup', authController.signup);
router.post('/g/auth/login_facebook', authController.loginFacebook);
router.post('/g/auth/login', authSignin, authController.login);

// products
router.get('/g/products', productsController.getAll);
router.get('/g/products/:id', productsController.getById);
router.post('/a/products', requireAuth, uploadImages, productsController.create);
router.patch('/a/products/:id', requireAuth, productsController.updateProduct);


// categories
router.get('/g/categories', categoriesController.getAll);
router.post('/a/categories', categoriesController.create);
router.delete('/a/categories/:id', categoriesController.remove);


module.exports = router;