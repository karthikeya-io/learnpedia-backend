const authticateService = require('../services/authService');
const { check, validationResult } = require('express-validator');
const UserService = require('../services/userService');

exports.getUserById = (req, res, next, id) => {
    const authservice = new authticateService();
    console.log(req.body);
    console.log(id)
    authservice.getUserById(id).then((result) => {
        // console.log(result);
        req.profile = result;
        next();
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
}

exports.getUser = (req, res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    return res.json(req.profile);
}

//get user enrolled courses
exports.getEnrolledCourses = (req, res) => {
    const userService = new UserService();
    console.log(req.profile._id);
    console.log(req.user._id)
    userService.getEnrolledCourses(req.profile._id).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    }
    );
}
