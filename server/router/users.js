const router = require('express').Router() ;
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});


router.get('/me', requireAuth, (req, res) => {
    return res.json({user: req.user});
})




module.exports = router;