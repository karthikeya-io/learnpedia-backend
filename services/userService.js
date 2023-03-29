const UserRepository = require('../repositories/UserRepository');
const CourseRepository = require('../repositories/CourseRepository');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
        this.courseRepository = new CourseRepository();
    }

    async courseEnrollment(data) {
        const course = await this.courseRepository.getCourseById(data.courseId);
        const user = await this.userRepository.findById(data.userId);
        if (course && user) {
            user.courses.push(course);
            await user.save();
            return user;
        } else {
            return null;
        }
    }

    async getEnrolledCourses(userId) {
        const user = await this.userRepository.findById(userId);
        if (user) {
            return user.courses;
        }
        return null;
    }
        
}

module.exports = UserService;