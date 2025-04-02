import Course from '../models/Course.js'

/**
 * @author Lars Andreas Strand
 * @description This is the service for the Course model.
 * It handles the business logic for the Course model.
 */
const getAllCourses = async () => {
  const courses = await Course.find()

  if (!courses) {
    throw new Error('No courses found')
  }

  return courses
}

/**
 * @author Lars Andreas Strand
 * @description This function retrieves a specific course from the database.
 * @param {string} id - The ID of the course to retrieve.
 * @return The course object with the specified ID.
 * @throws An error if the course is not found.
 */

const getCourse = async (id) => {
  const course = await Course.findById(id)

  if (!course) {
    throw new Error('Course not found')
  }

  return course
}

/**
 * @author Lars Andreas Strand
 * @description This function creates a new course in the database.
 * @param {object} course - The course object to create.
 * @returns The created course object.
 */

const createNewCourse = async (course) => {
  const newCourse = new Course(course)
  await newCourse.save()

  return newCourse
}

/**
 * @author Lars Andreas Strand
 * @description This function deletes a course from the database.
 * @param {string} id - The ID of the course to delete.
 * @returns The deleted course object.
 */

const deleteCourse = async (id) => {
  const course = await Course.findByIdAndDelete(id)

  if (!course) {
    throw new Error('Course not found')
  }

  return course
}

/**
 * @author Lars Andreas Strand
 * @description This function updates a course in the database.
 * @param {string} id - The ID of the course to update.
 * @param {object} request - The request object containing the updated course data.
 * @returns The updated course object.
 */

const updateCourse = async (id, request) => {
  await Course.findByIdAndUpdate(id, request, { new: true })
}

export { getAllCourses, getCourse, createNewCourse, deleteCourse, updateCourse }
