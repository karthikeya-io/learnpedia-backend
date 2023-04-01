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

    async isEnrolled(courseId, user) {
        // loop over user.courses and check if course id is present
        console.log(user.courses);
        for (let i = 0; i < user.courses.length; i++) {
            if (user.courses[i]._id.equals(courseId)) {
                return true;
            }
        }
        return false;
    }
        
}

module.exports = UserService;