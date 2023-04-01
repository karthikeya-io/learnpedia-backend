const courseService = require('../services/courseService');
const { check, validationResult } = require('express-validator');
const fs = require('fs');
const fileType = require('file-type');

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

exports.enrollCourse = (req, res) => {
    const courseservice = new courseService();
    courseservice.enrollCourse(req.course._id, req.profile._id).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
}

//get all courses
exports.getAllCourses = (req, res) => {
    const courseservice = new courseService();
    courseservice.getAllCourses().then((result) => {
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

exports.getLessonVideo = async (req, res) => {
    const path = 'uploads/' + req.lesson.filePath;
    try {
        const stat = fs.statSync(path);
        const fileSize = stat.size;
        const range = req.headers.range;
        console.log(path)
        const file = fs.readFileSync(path);
        const fileTypeResult = await fileType.fromBuffer(file);
        console.log(fileTypeResult)
        const contentType = fileTypeResult.mime;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(path, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': contentType,
            }
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': contentType,
            }
            res.writeHead(200, head);
            fs.createReadStream(path).pipe(res);
        }
    }
    catch (err) {
        throw err;
    }
}


//middleware
exports.getCoursesById = (req, res, next, id) => {
    const courseservice = new courseService();
    if (id == 'undefined') {
        return res.status(400).json({
            error: "Bad request"
        });
    }
    courseservice.getCourseById(id).then((result) => {
        req.course = result;
        next();
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
}

exports.getLessonById = (req, res, next, id) => {
    const courseservice = new courseService();
    courseservice.getLessonById(id).then((result) => {
        req.lesson = result;
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


exports.getModulesInCourse = (req, res, next) => {
    const courseservice = new courseService();
    courseservice.getModulesofCourse(req.course._id).then((result) => {
        req.finalCourse = result;
        next();
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
}

exports.hasEnrolled = (req, res, next) => {
    const courseservice = new courseService();
    courseservice.hasEnrolled(req.course._id, req.profile._id).then((result) => {
        req.hasEnrolled = result;
        next();
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
}