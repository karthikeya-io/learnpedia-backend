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


/**
 * @swagger
 *    components:
 *      schemas:
 *        createuserinput:
 *          type: object
 *          required:
 *              - firstname
 *              - lastname
 *              - email
 *              - encry_password
 *              - phoneno
 *          properties:
 *              firstname:
 *                type: string
 *                
 *              lastname:
 *                type: string
 *                
 *              encry_password:
 *                type: string
 *                
 *              email:
 *                type: string
 *                
 *              phoneno:
 *                type: Number
 *        createuserresponse:
 *          type: object
 *          properties:
 *               _id:
 *                  type: string
 *               firstname:
 *                  type: string
 *               lastname:
 *                  type: string
 *               phoneno:
 *                  type: Number
 *               role:
 *                  type: string
 * 
 */

/**
 * @swagger
 *    components:
 *      schemas:
 *        loginuserreq:
 *          type: object
 *          required:
 *              - username
 *              - password
 *          properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 */

/**
 * @swagger
 *    components:
 *      schemas:
 *        loginuserres:
 *          type: object
 *          required:
 *              - firstname
 *              - lastname
 *              - email
 *              - role
 *              - phoneno
 *              - _id
 *          properties:
 *              firstname:
 *                type: string
 *                
 *              lastname:
 *                type: string
 *                
 *              role:
 *                type: string
 *                
 *              email:
 *                type: string
 * 
 *              -id:
 *                type: string
 * 
 *              phoneno:
 *                type: Number
 */

/**
 * @swagger
 *  /login:
 *    post:
 *       tags: [login]
 *       summary: login a user 
 *       requestBody:
 *       required: true
 *       content:
 *            application/json:
 *       schema:
 *              $ref:'#/components/schemas/loginuserreq'
 *       responses:
 *          200: 
 *              description: success
 *              content:
 *                  application/json:
 *              schema:
 *                  $ref:'#/components/schemas/loginuserres'
 *          409: 
 *              description: conflict
 *          400: 
 *              description: bad request
 */

/**
 * @swagger
 *  /signup:
 *    post:
 *       tags: [signup]
 *       summary: register a user 
 *       security:
 *          - bearerAuth: []
 *       parameters:
 *         - name: authorization
 *           in: header
 *           description: Custom header for the request
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *       required: true
 *       content:
 *            application/json:
 *       schema:
 *              $ref:'#/components/schemas/createuserinput'
 *       responses:
 *          200: 
 *              description: success
 *              content:
 *                  application/json:
 *              schema:
 *                  $ref:'#/components/schemas/createuserresponse'
 *          409: 
 *              description: conflict
 *          400: 
 *              description: bad request
 */


/**
 * @swagger
 * /logout:
 *   get:
 *     tags:
 *          - authorization
 *     summary: logout from a session
 *     responses:
 *       200:
 *         description: successfully logout from a session
 *         content:
 *           application/json:
 *             type: list
 *       404:
 *          description : not logout successfully
 */

