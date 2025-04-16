import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CreateCourse: React.FC = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [town, setTown] = useState('');
  const [postCode, setPostCode] = useState('');
  const [url, setUrl] = useState('');
  const [latitude, setLatitude] = useState<number | ''>('');
  const [longitude, setLongitude] = useState<number | ''>('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [familyFriendly, setFamilyFriendly] = useState(false);
  const [holes, setHoles] = useState<number | ''>('');
  const [courseOwner, setCourseOwner] = useState('');
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/has-access`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        toast.error('Feil ved autorisasjonssjekk: ' + error);
        setIsAuthorized(false);
      }
    };

    checkAuthorization();
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      const fetchUsers = async () => {
        try {
          const accessToken = localStorage.getItem('accessToken');
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          toast.error('Feil ved henting av brukere: ' + error);
        }
      };
      fetchUsers();
    }
  }, [isAuthorized]);

  const handleSaveCourse = async () => {
    if (!name || !location || !town || !postCode || !url || !holes || !courseOwner) {
      toast.error('Alle obligatoriske felter må fylles ut.');
      return;
    }

    const newCourse = {
      name,
      location,
      town,
      postCode,
      url,
      latitude: latitude || undefined,
      longitude: longitude || undefined,
      difficulty,
      familyFriendly,
      holes,
      courseOwner,
    };

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newCourse),
      });

      if (response.status !== 201) {
        throw new Error('Kunne ikke lagre banen.');
      }

      toast.success('Banen ble lagret!');
      setName('');
      setLocation('');
      setTown('');
      setPostCode('');
      setUrl('');
      setLatitude('');
      setLongitude('');
      setDifficulty('Medium');
      setFamilyFriendly(false);
      setHoles('');
      setCourseOwner('');
    } catch (error) {
      toast.error('Feil ved lagring av banen: ' + error);
    }
  };

  if (!isAuthorized) {
    return <div>Du har ikke tilgang til denne siden.</div>;
  }

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Opprett eller rediger bane</h2>
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
          onChange={(e) => setLatitude(Number(e.target.value))}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(Number(e.target.value))}
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
          onChange={(e) => setHoles(Number(e.target.value))}
          className="p-2 border rounded"
        />
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
      </div>
      <button
        onClick={handleSaveCourse}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Lagre bane
      </button>
    </div>
  );
};

export default CreateCourse;
