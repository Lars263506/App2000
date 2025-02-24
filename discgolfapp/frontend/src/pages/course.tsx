import { useState } from 'react';

import '../app/globals.css';
import Navbar from '../components/navbar';
import Footer from '@/components/footer';
import Login from '@/components/login';
import Register from '@/components/register';
import CourseList from '@/components/course/courselist';
import CourseDetails from '@/components/course/coursedetails';
import CourseMap from '@/components/course/coursemap';

export type Course = {
    name: string;
    location: string;
    url: string;
    postCode: string;
    latitude: number;
    longitude: number;
};

const Course = () => {

const [courses, setCourses] = useState<Course[]>([]);
const [popupType, setPopupType] = useState<'login' | 'register' | null>(null);
const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
const toggleLoginPopup = () => setPopupType(popupType === 'login' ? null : 'login');
const toggleRegisterPopup = () => setPopupType(popupType === 'register' ? 'login' : 'register');
const closePopup = () => setPopupType(null);

    return (
        <div>
            <div className="min-h-screen flex flex-col">
                <Navbar toggleLoginPopup={toggleLoginPopup}/>
                <div className="flex flex-row gap-4 p-4">
                    <CourseList courses={courses} setCourses={setCourses} setSelectedCourse={setSelectedCourse} />

                    <CourseDetails selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse}/>

                    <CourseMap selectedCourse={selectedCourse} courses={courses} setSelectedCourse={setSelectedCourse} />
                </div>
                    {popupType === 'login' && (
                        <Login togglePopup={toggleLoginPopup} toggleRegisterPopup={toggleRegisterPopup} closePopup={closePopup} />
                        )}
                    {popupType === 'register' && <Register togglePopup={toggleRegisterPopup} />}
                    <div className='absolute bottom-0 w-full'>
                        <Footer />
                    </div>
            </div>
        </div>
    );
}

export default Course;
