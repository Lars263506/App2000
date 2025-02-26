import React, { useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Course } from '../../pages/coursepage';

type CourseMapProps = {
    selectedCourse: Course | null;
    courses: Course[];
    setSelectedCourse: (course: Course | null) => void;
};

const CourseMap: React.FC<CourseMapProps> = ({ selectedCourse, courses, setSelectedCourse }) => {

    const mapRef = useRef<google.maps.Map | null>(null);

    return (
        <div className="flex-grow min-w-[300px] bg-gray-200 p-4 rounded-xl shadow">
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
                <GoogleMap
                    onLoad={(map) => {
                        mapRef.current = map;
                    }}
                    center={{ lat: 59.9139, lng: 10.7522 }}
                    zoom={6}
                    mapContainerStyle={{ height: '500px', width: '100%' }}
                >
                    {courses.map((course) => (
                        <Marker key={course.name} position={{ lat: course.latitude, lng: course.longitude }} />
                    ))}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

export default CourseMap;
