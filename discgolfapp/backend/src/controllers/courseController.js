import * as courseService from '../services/courseService.js'

const getAllCourses = async (req, res) => {
  try {
    const response = await courseService.getAllCourses()
    res.json({ data: response })
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

const getCourse = async (req, res) => {
  try {
    const response = await courseService.getCourse(req.params.id)
    res.json({ data: response })
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

const createNewCourse = async (req, res) => {
  try {
    const response = await courseService.createNewCourse(req.body)
    res.json({ data: response })
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

const deleteCourse = async (req, res) => {
  try {
    const response = await courseService.deleteCourse(req.params.id)
    res.json({ data: response })
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

const updateCourse = async (req, res) => {
  try {
    const response = await courseService.updateCourse(req.params.id, req.body)
    res.json({ data: response })
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

export { getAllCourses, getCourse, createNewCourse, deleteCourse, updateCourse }
