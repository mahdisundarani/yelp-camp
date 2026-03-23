const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const users = require('../controllers/users')
const { storeReturnTo } = require('../middleware');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    .post((req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({ error: info?.message || 'Invalid username or password' });
            }
            req.logIn(user, (err) => {
                if (err) return next(err);
                return res.json({ user, message: 'Welcome back!' });
            });
        })(req, res, next);
    })

router.get('/logout', users.logout); 

router.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.json({ user: null });
    }
});


module.exports = router;
