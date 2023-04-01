const Course = require("../models/course");
const Module = require("../models/module");
const Lesson = require("../models/lesson");

class CourseRepository {
    async createCourse(data) {
        const course = new Course(data);
        return await course.save();
    }

    async createModule(data) {
        const module = new Module(data);
        return await module.save();
    }
    
    async createLesson(data, fileName) {
        const lesson = new Lesson(data);
        lesson.filePath = fileName;
        return await lesson.save();
    }

    async findCourseById(id) {
        return await Course.findById(id).populate('educator');
    }

    async getAllCourses() {
        return await Course.find();
    }

    async searchCourseByTitle(regex) {
        return await Course.find({ title: {$regex: regex} });
    }

    async findModuleById(id) {
        return await Module.findById(id);
    }

    async findLessonById(id) {
        return await Lesson.findById(id);
    }
}

module.exports = CourseRepository;