import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PencilIcon } from '@heroicons/react/20/solid'

import User from "../../types/user";

interface MyPageProps {
    setSelectedPage: (page: string) => void;
}

const MyPage: React.FC<MyPageProps> = ({ setSelectedPage }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [clubs, setClubs] = useState<any[]>([]);

  // Henter brukerdata
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/users/me";
        const res = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });
        if (!res.ok) throw new Error("Could not find user");
        const data = await res.json();
        setUser(data);

        if (data.displayName) {
          const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/profile-image/${data.profileImage}`;
          setProfileImage(imageUrl);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  // Henter klubbene som brukeren er medlem av
  useEffect(() => {
    const fetchClubs = async () => {
      if (!user) return;

      try {
        const accessToken = localStorage.getItem('accessToken');
        const clubsUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/users/my-clubs";
        const clubsRes = await fetch(clubsUrl, {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });
        if (clubsRes.status !== 200) throw new Error("Could not fetch clubs");
        const clubsData = await clubsRes.json();
        setClubs(clubsData);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };

    fetchClubs();
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setProfileImage(imageUrl);

        handleSaveProfileImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfileImage = async (file: File) => {
    if (!file || !user) return;
    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      const accessToken = localStorage.getItem('accessToken');
      const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/update-profile-image`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await res.json();
      toast.success("Bilde er lagret!");
      setProfileImage(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/profile-image/${data.profileImage}`);
    } catch (error) {
      console.error("Error updating profile image:", error);
    }
  };

  const handleClubClick = (clubId: string) => {
    localStorage.setItem("selectedClub", clubId);
    setSelectedPage("ClubPage");
  };


  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg">Du er ikke logget inn. Vennligst logg inn først.</p>
        <button
          onClick={() => setSelectedPage("Home")}
          className="mt-4 px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded hover:bg-blue-700"
        >
          Logg inn
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow bg-gray-100 p-8 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mt-6 text-gray-800">Min Side</h1>
        <h2 className="text-2xl text-gray-700 mb-8">Velkommen, {user.displayName ?? "Ukjent"}!</h2>

        {/* Profilbilde med redigeringsikon */}
        <div className="relative">
          {profileImage ? (
            <img src={profileImage} alt="Profilbilde" className="w-52 h-52 rounded-full object-cover mb-4" />
          ) : (
            <div className="w-52 h-52 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
              <span className="text-black">Ingen bilde</span>
            </div>
          )}

          {/* Skjult input for bildeopplasting */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="fileInput"
          />

          {/* Redigeringsikon - klikker på dette åpner filvelger */}
          <button
            onClick={() => document.getElementById("fileInput")?.click()}
            className="absolute bottom-3 right-4 bg-gray-800 p-2 rounded-full hover:bg-gray-600"
          >
            <PencilIcon className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Tre bokser */}
        <div className="grid grid-cols-1 md:grid-cols-3 text-black gap-4 mt-8 w-full max-w-4xl">
          {/* Brukerinformasjon */}
          <div className="bg-white p-6 rounded-lg shadow-lg max-h-80 overflow-y-auto">
            <h3 className="text-lg text-black mb-6 font-semibold">Brukerinformasjon:</h3>
            <p><strong>Brukernavn:</strong> {user.displayName ?? "Ukjent"}</p>
            <p><strong>E-post:</strong> {user.email ?? "Ukjent"}</p>
            <p><strong>Rolle:</strong> {user.role ?? "Ukjent"}</p>
          </div>
          {/* Tomme bokser */}
          <div className="text-lg bg-white p-6 rounded-lg shadow-lg font-semibold max-h-80 overflow-y-auto">Mine spill:</div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg text-black mb-6 font-semibold max-h-80 overflow-y-auto">Mine klubber:</h3>
              {clubs.length > 0 ? (
                <ul>
                  {clubs.map((club) => (
                    <li key={club._id} className="mb-2">
                      <button
                        onClick={() => handleClubClick(club._id)}
                        className="text-blue-500 hover:underline">
                        {club.name}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Du er ikke medlem av noen klubber.</p>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
