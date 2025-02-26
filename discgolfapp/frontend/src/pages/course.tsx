import { useState } from 'react';

import '../app/globals.css';
import Navbar from '../components/navbar';
import Footer from '@/components/footer';
import CourseList from '@/components/course/courselist';
import CourseDetails from '@/components/course/coursedetails';
import CourseMap from '@/components/course/coursemap';
import PopupWrapper from '@/components/popupwrapper';
import { usePopup } from '@/components/usepopup';

export type Course = {
    name: string;
    location: string;
    url: string;
    postCode: string;
    latitude: number;
    longitude: number;
};

const Course = () => {
    const { popupType, toggleLoginPopup, toggleRegisterPopup, closePopup } = usePopup();
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    return (
        <div>
            <div className="min-h-screen flex flex-col">
                <Navbar toggleLoginPopup={toggleLoginPopup}/>

                <div className="flex flex-row gap-4 p-4">
                    <CourseList courses={courses} setCourses={setCourses} setSelectedCourse={setSelectedCourse} />

                    <CourseDetails selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse}/>

                    <CourseMap selectedCourse={selectedCourse} courses={courses} setSelectedCourse={setSelectedCourse} />
                </div>

                <PopupWrapper
                    popupType={popupType}
                    closePopup={closePopup}
                    toggleRegisterPopup={toggleRegisterPopup}
                />

                <div className='absolute bottom-0 w-full'>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default Course;
