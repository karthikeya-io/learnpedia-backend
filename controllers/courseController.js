const courseService = require('../services/courseService');
const { check, validationResult } = require('express-validator');

exports.courseUpload = (req, res) => {
    const errors = validationResult(req);
    // console.log(req.body);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    const courseservice = new courseService();
    courseservice.createCourse(req.body, req.user._id).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
}

exports.getUserCourses = (req, res) => {
    const courseservice = new courseService();
    console.log(req.user._id);
    courseservice.getUserCourses(req.user._id).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
}