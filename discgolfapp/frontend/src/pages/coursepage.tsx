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
        <div>
            <div className="min-h-screen flex flex-col">
                <Navbar toggleLoginPopup={toggleLoginPopup} />

                <div className="flex flex-col sm:flex-row items-start gap-4 px-4 py-4">
                    <CourseList courses={courses} setCourses={setCourses} setSelectedCourse={setSelectedCourse} />

                    <CourseDetails selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} />

                    <CourseMap selectedCourse={selectedCourse} courses={courses} />
                </div>

                <PopupWrapper
                    popupType={popupType}
                    closePopup={closePopup}
                    toggleRegisterPopup={toggleRegisterPopup}
                />

                <div className="w-full bottom-0 w-full">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default CoursePage;
