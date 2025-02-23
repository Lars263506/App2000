import Course from '../models/Course.js'

const getAllCourses = async () => {
    const courses = await Course.find();

    if (!courses) {
        throw new Error("No courses found");
    }

    return courses;
}

export { getAllCourses };
