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

    async createModule(module) {
        try {
            const course = await this.courseRepository.findCourseById(module.courseId);
            if (!course) {
                return { error: 'Course not found', status: 401 };
            }
            const moduleCreated = await this.courseRepository.createModule(module);
            course.modules.push(moduleCreated);
            await course.save();
            return moduleCreated;
        } catch (error) {
            return { error: error.message, status: 500 };
        }
    }
    
    async createLesson(lesson, fileName) {
        try {
            const module = await this.courseRepository.findModuleById(lesson.moduleId);
            if (!module) {
                return { error: 'Module not found', status: 401 };
            }
            const lessonCreated = await this.courseRepository.createLesson(lesson, fileName);
            module.lessons.push(lessonCreated);
            await module.save();
            return lessonCreated;
        } catch (error) {
            return { error: error.message, status: 500 };
        }
    }

    async enrollCourse(courseId, userId) {
        try {
            const course = await this.courseRepository.findCourseById(courseId);
            if (!course) {
                return { error: 'Course not found', status: 401 };
            }
            const user = await this.userRepository.findById(userId);
            if (!user) {
                return { error: 'User not found', status: 401 };
            }
            //enroll only if not already enrolled use arrow function to check id
            console.log(user.courses);
            console.log(courseId);
            const value = user.courses.some((item) => item._id.equals(courseId));
            if (value) {
                return { error: 'Already enrolled', status: 401 };
            }
            user.courses.push(course);
            await user.save();
            return course;
        } catch (error) {
            return { error: error.message, status: 500 };
        }
    }
    
    async getAllCourses() {
        return await this.courseRepository.getAllCourses();
    }


    //get course by id
    async getCourseById(courseId) {
        try {
            const course = await this.courseRepository.findCourseById(courseId);
            if (!course) {
                return { error: 'Course not found', status: 401 };
            }
            return course;
        } catch (error) {
            console.log(error);
            return { error: error.message, status: 500 };   
        }
    }

    async getLessonById(lessonId) {
        try {
            const lesson = await this.courseRepository.findLessonById(lessonId);
            if (!lesson) {
                return { error: 'Lesson not found', status: 401 };
            }
            return lesson;
        } catch (error) {
            console.log(error);
            return { error: error.message, status: 500 };
        }
    }
    

    //search course by substring of title
    async searchCourseByTitle(title) {
        const regex = new RegExp(title, 'i') // 'i' makes it case insensitive
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

    async getModules(courseId, userId) {
        try {
            const course = await this.courseRepository.findCourseById(courseId);
            if (!course) {
                return { error: 'Course not found', status: 401 };
            }
            course.populate('educator')
            if (!course.educator._id.equals(userId)) {
                return { error: 'Unauthorized', status: 401 };
            }
            const modules = await course.populate('modules');
            return modules;
        } catch (error) {
            console.log(error);
            return { error: error.message, status: 500 };
        }
    }

    //loop over all modules in course and get modules from modules schema
    async getModulesofCourse(courseId) {
        try {
            const course = await this.courseRepository.findCourseById(courseId);
            if (!course) {
                return { error: 'Course not found', status: 401 };
            }
            const courseM = await course.populate('modules');
            for (let i = 0; i < courseM.modules.length; i++) {
                const module = await this.courseRepository.findModuleById(courseM.modules[i]._id);
                courseM.modules[i] = module;
            }
            return courseM;
        }catch (error) {
            console.log(error);
            return { error: error.message, status: 500 };
        }
    }

    async hasEnrolled(courseId, userId) {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                return { error: 'User not found', status: 401 };
            }
            const course = await this.courseRepository.findCourseById(courseId);
            if (!course) {
                return { error: 'Course not found', status: 401 };
            }
            const value = user.courses.some((item) => item._id.equals(courseId));
            return value;
        } catch (error) {
            return { error: error.message, status: 500 };
        }
    }

}

module.exports = CourseService;