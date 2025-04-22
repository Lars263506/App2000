import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Course from '@/types/course'; 

interface CourseFormProps {
  course?: Course | null;
  onCancel?: () => void;
  onSave?: (course: Course) => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ course = null, onCancel, onSave }) => {
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

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/has-access`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.status === 200) {
          const data = await response.json();
          if (data.hasAccess) {
            setIsAuthorized(true);
            if (userRole === 'clubowner' && !course?.courseOwner) {
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
      courseOwner 
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

      if (response.status !== 200 && response.status !== 201) {
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
        <input
            type="text"
            placeholder="Eier"
            value={courseOwner}
            onChange={(e) => setCourseOwner(e.target.value)}
            className="p-2 border rounded"
        /> 
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

export default CourseForm;