import * as courseController from '../../src/controllers/courseController.js';
import * as courseService from '../../src/services/courseService.js';

jest.mock('../../src/controllers/clubpageController.js');
jest.mock('../../src/services/clubpageService.js');

jest.mock('../../src/services/courseService.js');
jest.mock('../../src/models/Course.js');

describe('Course Controller', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = { params: {}, body: {}, user: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe('getAllCourses', () => {
        it('should return all courses with status 200', async () => {
            const mockCourses = [{ id: 1, name: 'Course 1' }];
            courseService.getAllCourses.mockResolvedValue(mockCourses);

            await courseController.getAllCourses(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ data: mockCourses });
        });

        it('should return error with status 404 if service fails', async () => {
            const errorMessage = 'Error fetching courses';
            courseService.getAllCourses.mockRejectedValue(new Error(errorMessage));

            await courseController.getAllCourses(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });

    describe('getCourse', () => {
        it('should return a course with status 200', async () => {
            const mockCourse = { id: 1, name: 'Course 1' };
            mockReq.params.id = '1';
            courseService.getCourse.mockResolvedValue(mockCourse);

            await courseController.getCourse(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith({ data: mockCourse });
        });

        it('should return error with status 404 if course not found', async () => {
            const errorMessage = 'Course not found';
            mockReq.params.id = '1';
            courseService.getCourse.mockRejectedValue(new Error(errorMessage));

            await courseController.getCourse(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });

    describe('createNewCourse', () => {
        it('should create a new course and return it with status 201', async () => {
            const mockCourse = { id: 1, name: 'New Course' };
            mockReq.body = { name: 'New Course' };
            courseService.createNewCourse.mockResolvedValue(mockCourse);

            await courseController.createNewCourse(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({ data: mockCourse });
        });

        it('should return error with status 404 if creation fails', async () => {
            const errorMessage = 'Error creating course';
            mockReq.body = { name: 'New Course' };
            courseService.createNewCourse.mockRejectedValue(new Error(errorMessage));

            await courseController.createNewCourse(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });

    describe('deleteCourse', () => {
        it('should delete a course and return success with status 200', async () => {
            const mockResponse = { message: 'Course deleted' };
            mockReq.params.id = '1';
            courseService.deleteCourse.mockResolvedValue(mockResponse);

            await courseController.deleteCourse(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ data: mockResponse });
        });

        it('should return error with status 404 if deletion fails', async () => {
            const errorMessage = 'Error deleting course';
            mockReq.params.id = '1';
            courseService.deleteCourse.mockRejectedValue(new Error(errorMessage));

            await courseController.deleteCourse(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });

    describe('updateCourse', () => {
        it('should update a course and return it with status 200', async () => {
            const mockCourse = { id: 1, name: 'Updated Course' };
            mockReq.params.id = '1';
            mockReq.body = { name: 'Updated Course' };
            courseService.updateCourse.mockResolvedValue(mockCourse);

            await courseController.updateCourse(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith({ data: mockCourse });
        });

        it('should return error with status 404 if update fails', async () => {
            const errorMessage = 'Error updating course';
            mockReq.params.id = '1';
            mockReq.body = { name: 'Updated Course' };
            courseService.updateCourse.mockRejectedValue(new Error(errorMessage));

            await courseController.updateCourse(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });
});
