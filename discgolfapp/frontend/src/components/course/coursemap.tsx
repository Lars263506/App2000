import React, { useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Course } from '../../pages/coursepage';

type CourseMapProps = {
    selectedCourse: Course | null;
    courses: Course[];

};

const CourseMap: React.FC<CourseMapProps> = ({ selectedCourse, courses }) => {

    const mapRef = useRef<google.maps.Map | null>(null);

    useEffect(() => {
        if (mapRef.current && selectedCourse) {
            const newCenter = new window.google.maps.LatLng(selectedCourse.latitude, selectedCourse.longitude);
            mapRef.current.setCenter(newCenter);
            mapRef.current.setZoom(15);
        }
    }, [selectedCourse]);

    return (
        <div className=" md:w-1/2 flex-grow min-w-[450px] bg-gray-200 p-4 rounded-xl shadow">
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
                <GoogleMap
                    onLoad={(map) => {
                        mapRef.current = map;
                    }}
                    center={selectedCourse ? { lat: selectedCourse.latitude, lng: selectedCourse.longitude } : { lat: 59.9139, lng: 10.7522 }}
                    zoom={selectedCourse ? 15 : 6}
                    mapContainerStyle={{ height: '570px', width: '100%' }}
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
