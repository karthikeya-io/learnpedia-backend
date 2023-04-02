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

    async getAllUsers() {
        const users = await this.userRepository.findAll();
        return users;
    }

    // update user
    async updateUser(userId, updates) {
        const allowedUpdates = ['firstname', 'lastname', 'phoneno', 'password']; // list of fields the user is allowed to update
        const isValidUpdate = updates && Object.keys(updates).every((update) => allowedUpdates.includes(update));
        console.log(updates);
        console.log(isValidUpdate)
        if (!isValidUpdate) {
            return { error: 'Invalid updates!' };
        }
        const user = await this.userRepository.updateUser(userId, updates);
        const { firstname, lastname, email, role, phoneno } = user;
        return { firstname, lastname, email, role, phoneno };
        
    }



}

module.exports = UserService;