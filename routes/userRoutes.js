const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { isSignedIn, isAuthenticated, isEducator, isAdmin } = require('../controllers/authController');
const { getUserById, getAllUsers, updateUser } = require('../controllers/userController');


//params
router.param('userId', getUserById);

router.get('/users/:userId', isSignedIn, isAuthenticated, isAdmin, getAllUsers);

//update user
router.put('/user/:userId', isSignedIn, isAuthenticated, updateUser);

module.exports = router;
