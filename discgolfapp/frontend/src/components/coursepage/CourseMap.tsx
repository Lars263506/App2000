import React, { useRef, useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import Course from '@/types/course'

import { useTranslation } from 'react-i18next';

/**
 * @author Adrian Johansen
 * @description This component displays a map of disc golf courses using Google Maps.
 * It allows users to filter courses by difficulty and view course details by clicking on markers.
 * The map dynamically centers on the selected course and adjusts zoom levels.
 * Users can navigate to a course using a link to Google Maps.
 * Translations are used for all text, and the map supports responsiveness and interactivity.
 */

interface CourseMapProps {
  selectedCourse: Course | null;
  courses: Course[];
  setSelectedCourse: (course: Course) => void;
}

const CourseMap: React.FC<CourseMapProps> = ({ selectedCourse, courses, setSelectedCourse }) => {
  const { t, i18n } = useTranslation();
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
    <div className={`flex flex-col gap-2 p-4 rounded-xl shadow bg-[#E7EFFB] ${selectedCourse ? 'w-7/10' : 'w-full'} h-[100vh]`}>
      <select
        className="p-2 border rounded"
        value={difficultyFilter}
        onChange={(e) => setDifficultyFilter(e.target.value)}
      >
        <option value="">{t("coursemap_alldifficulties")}</option>
        <option value="Easy">{t("coursemap_easy")}</option>
        <option value="Medium">{t("coursemap_medium")}</option>
        <option value="Hard">{t("coursemap_hard")}</option>
      </select>

      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
        language={i18n.language}
      >
        <GoogleMap
          onLoad={(map) => { mapRef.current = map; }}
          center={selectedCourse ? { lat: selectedCourse.latitude, lng: selectedCourse.longitude } : { lat: 59.9139, lng: 10.7522 }}
          zoom={selectedCourse ? 15 : 6}
          mapContainerStyle={{ height: '100%', width: '100%' }}
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
                <p>{t("coursemap_difficulty")} {selectedMarker.difficulty}</p>
                <p>{t("coursemap_amountofholes")} {selectedMarker.holes}</p>
                <p>{t("coursemap_familyfriendly")} {selectedMarker.familyFriendly
                  ? t("coursemap_familyfriendly_yes")
                  : t("coursemap_familyfriendly_no")}
                </p>

                <a
                  href={`https://www.google.com/maps?q=${selectedMarker.latitude},${selectedMarker.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 block mt-2"
                >
                  {t("coursemap_navigatehere")}
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
