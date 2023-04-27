const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { isSignedIn, isAuthenticated, isEducator } = require('../controllers/authController');
const { courseUpload, getUserCourses, moduleUpload, getCoursesById, getModules, isHisCourse, lessonUpload, getAllCourses, enrollCourse, getModulesInCourse, getLessonById, getLessonVideo, searchCourse } = require('../controllers/courseController');
const { getUserById, getEnrolledCourses, isEnrolled } = require('../controllers/userController');
const multer = require('multer');
const courseController = require('../controllers/courseController')

const { BlobServiceClient } = require("@azure/storage-blob");


const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerName = "videos";

// Set up multer middleware for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Set the destination folder for uploaded files
//   },
//   filename: function (req, file, cb) {
//     req.fileName = Date.now() + '-' + file.originalname;
//     cb(null, req.fileName); // Set the filename of the uploaded file
//   }
// });
// const upload = multer({ storage: storage });
const upload = multer({ storage: multer.memoryStorage() });



router.param('userId', getUserById)
router.param('courseId', getCoursesById)
router.param('lessonId', getLessonById)

//search courses
router.get('/search', searchCourse);

router.post('/courseupload/:userId', [
    check("title", "title should be atleast 3 char").isLength({ min: 3 }),
    check("price", "price should be a number").isNumeric(),
],isSignedIn, isAuthenticated, isEducator, courseUpload);

router.post('/moduleupload/:userId', isSignedIn, isAuthenticated, isEducator, moduleUpload);



router.get('/courses', getAllCourses)

//educator created courses
router.get('/courses/:userId', isSignedIn, isAuthenticated, isEducator, getUserCourses);
router.get('/module/:userId/:courseId', isSignedIn, isAuthenticated, isEducator, getModules);
router.post('/lesson/:userId/:courseId', isSignedIn, isAuthenticated, isEducator,isHisCourse, upload.single('video'),
async (req, res, next) => {
  try {
      console.log(req.file);
      const containerClient = blobServiceClient.getContainerClient(containerName);
      req.fileName = Date.now() + '-' + req.file.originalname;
      const blobClient = containerClient.getBlockBlobClient(req.fileName);
      const uploadResponse = await blobClient.upload(req.file.buffer, req.file.size);
      if (uploadResponse._response.status === 201) {
        // get the url of the uploaded file from the blob service
          // req.body.profilePic = blobClient.url;
          console.log("File uploaded to Azure Blob storage successfully");
        } else {
          return res.status(500).json({ message: "Failed to upload file" });
        }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred while uploading the file" });
  }
  next();
},
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

router.post('/update-rating', courseController.updateRating)

//get lesson video
router.get('/lesson/:userId/:courseId/:lessonId', isSignedIn, isAuthenticated, isEnrolled, getLessonVideo)

module.exports = router;



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

//educator created courses
/**
 * @swagger
 *  components:
 *    schemas:
 *     educatorcourses:
 *         type: object
 *         required:
 *            - category
 *            - _id
 *            - rating
 *            - createdAt
 *            - updatedAt
 *            - desc
 *            - price
 *            - title
 *            - __v
 *            - educator
 *         properties:
 *              _id:
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
 *              rating:
 *                type: string
 *              createdAt:
 *                type: string
 *              updatedAt:
 *                type: string
 *              __v:
 *                type: string
 *              educator:
 *                type: string
 *
 *
 */

//  *     security:
//  *       - bearerAuth: []
//  *     # Add a script to retrieve the token value from local storage and send the request with the token header
//  *     x-code-samples:
//  *       - lang: javascript
//  *         source: |
//  *           const token = localStorage.getItem('myToken');
//  *           fetch('https://localhost:3001/api/courses', {
//  *             method: 'GET',
//  *             headers: {
//  *               'authorization': token,
//  *             },
//  *           })
//  *             .then(response => response.json())
//  *             .then(data => console.log(data))
//  *             .catch(error => console.error(error));

/**
 * @swagger
 * /courses/{userId}:
 *   get:
 *     tags:
 *          - courses
 *     summary: returns all the courses of a particular student
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: Custom header for the request
 *         required: true
 *         type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         description : user id
 *     responses:
 *       200:
 *         description: returns list of courses
 *         content:
 *           application/json:
 *             type: array
 *             items:
 *                  $ref: '#/components/schemas/educatorscourses'
 *       404:
 *          description : courses not found and invalid user id
 */

/**
 * @swagger
 * /module/{userId}/{courseId}:
 *   get:
 *     tags:
 *          - courses
 *     summary: returns all the courses of a particular student
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: Custom header for the request
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description : user id
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *         description : course Id
 *     responses:
 *       200:
 *         description: returns list of courses
 *         content:
 *           application/json:
 *             type: array
 *             items:
 *                  $ref: '#/components/schemas/courses'
 *       404:
 *          description : courses not found and invalid user id
 *     # Add a script to retrieve the token value from local storage and send the request with the token header
 *     x-code-samples:
 *       - lang: javascript
 *         source: |
 *           const token = localStorage.getItem('myToken');
 *           fetch('https://localhost:3001/api/courses', {
 *             method: 'GET',
 *             headers: {
 *               'x-auth-token': token,
 *             },
 *           })
 *             .then(response => response.json())
 *             .then(data => console.log(data))
 *             .catch(error => console.error(error));
 */

/**
 * @swagger
 *    components:
 *      schemas:
 *        lessonuploadreq:
 *          type: object
 *          required:
 *              - title
 *              - courseid
 *              - moduleid
 *              - desc
 *              - video
 *          properties:
 *              title:
 *                type: string
 *              courseid:
 *                type: string
 *              moduleid:
 *                type: string
 *              desc:
 *                type: string
 *              video:
 *                type: Number
 * 
 */


/**
 * @swagger
 *  /lesson/{userId}/{courseId}:
 *    post:
 *      tags:
 *           - courses
 *      summary: register a user 
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: authorization
 *            in: header
 *            description: Custom header for the request
 *            required: true
 *            schema:
 *                type: string
 *          - in: path
 *            name: userId
 *            schema:
 *                type: string
 *            required: true
 *            description : user id
 *          - in: path
 *            name: courseId
 *            schema:
 *                type: string
 *            required: true
 *            description : course Id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *          schema:
 *              $ref:'#/components/schemas/lessonuploadreq'
 *      responses:
 *          200: 
 *            description: success
 *            content:
 *                application/json:
 *            schema:
 *               $ref:'#/components/schemas/lessonuploadreq'
 *          409: 
 *              description: conflict
 *          400: 
 *            description: bad request
 */


/**
 * @swagger
 * /enroll/{userId}/{courseId}:
 *  post:
 *    tags:
 *          - courses
 *    summary: register a user 
 *    security:
 *       - bearerAuth: []
 *    parameters:
 *       - name: authorization
 *         in: header
 *         description: Custom header for the request
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description : user id
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *         description : course Id
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *              type:string
 *    responses:
 *       200: 
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type:string
 *       409: 
 *         description: conflict
 *       400: 
 *         description: bad request
 */


//student enrolled courses

/**
 * @swagger
 * /enrolled/{userId}:
 *   get:
 *     tags:
 *          - courses
 *     summary: returns all the courses of a particular student
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         description: Custom header for the request
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description : user id
 *     responses:
 *       200:
 *         description: returns list of courses
 *         content:
 *           application/json:
 *             type: array
 *             items:
 *                  $ref: '#/components/schemas/courses'
 *       404:
 *          description : courses not found and invalid user id
 *     # Add a script to retrieve the token value from local storage and send the request with the token header
 *     x-code-samples:
 *       - lang: javascript
 *         source: |
 *           const token = localStorage.getItem('myToken');
 *           fetch('https://localhost:3001/api/courses', {
 *             method: 'GET',
 *             headers: {
 *               'x-auth-token': token,
 *             },
 *           })
 *             .then(response => response.json())
 *             .then(data => console.log(data))
 *             .catch(error => console.error(error));
 */

//rourte to return entire course with modules and lessons

/**
 * @swagger
 * /course/{courseId}:
 *   get:
 *     tags:
 *          - courses
 *     summary: returns all the courses of a particular student
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         description: Custom header for the request
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *         description : course Id
 *     responses:
 *       200:
 *         description: returns list of courses
 *         content:
 *           application/json:
 *             type: array
 *             items:
 *                  $ref: '#/components/schemas/courses'
 *       404:
 *          description : courses not found and invalid user id
 *     # Add a script to retrieve the token value from local storage and send the request with the token header
 *     x-code-samples:
 *       - lang: javascript
 *         source: |
 *           const token = localStorage.getItem('myToken');
 *           fetch('https://localhost:3001/api/courses', {
 *             method: 'GET',
 *             headers: {
 *               'x-auth-token': token,
 *             },
 *           })
 *             .then(response => response.json())
 *             .then(data => console.log(data))
 *             .catch(error => console.error(error));
 */



//get lesson
/**
 * @swagger
 * /lesson/{lessonId}:
 *   get:
 *     tags:
 *          - courses
 *     summary: returns a course lesson
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         description: Custom header for the request
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: lessonId
 *         schema:
 *           type: string
 *         required: true
 *         description : lesson Id
 *     responses:
 *       200:
 *         description: returns lesson
 *         content:
 *           application/json:
 *             type: array
 *             items:
 *                  $ref: '#/components/schemas/courses'
 *       404:
 *          description : courses not found and invalid user id
 *     # Add a script to retrieve the token value from local storage and send the request with the token header
 *     x-code-samples:
 *       - lang: javascript
 *         source: |
 *           const token = localStorage.getItem('myToken');
 *           fetch('https://localhost:3001/api/courses', {
 *             method: 'GET',
 *             headers: {
 *               'x-auth-token': token,
 *             },
 *           })
 *             .then(response => response.json())
 *             .then(data => console.log(data))
 *             .catch(error => console.error(error));
 */


//get lesson video
/**
 * @swagger
 * /lesson/{userId}/{courseId}/{lessonId}:
 *   get:
 *     tags:
 *          - courses
 *     summary: returns a lesson video
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         description: Custom header for the request
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description : user Id
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *         description : course Id
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *         description : course Id
 *     responses:
 *       200:
 *         description: returns a lesson video
 *         content:
 *           application/json:
 *             type: array
 *             items:
 *                  $ref: '#/components/schemas/courses'
 *       404:
 *          description : courses not found and invalid user id
 *     # Add a script to retrieve the token value from local storage and send the request with the token header
 *     x-code-samples:
 *       - lang: javascript
 *         source: |
 *           const token = localStorage.getItem('myToken');
 *           fetch('https://localhost:3001/api/courses', {
 *             method: 'GET',
 *             headers: {
 *               'x-auth-token': token,
 *             },
 *           })
 *             .then(response => response.json())
 *             .then(data => console.log(data))
 *             .catch(error => console.error(error));
 */

