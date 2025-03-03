import Course from '../models/Course.js'

const getAllCourses = async () => {
  const courses = await Course.find()

  if (!courses) {
    throw new Error('No courses found')
  }

  return courses
}

const getCourse = async (id) => {
  const course = await Course.findById(id)

  if (!course) {
    throw new Error('Course not found')
  }

  return course
}

const createNewCourse = async (course) => {
  const newCourse = new Course(course)
  await newCourse.save()

  return newCourse
}

const deleteCourse = async (id) => {
  const course = await Course.findByIdAndDelete(id)

  if (!course) {
    throw new Error('Course not found')
  }

  return course
}

const updateCourse = async (id, request) => {
  await Course.findByIdAndUpdate(id, request, { new: true })
}

export { getAllCourses, getCourse, createNewCourse, deleteCourse, updateCourse }
