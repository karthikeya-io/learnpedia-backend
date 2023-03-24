const CourseRepository = require('../repositories/CourseRepository');
const UserRepository = require('../repositories/UserRepository');

class CourseService {
    constructor() {
        this.courseRepository = new CourseRepository();
        this.userRepository = new UserRepository();
    }

    async createCourse(course, userId) {
        try {
            const courseCreated = await this.courseRepository.createCourse(course);
            const user = await this.userRepository.findById(userId);
            console.log(courseCreated);
            if (!user) {
                return { error: 'User not found', status: 401 };
            }
            (await user.populate('educator')).educator.createdcourses.push(courseCreated);
            user.educator.save();
            courseCreated.educator = user;
            await courseCreated.save();
            await user.save();
            const {title, description, price, category} = courseCreated;
            return {title, description, price, category, educator: user.firstname};
        } catch (error) {
            return { error: error.message, status: 500 };
        }

    }

    //search course by substring of title
    async searchCourseByTitle(title) {
        const regex = new RegExp(data.cname, 'i') // 'i' makes it case insensitive
        return await this.courseRepository.searchCourseByTitle(regex);
    }

    async getAllCourses() {
        return await this.courseRepository.getAllCourses();
    }

    async getUserCourses(userId) {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                return { error: 'User not found', status: 401 };
            }
            const courses = await (await user.populate('educator')).educator.createdcourses;
            return courses;
        } catch (error) {
            return { error: error.message, status: 500 };
        }
    }
}

module.exports = CourseService;