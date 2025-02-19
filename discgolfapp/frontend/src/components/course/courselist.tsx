import React, { useState, useEffect } from 'react';

type Course = {
  name: string;
  location: string;
  url: string;
  latitude: number;
  longitude: number;
};

const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + 'course';

      try {
        const response = await fetch(url, {
            'method': "GET"
        });

        const result = await response.json();

        const data = result.data;

        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          console.error('Fetched data is not an array:', data);
        }
        
        setCourses(data);
      } catch (error) {
        console.error('Feil ved henting av baner:', error);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          {filteredCourses.map(course => (
            <li key={course.name}>{course.name}</li>
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
