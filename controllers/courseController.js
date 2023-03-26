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


exports.moduleUpload = (req, res) => {
    const errors = validationResult(req);
    // console.log(req.body);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    const courseservice = new courseService();
    courseservice.createModule(req.body).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
}

exports.lessonUpload = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    const courseservice = new courseService();
    courseservice.createLesson(req.body, req.fileName).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
}

//educator created courses
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

//get modules of a course
exports.getModules = (req, res) => {
    const courseservice = new courseService();
    console.log(req.course._id);
    courseservice.getModules(req.course._id, req.profile._id).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
}

//middleware
exports.getCoursesById = (req, res, next, id) => {
    const courseservice = new courseService();
    courseservice.getCourseById(id).then((result) => {
        req.course = result;
        next();
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
}

exports.isHisCourse = (req, res, next) => {
    if (!req.course.educator._id.equals(req.profile._id)) {
        return res.status(403).json({
            error: "Access denied"
        });
    }
    next();
}
