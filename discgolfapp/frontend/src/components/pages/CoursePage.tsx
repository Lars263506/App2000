import { useState } from 'react'

import CourseList from '@/components/coursepage/CourseList'
import CourseDetails from '@/components/coursepage/CourseDetails'
import CourseMap from '@/components/coursepage/CourseMap'
import Course from '@/types/course'

/**
 * @author Ibrahim Queeum & Lars Andreas.
 * @description The CoursePage component serves as the main page for managing and exploring disc golf courses.
 * It integrates three main components: CourseList, CourseDetails, and CourseMap.
 * Users can view a list of courses, see detailed information about a selected course, and explore courses on a map.
 * 
 * Features:
 * - Displays a list of courses with filtering and search functionality.
 * - Shows detailed information about a selected course, including reviews and weather data.
 * - Displays a map with markers for all courses, allowing users to select and view course details.
 * - Provides a responsive layout for seamless navigation between components.
 * 
 
 */
const CoursePage = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  return (
    <div className='flex flex-row flex-wrap gap-4 p-4'>
        <div className="w-3/10 h-full">
            <CourseList
              courses={courses}
              setCourses={setCourses}
              setSelectedCourse={setSelectedCourse}
            />
        </div>

        <div className="w-3/10">
          <CourseDetails
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
          />
        </div>

        <div className="w-5/10 flex-grow">
            <CourseMap
              selectedCourse={selectedCourse}
              courses={courses}
              setSelectedCourse={setSelectedCourse}
            />
        </div>
    </div>
  )
}

export default CoursePage
