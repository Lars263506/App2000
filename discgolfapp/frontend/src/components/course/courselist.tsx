import { type } from 'os';
import React, { useState, useEffect, useRef } from 'react';

type Course = {
  id: number;
  name: string;
  location: string;
  url: string;
  latitude: number;
  longitude: number;
}[];

const CourseList = () => {
  const [courses, setCourses] = useState<Course>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {

        /*
        const response = await fetch('');
        const data = await response.json();
        */
        const data = [
          {
            id: 1,
            name: 'Haugerud',
            location: 'Oslo',
            url: 'https://www.oslo.kommune.no/natur-kultur-og-fritid/tur-og-friluftsliv/friluftsliv-i-byen/discgolf-i-oslo/',
            latitude: 59.9139,
            longitude: 10.7522,
          },
          {
            id: 2,
            name: 'Ekeberg',
            location: 'Oslo',
            url: 'https://www.oslo.kommune.no/natur-kultur-og-fritid/tur-og-friluftsliv/friluftsliv-i-byen/discgolf-i-oslo/',
            latitude: 59.9139,
            longitude: 10.7522,
          },
          {
            id: 3,
            name: 'Voldsløkka',
            location: 'Oslo',
            url: 'https://www.oslo.kommune.no/natur-kultur-og-fritid/tur-og-friluftsliv/friluftsliv-i-byen/discgolf-i-oslo/',
            latitude: 59.9139,
            longitude: 10.7522,
          },
        ];
        
        console.log('API-respons:', data); 
        setCourses(data);
      } catch (error) {
        console.error('Feil ved henting av baner:', error);
      }
    };
    fetchCourses();
  }, []);

  return (  
    <div className="flex gap-4 p-4">
      <div className="w-96 bg-gray-200 p-4 rounded-xl shadow text-black">
        <input
          type="text"
          placeholder="Søk etter bane..."
          className="border p-2 rounded w-full mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul>
        {courses
            .filter((course) => course.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((course) => (
              <li key={course.id} className="p-2 border-b">
                <a href={course.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  {course.name} ({course.location})
                </a>
              </li>
            ))}
        </ul>
      </div>

    
    </div>
  );
};

export default CourseList;

/*
{courses
            .filter((course) => course.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((course) => (
              <li key={course.id} className="p-2 border-b">
                <a href={course.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  {course.name} ({course.location})
                </a>
              </li>
            ))}
*/

/*
<div className="w-full bg-gray-200 p-4 rounded-xl shadow">
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            onLoad={(map) => (mapRef.current = map)}
            center={{ lat: 59.9139, lng: 10.7522 }}
            zoom={6}
            mapContainerStyle={{ height: '500px', width: '100%' }}
          >
            {courses.map((course) => (
              <Marker key={course.id} position={{ lat: course.latitude, lng: course.longitude }} />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
  */
