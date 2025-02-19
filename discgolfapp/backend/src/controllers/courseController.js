import * as courseService from '../services/courseService.js';

const getAllCourses = async (req, res) => {
    try {
        const response = await courseService.getAllCourses();
        res.json({ data: response });
    } catch (err) {
        res.status(404).json({error: err.message});
    }
};

export { getAllCourses };
