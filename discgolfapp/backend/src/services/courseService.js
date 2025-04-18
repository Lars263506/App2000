import Course from '../models/Course.js';

const getAllCourses = async () => {
  const courses = await Course.aggregate([
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'courseId',
        as: 'reviews',
      },
    },
  ]);

  if (!courses || courses.length === 0) {
    throw new Error('No courses found');
  }

  return courses;
};

const getCourse = async (id) => {
  const course = await Course.findById(id);

  if (!course) {
    throw new Error('Course not found');
  }

  return course;
};

const getCoursePins = async (id) => {
  const course = await Course.findById(id).select('pins lines');
  if (!course) {
    throw new Error('Course not found');
  }
  return { pins: course.pins, lines: course.lines };
};

const getCoursesForOwner = async (clubOwnerId) => {
  const user = await Course.findById(clubOwnerId).select('displayName');

  if (!user) {
    throw new Error('User not found');
  }

  const courses = await Course.find({ courseOwner: user.displayName });

  if (!courses) {
    return [];
  }

  return courses;
};

const createNewCourse = async (course) => {
  const newCourse = new Course(course);
  await newCourse.save();

  return newCourse;
};

const deleteCourse = async (id) => {
  const course = await Course.findByIdAndDelete(id);

  if (!course) {
    throw new Error('Course not found');
  }

  return course;
};

const updateCourse = async (id, request) => {
  await Course.findByIdAndUpdate(id, request, { new: true });
};

export {
  getAllCourses,
  getCourse,
  getCoursePins,
  getCoursesForOwner,
  createNewCourse,
  deleteCourse,
  updateCourse,
};
