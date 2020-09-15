const router = require('express').Router();
const { check } = require('express-validator'); // Using expressValidator for Checking incoming-data

const { signup, signin, signout } = require('../controllers/auth');

// POST ROUTE FOR SIGNUP
router.post('/signup', [
    check('firstName', 'FIRSTNAME SHOULD BE ATLEAST MINIMUM 3 CHARACTER AND MAXIMIM 30 CHARACTER').isLength({ min: 3, max: 30 }),
    check('lastName', 'LASTNAME SHOULD BE ATLEAST MINIMUM 3 CHARACTER AND MAXIMIM 30 CHARACTER').isLength({ min: 3, max: 30 }),
    check('email', 'EMAIL SHOULD BE VALID').isLength({ min: 7, max: 30 }).isEmail(),
    check('password', 'PASSWORD SHOULD BE ATLEAST MINIMUM 5 CHARACTER AND MAXIMUM 25 CHARACTER').isLength({ min: 5, max: 25 })
], signup);

// POST ROUTE FOR SIGNIN
router.post('/signin', [
    check('email', 'EMAIL IS REQUIRED').isEmail(),
    check('password', 'PASSWORD IS REQUIRED || PASSWORD LENGTH SHOULD BE ATLEAST MINIMUM 5 CHARACTER AND MAXIMUM 25 CHARACTER').isLength({ min: 5, max: 25 })
], signin);

// GET ROUTE FOR SIGNOUT
router.get('/signout', signout);

module.exports = router;