import { useState } from 'react'

import CourseList from '@/components/course/courselist'
import CourseDetails from '@/components/course/coursedetails'
import CourseMap from '@/components/course/coursemap'

export interface Course {
  _id: string; // Add this field
  name: string;
  town: string;
  location: string;
  url: string;
  postCode: string;
  latitude: number;
  longitude: number;
  difficulty: string;
  familyFriendly: boolean;
  holes: number;
}

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
