const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { isSignedIn, isAuthenticated, isEducator } = require('../controllers/authController');
const { courseUpload, getUserCourses, moduleUpload, getCoursesById, getModules, isHisCourse, lessonUpload } = require('../controllers/courseController');
const { getUserById } = require('../controllers/userController');
const multer = require('multer');

// Set up multer middleware for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    req.fileName = Date.now() + '-' + file.originalname;
    cb(null, req.fileName); // Set the filename of the uploaded file
  }
});
const upload = multer({ storage: storage });


router.param('userId', getUserById)
router.param('courseId', getCoursesById)
router.post('/courseupload/:userId', [
    check("title", "title should be atleast 3 char").isLength({ min: 3 }),
    check("price", "price should be a number").isNumeric(),
],isSignedIn, isAuthenticated, isEducator, courseUpload);

router.post('/moduleupload/:userId', isSignedIn, isAuthenticated, isEducator, moduleUpload);


//educator created courses
router.get('/courses/:userId', isSignedIn, isAuthenticated, isEducator, getUserCourses);
router.get('/module/:userId/:courseId', isSignedIn, isAuthenticated, isEducator, getModules);
router.post('/lesson/:userId/:courseId', isSignedIn, isAuthenticated, isEducator,isHisCourse, upload.single('video'),
lessonUpload);


module.exports = router;
