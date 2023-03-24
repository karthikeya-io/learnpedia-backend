const Course = require("../models/course");

class CourseRepository {
    async createCourse(data) {
        const course = new Course(data);
        return await course.save();
    }

    async findCourseById(id) {
        return await Course.findById(id);
    }

    async getallCourses() {
        return await Course.find();
    }

    async searchCourseByTitle(regex) {
        return await Course.find({ title: {$regex: regex} });
    }
}

module.exports = CourseRepository;