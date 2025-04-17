import Course from '../../src/models/Course.js';
import {
    getAllCourses,
    getCourse
} from '../../src/services/courseService.js';

jest.mock('../../src/models/Course', () => {
    const mockAggregate = jest.fn().mockResolvedValue([
        { id: '1', name: 'Course 1', reviews: [] },
        { id: '2', name: 'Course 2', reviews: [] },
    ]);

    return {
        aggregate: mockAggregate,
        find: jest.fn(),
        findById: jest.fn(),
        findByIdAndDelete: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        create: jest.fn(),
    };
});

jest.mock('../../src/models/User', () => ({
    findById: jest.fn(),
}));

describe('courseService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllCourses', () => {
        it('should return all courses if they exist', async () => {
            const mockCourses = [
                { id: '1', name: 'Course 1', reviews: [] },
                { id: '2', name: 'Course 2', reviews: [] }
            ];
            Course.find.mockResolvedValue(mockCourses);

            const result = await getAllCourses();

            expect(Course.aggregate).toHaveBeenCalledWith([
                {
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'courseId',
                        as: 'reviews',
                    },
                },
            ]);
            expect(result).toEqual(mockCourses);
        });

        it('should throw an error if no courses are found', async () => {
            Course.aggregate.mockResolvedValue(null);

            await expect(getAllCourses()).rejects.toThrow('No courses found');

            expect(Course.aggregate).toHaveBeenCalledWith([
                {
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'courseId',
                        as: 'reviews',
                    },
                },
            ]);
        });
    });

    describe('getCourse', () => {
        it('should return a course if it exists', async () => {
            const mockCourse = { id: '1', name: 'Test Course' };
            Course.findById.mockResolvedValue(mockCourse);

            const result = await getCourse('1');

            expect(Course.findById).toHaveBeenCalledWith('1');
            expect(result).toEqual(mockCourse);
        });

        it('should throw an error if the course does not exist', async () => {
            Course.findById.mockResolvedValue(null);

            await expect(getCourse('1')).rejects.toThrow('Course not found');

            expect(Course.findById).toHaveBeenCalledWith('1');
        });
    });
});
