import { useState } from 'react';
import '../app/globals.css';
import Navbar from '../components/global/navbar';
import Footer from '@/components/global/footer';
import CourseList from '@/components/course/courselist';
import CourseDetails from '@/components/course/coursedetails';
import CourseMap from '@/components/course/coursemap';
import PopupWrapper from '@/components/global/popupwrapper';
import { usePopup } from '@/components/global/usepopup';

export type Course = {
  name: string;
  location: string;
  url: string;
  postCode: string;
  latitude: number;
  longitude: number;
  difficulty: string;
  familyFriendly: boolean;
};

const CoursePage = () => {
  const { popupType, toggleLoginPopup, toggleRegisterPopup, closePopup } = usePopup();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleLoginPopup={toggleLoginPopup} />
      
      {/* Hovedinnhold */}
      <div className="flex-grow px-4 py-4">
        {/* Flex-container for responsiv layout */}
        <div className="flex flex-wrap lg:flex-nowrap h-full gap-4">
          {/* CourseList - Fikset bredde og fleksibel tilpasning */}
          <div className="flex-grow lg:flex-shrink-0 lg:basis-1/4">
            <CourseList 
              courses={courses} 
              setCourses={setCourses} 
              setSelectedCourse={setSelectedCourse} 
            />
          </div>

          {/* CourseDetails - Kun synlig når et kurs er valgt */}
          {selectedCourse && (
            <div className="flex-grow lg:flex-shrink-0 lg:basis-1/4">
              <CourseDetails 
                selectedCourse={selectedCourse} 
                setSelectedCourse={setSelectedCourse} 
              />
            </div>
          )}

          {/* CourseMap - Tar opp all resterende plass */}
          <div className={`flex-grow ${selectedCourse ? 'lg:basis-2/4' : 'lg:basis-3/4'}`}>
            <CourseMap 
              selectedCourse={selectedCourse} 
              courses={courses} 
              setSelectedCourse={setSelectedCourse}
            />
          </div>
        </div>
      </div>

      <PopupWrapper
        popupType={popupType}
        closePopup={closePopup}
        toggleRegisterPopup={toggleRegisterPopup}
      />

      <Footer />
    </div>
  );
};

export default CoursePage;
