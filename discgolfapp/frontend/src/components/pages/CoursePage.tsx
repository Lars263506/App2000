import { useState } from 'react'

import CourseList from '@/components/coursepage/CourseList'
import CourseDetails from '@/components/coursepage/CourseDetails'
import CourseMap from '@/components/coursepage/CourseMap'
import Course from '@/types/aaa'

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
