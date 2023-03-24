const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { signUp, logIn, logOut } = require('../controllers/authController');

router.post('/signup', [
    check("firstname", "name should be atleast 3 char").isLength({ min: 3 }),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], signUp);

router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], logIn);

router.get('/logout', logOut);

module.exports = router;
