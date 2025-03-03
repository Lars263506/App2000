import { useState } from 'react'
import '../app/globals.css'
import Navbar from '../components/global/navbar'
import Footer from '@/components/global/footer'
import CourseList from '@/components/course/courselist'
import CourseDetails from '@/components/course/coursedetails'
import CourseMap from '@/components/course/coursemap'
import { usePopup } from '@/components/global/usepopup'
import PopupWrapper from '@/components/global/popupwrapper'

export interface Course {
  name: string
  location: string
  url: string
  postCode: string
  latitude: number
  longitude: number
  difficulty: string
  familyFriendly: boolean
}

const CoursePage = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const { popupType, toggleLoginPopup, toggleRegisterPopup, closePopup } = usePopup()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleLoginPopup={toggleLoginPopup}/>
      
      {/* Hovedinnhold */}
      <div className="flex-grow p-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:flex-wrap">
          {/* CourseList - tar en fast bredde */}
          <div className="lg:w-1/4 xl:w-1/5 w-full">
            <CourseList
              courses={courses}
              setCourses={setCourses}
              setSelectedCourse={setSelectedCourse}
            />
          </div>
          
          {/* CourseDetails - vises kun når et kurs er valgt */}
          {selectedCourse && (
            <div className="lg:w-1/4 xl:w-1/5 w-full mb-8 lg:mb-0 mr-6">
              <CourseDetails
                selectedCourse={selectedCourse}
                setSelectedCourse={setSelectedCourse}
              />
            </div>
          )}
          
          {/* CourseMap - tar resten av plassen, justerer når CourseDetails er åpen */}
          <div className={`flex-1 h-96 lg:h-auto ${selectedCourse ? 'lg:ml-8' : ''}`}>
            <CourseMap
              selectedCourse={selectedCourse}
              courses={courses}
              setSelectedCourse={setSelectedCourse}
            />
          </div>
        </div>
      </div>
      
      {/* Popup Wrapper - Dette er popupen som vises på toppen */}
      <PopupWrapper
        popupType={popupType}
        closePopup={closePopup}
        toggleRegisterPopup={toggleRegisterPopup}
      />
      
      <Footer />
    </div>
  )
}

export default CoursePage
