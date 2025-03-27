import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

interface Course {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  difficulty: string;
  par: number;
}

interface Hole {
  holeNumber: number;
  par: number;
  distance: number;
  outOfBounds: boolean;
  description: string;
  latitude: number;
  longitude: number;
}

export default function EditCourseMap() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [holes, setHoles] = useState<Hole[]>([]);
  const [editRights, setEditRights] = useState(false);
  const router = useRouter();
  const { clubId } = router.query;

  useEffect(() => {
    fetchCourses();
    checkEditRights();
  }, []);

  useEffect(() => {
    if (selectedCourseId && courses.length > 0) {
      const selectedCourse = courses.find(course => course.id === selectedCourseId);
      if (selectedCourse) {
        setHoles(generateHoles(selectedCourse));
      }
    }
  }, [selectedCourseId, courses]);

  const fetchCourses = async () => {
    const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/course';
    try {
      const response = await fetch(url);
      const result = await response.json();
      if (result.data) {
        setCourses(result.data);
      } else {
        toast.error('Ingen baner funnet');
      }
    } catch (error) {
      toast.error('En feil oppstod ved henting av baner');
    }
  };

  const checkEditRights = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Du er ikke logget inn.');
      setEditRights(false);
      return;
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/me`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        setEditRights(false);
        toast.error('Kunne ikke hente brukerens data');
        return;
      }

      const data = await response.json();
      setEditRights(data.role === 'clubowner' || data.role === 'admin');
    } catch (error) {
      toast.error('En feil oppstod ved sjekking av rettigheter');
      setEditRights(false);
    }
  };

  const handleSelectCourse = (courseId: string) => {
    console.log('Selected course ID:', courseId); // Debugging: sjekk hvilken bane som er valgt
    setSelectedCourseId(courseId);
  };

  const generateHoles = (course: Course) => {
    return Array.from({ length: 12 }, (_, index) => ({
      holeNumber: index + 1,
      par: 3,
      distance: 100,
      outOfBounds: false,
      description: '',
      latitude: course.latitude + Math.random() * 0.01,
      longitude: course.longitude + Math.random() * 0.01,
    }));
  };

  const renderCourses = () => {
    if (courses.length === 0) {
      return <p>Ingen baner tilgjengelig.</p>;
    }

    return courses.map((course) => {
      return (
        <li
          key={course.id}
          className={`p-4 border rounded-lg cursor-pointer ${selectedCourseId === course.id ? 'bg-gray-400 text-white' : ''}`}
          onClick={() => handleSelectCourse(course.id)}
        >
          {course.name}
        </li>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col text-black">
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-5xl w-full p-10 bg-white shadow-xl rounded-2xl min-h-[600px] mb-40 relative border border-gray-300">
          {!selectedCourseId ? (
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-1">
                <h1 className="text-xl font-bold text-center mb-4">Velg Bane</h1>
                <ul className="space-y-6">
                  {renderCourses()}
                </ul>
              </div>
              <div className="col-span-2 flex flex-col items-center">
                <h2 className="text-lg font-semibold">Velg en bane for å redigere.</h2>
              </div>
            </div>
          ) : (
            <div className="relative" style={{ width: '100%', height: '600px' }}>
              {courses.length > 0 && selectedCourseId && (
                <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
                  <GoogleMap
                    center={{
                      lat: courses.find(course => course.id === selectedCourseId)?.latitude || 59.9139,
                      lng: courses.find(course => course.id === selectedCourseId)?.longitude || 10.7522,
                    }}
                    zoom={15}
                    mapContainerStyle={{ height: "600px", width: "100%" }}
                  >
                    {holes.map((hole) => (
                      <Marker
                        key={`hole-marker-${hole.holeNumber}`}
                        position={{
                          lat: hole.latitude,
                          lng: hole.longitude,
                        }}
                      />
                    ))}
                  </GoogleMap>
                </LoadScript>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
