import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface Course {
  id?: string;
  name: string;
  location: string;
  town: string;
  postCode: string;
  url?: string;
  latitude?: number;
  longitude?: number;
  difficulty: string;
  familyFriendly: boolean;
  holes?: number;
  courseOwner?: string;
}

interface User {
  id: string;
  name: string;
}

const CreateCourse: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const userRole = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Ingen tilgangstoken funnet');
        }

        // Sjekk autorisasjon
        const authResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/has-access`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (authResponse.status === 200) {
          const authData = await authResponse.json();
          setIsAuthorized(authData.hasAccess);
        } else {
          setIsAuthorized(false);
          throw new Error('Autorisasjon feilet: Status ' + authResponse.status);
        }

        // Hent baner
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
        const coursesUrl = userRole === 'admin' ? `${baseUrl}/course` : `${baseUrl}/course/owner`;
        
        const coursesResponse = await fetch(coursesUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!coursesResponse.ok) {
          throw new Error(`Kunne ikke hente baner: Status ${coursesResponse.status}`);
        }

        const coursesData = await coursesResponse.json();
        console.log('Fetched courses:', coursesData); // Logg rådata
        
        // Map baner og sikre id
        const mappedCourses = (coursesData.data || coursesData).map((course: any) => ({
          ...course,
          id: course._id || course.id,
        }));

        setCourses(mappedCourses);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Feil ved henting av baner: ' + error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userRole, userId]);

  useEffect(() => {
    const fetchClubOwners = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/clubowners`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch club owners: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data.data.map((user: { id: string; displayName: string }) => ({ id: user.id, name: user.displayName })));
      } catch (error) {
        console.error('Error fetching club owners:', error);
        toast.error('Kunne ikke hente klubb-eiere: ' + error);
      }
    };

    if (userRole === 'admin') {
      fetchClubOwners();
    }
  }, [userRole]);

  const handleCreateNew = () => {
    setSelectedCourse(null);
    setIsCreating(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setSelectedCourse(null);
    setIsCreating(false);
  };

  const handleSave = (savedCourse: Course) => {
    setCourses((prev) =>
      savedCourse.id
        ? prev.map((c) => (c.id === savedCourse.id ? { ...savedCourse } : c))
        : [...prev, { ...savedCourse, id: savedCourse.id || `${Date.now()}` }]
    );
    setSelectedCourse(null);
    setIsCreating(false);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Er du sikker på at du vil slette denne banen?')) {
      return;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Kunne ikke slette banen: Status ${response.status}`);
      }

      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      toast.success('Banen ble slettet!');
    } catch (error) {
      toast.error('Feil ved sletting av banen: ' + error);
    }
  };

  if (isLoading) {
    return <div className="p-4">Laster baner...</div>;
  }

  if (!isAuthorized) {
    return <div className="p-4 text-red-600">Du har ikke tilgang til å administrere baner.</div>;
  }

  if (isCreating || selectedCourse) {
    return (
      <CourseForm
        course={selectedCourse}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    );
  }

  return (
    <div className="p-4 bg-white rounded-md shadow-md min-h-[100vh]">
      <h2 className="text-xl font-bold mb-4">Administrer baner</h2>
      <button
        onClick={handleCreateNew}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Lag ny bane
      </button>
      {courses.length === 0 ? (
        <p>Ingen baner tilgjengelig.</p>
      ) : (
        <ul className="space-y-2">
          {courses.map((course) => (
            <li
              key={course.id}
              className="flex justify-between items-center p-2 border rounded hover:bg-gray-100 cursor-pointer"
            >
              <span
                onClick={() => handleEditCourse(course)}
                className="flex-1"
              >
                {course.name} ({course.town})
              </span>
              <button
                onClick={() => handleDeleteCourse(course.id!)}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
              >
                Slett
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const CourseForm: React.FC<{
  course?: Course | null;
  onCancel?: () => void;
  onSave?: (course: Course) => void;
}> = ({ course = null, onCancel, onSave }) => {
  const [name, setName] = useState(course?.name || '');
  const [location, setLocation] = useState(course?.location || '');
  const [town, setTown] = useState(course?.town || '');
  const [postCode, setPostCode] = useState(course?.postCode || '');
  const [url, setUrl] = useState(course?.url || '');
  const [latitude, setLatitude] = useState<number | ''>(course?.latitude || '');
  const [longitude, setLongitude] = useState<number | ''>(course?.longitude || '');
  const [difficulty, setDifficulty] = useState(course?.difficulty || 'Medium');
  const [familyFriendly, setFamilyFriendly] = useState(course?.familyFriendly || false);
  const [holes, setHoles] = useState<number | ''>(course?.holes || '');
  const [courseOwner, setCourseOwner] = useState(course?.courseOwner || '');
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const userRole = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Ingen tilgangstoken funnet');
        }

        // Sjekk autorisasjon
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/has-access`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.status === 200) {
          const data = await response.json();
          if (data.hasAccess) {
            setIsAuthorized(true);
            // Hent brukere kun for admin
            if (userRole === 'admin') {
              const usersRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users`, {
                headers: { Authorization: `Bearer ${accessToken}` },
              });
              if (!usersRes.ok) {
                console.error('Feil ved henting av brukere:', await usersRes.text());
                throw new Error(`Kunne ikke hente brukere: Status ${usersRes.status}`);
              }
              const usersData = await usersRes.json();
              console.log('Fetched users:', usersData); // Logg for debugging
              setUsers(Array.isArray(usersData) ? usersData.map((u: any) => ({ id: u._id || u.id, name: u.name })) : []);
            } else if (userRole === 'clubowner' && !course?.courseOwner) {
              // For klubb-eier, sett courseOwner til userId for nye baner
              setCourseOwner(userId || '');
            }
          } else {
            setIsAuthorized(false);
          }
        } else {
          setIsAuthorized(false);
          throw new Error('Autorisasjon feilet: Status ' + response.status);
        }
      } catch (error) {
        console.error('Error in checkAuthorization:', error);
        toast.error('Feil ved autorisasjonssjekk: ' + error);
        setIsAuthorized(false);
      }
    };

    checkAuthorization();
  }, [userRole, userId, course]);

  const handleSaveCourse = async () => {
    if (!name || !location || !town || !postCode || !difficulty || familyFriendly === undefined) {
      toast.error('Alle obligatoriske felter må fylles ut.');
      return;
    }

    const newCourse = {
      id: course?.id,
      name,
      location,
      town,
      postCode,
      difficulty,
      familyFriendly,
      latitude: latitude || undefined,
      longitude: longitude || undefined,
      url: url || undefined,
      holes: holes || undefined,
      courseOwner: userRole === 'admin' ? courseOwner : course?.courseOwner, // Allow admin to set courseOwner
    };

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course${course?.id ? `/${course.id}` : ''}`,
        {
          method: course?.id ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(newCourse),
        }
      );

      if (!response.ok) {
        throw new Error('Kunne ikke lagre banen.');
      }

      const saved = await response.json();
      toast.success('Banen ble lagret!');
      onSave?.(saved.data || saved);
    } catch (error) {
      toast.error('Feil ved lagring av banen: ' + error);
    }
  };

  if (!isAuthorized) {
    return <div className="p-4 text-red-600">Du har ikke tilgang til å administrere baner.</div>;
  }

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">{course ? 'Rediger bane' : 'Lag ny bane'}</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Navn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Lokasjon"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="By"
          value={town}
          onChange={(e) => setTown(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Postnummer"
          value={postCode}
          onChange={(e) => setPostCode(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value === '' ? '' : Number(e.target.value))}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value === '' ? '' : Number(e.target.value))}
          className="p-2 border rounded"
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="Easy">Lett</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Vanskelig</option>
        </select>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={familyFriendly}
            onChange={(e) => setFamilyFriendly(e.target.checked)}
          />
          <label>Familievennlig</label>
        </div>
        <input
          type="number"
          placeholder="Antall hull"
          value={holes}
          onChange={(e) => setHoles(e.target.value === '' ? '' : Number(e.target.value))}
          className="p-2 border rounded"
        />
        {userRole === 'admin' ? (
          <select
            value={courseOwner}
            onChange={(e) => setCourseOwner(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Velg eier</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        ) : (
          <div className="p-2 border rounded bg-gray-100">
            <label className="block text-sm text-gray-600">Eier</label>
            <span>{courseOwner ? users.find((u) => u.id === courseOwner)?.name || 'Ukjent' : 'Deg selv'}</span>
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleSaveCourse}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Lagre bane
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Avbryt
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateCourse;