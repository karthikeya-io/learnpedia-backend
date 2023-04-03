const authticateService = require('../services/authService');
const { check, validationResult } = require('express-validator');
const UserService = require('../services/userService');

exports.getUser = (req, res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    return res.json(req.profile);
}

exports.getAllUsers = (req, res) => {
    const userService = new UserService();
    userService.getAllUsers().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
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

// update user
exports.updateUser = (req, res) => {
    const userService = new UserService();
    userService.updateUser(req.profile._id, req.body).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
}

// add question
exports.addQuestion = (req, res) => {
    const userService = new UserService();
    userService.addQuestion(req.body, req.profile).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
}

//middle ware
exports.getUserById = (req, res, next, id) => {
    const authservice = new authticateService();
    console.log(req.body);
    console.log(id)
    authservice.getUserById(id).then((result) => {
        console.log(result);
        req.profile = result;
        next();
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
}


exports.isEnrolled = (req, res, next) => {
    const userService = new UserService();
    userService.isEnrolled(req.course._id, req.profile).then((result) => {
        if (result) {
            next();
        } else {
            res.status(403).json({
                error: "Not enrolled"
            });
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
}

