const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { isSignedIn, isAuthenticated, isEducator } = require('../controllers/authController');
const { courseUpload, getUserCourses } = require('../controllers/courseController');
const { getUserById } = require('../controllers/userController');


router.param('userId', getUserById)
router.post('/courseupload/:userId', [
    check("title", "title should be atleast 3 char").isLength({ min: 3 }),
    check("price", "price should be a number").isNumeric(),
],isSignedIn, isAuthenticated, isEducator, courseUpload);


router.get('/courses/:userId', isSignedIn, isAuthenticated, isEducator, getUserCourses);

module.exports = router;


