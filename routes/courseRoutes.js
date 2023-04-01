const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { isSignedIn, isAuthenticated, isEducator } = require('../controllers/authController');
const { courseUpload, getUserCourses, moduleUpload, getCoursesById, getModules, isHisCourse, lessonUpload, getAllCourses, enrollCourse, getModulesInCourse, getLessonById, getLessonVideo } = require('../controllers/courseController');
const { getUserById, getEnrolledCourses, isEnrolled } = require('../controllers/userController');
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
router.param('lessonId', getLessonById)

router.post('/courseupload/:userId', [
    check("title", "title should be atleast 3 char").isLength({ min: 3 }),
    check("price", "price should be a number").isNumeric(),
],isSignedIn, isAuthenticated, isEducator, courseUpload);

router.post('/moduleupload/:userId', isSignedIn, isAuthenticated, isEducator, moduleUpload);


/**
 * @swagger
 *  /courses:
 *    get:
 *     summary: returns all the courses
 *     tags : [courses]
 *     responses:
 *        200:
 *         description: returns list of courses
 *         content:
 *           application/json:
 *             schema:
 *              type: array
 *              items:
 *               $ref: '#/components/schemas/courses'
 *        404:
 *          description : courses not found
 */

router.get('/courses', getAllCourses)

//educator created courses
/**
 * @swagger
 *  components:
 *    schemas:
 *     courses:
 *         type: object
 *         required:
 *            - category
 *            - desc
 *            - price
 *            - title
 *         properties:
 *              id:
 *               type: integer
 *               description : auto generated number by system
 *              category:
 *                type: string
 *                description : This is a describes about the type of course
 *              desc:
 *                type: string
 *                description : This is a brief about the course details
 *              price:
 *                type: string
 *                description : This is cost of the course
 *              title:
 *                type: string
 *                description : This is title of the course.
 *
 *
 */

/**
 * @swagger
 *  /courses/:userId:
 *    get:
 *     summary: returns all the courses of a parrticular student
 *     tags : [courses]
 *     parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: integer
 *       required: true
 *       description : user id
 *     responses:
 *        200:
 *         description: returns list of courses
 *         content:
 *           application/json:
 *             schema:
 *              type: array
 *              items:
 *               $ref: '#/components/schemas/courses'
 *        404:
 *          description : courses not found and invalid user id
 */
router.get('/courses/:userId', isSignedIn, isAuthenticated, isEducator, getUserCourses);
router.get('/module/:userId/:courseId', isSignedIn, isAuthenticated, isEducator, getModules);
router.post('/lesson/:userId/:courseId', isSignedIn, isAuthenticated, isEducator,isHisCourse, upload.single('video'),
lessonUpload);

router.post('/enroll/:userId/:courseId', isSignedIn, isAuthenticated, enrollCourse);
//student enrolled courses
router.get('/enrolled/:userId', isSignedIn, isAuthenticated, getEnrolledCourses);

//rourte to return entire course with modules and lessons
router.get('/course/:courseId',getModulesInCourse, (req, res) => {
    res.json(req.finalCourse);
});


//get lesson
router.get('/lesson/:lessonId', (req, res) => {
    res.json(req.lesson);
})

//get lesson video
router.get('/lesson/:userId/:courseId/:lessonId', isSignedIn, isAuthenticated, isEnrolled, getLessonVideo)

module.exports = router;
