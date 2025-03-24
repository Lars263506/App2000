import React, { useRef, useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Course } from '../../pages/coursepage';

interface CourseMapProps {
  selectedCourse: Course | null;
  courses: Course[];
  setSelectedCourse: (course: Course) => void;
}

const CourseMap: React.FC<CourseMapProps> = ({ selectedCourse, courses, setSelectedCourse }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Course | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState('');

  useEffect(() => {
    if (mapRef.current && selectedCourse) {
      const newCenter = new window.google.maps.LatLng(selectedCourse.latitude, selectedCourse.longitude);
      mapRef.current.setCenter(newCenter);
      mapRef.current.setZoom(15);
    }
  }, [selectedCourse]);

  const filteredCourses = courses.filter(course =>
    difficultyFilter ? course.difficulty.toLowerCase() === difficultyFilter.toLowerCase() : true
  );

  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl shadow bg-gray-200 ">
      {/* Filter with difficulty level */}
      <select
        className="p-2 border rounded"
        value={difficultyFilter}
        onChange={(e) => setDifficultyFilter(e.target.value)}
      >
        <option value="">Alle vanskelighetsgrader</option>
        <option value="Easy">Lett</option>
        <option value="Medium">Middels</option>
        <option value="Difficult">Vanskelig</option>
      </select>

      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
        <GoogleMap
          onLoad={(map) => { mapRef.current = map; }}
          center={selectedCourse ? { lat: selectedCourse.latitude, lng: selectedCourse.longitude } : { lat: 59.9139, lng: 10.7522 }}
          zoom={selectedCourse ? 15 : 6}
          mapContainerStyle={{ height: '570px', width: '100%' }}
        >
          {filteredCourses.map((course) => (
            <Marker
              key={course.name}
              position={{ lat: course.latitude, lng: course.longitude }}
              onClick={() => {
                setSelectedCourse(course);
                setSelectedMarker(course);
              }}
            />
          ))}

          {selectedMarker && (
            <InfoWindow position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }} onCloseClick={() => setSelectedMarker(null)}>
              <div className="p-2">
                <h3 className="font-bold">{selectedMarker.name}</h3>
                <p>{selectedMarker.location}</p>
                <p>Vanskelighetsgrad: {selectedMarker.difficulty}</p>
                <p>Antall hull: {selectedMarker.holes}</p>
                <p>Familievennlig: {selectedMarker.familyFriendly ? 'Ja' : 'Nei'}</p>

                <a
                  href={`https://www.google.com/maps?q=${selectedMarker.latitude},${selectedMarker.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 block mt-2"
                >
                  Naviger hit
                </a>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default CourseMap;
