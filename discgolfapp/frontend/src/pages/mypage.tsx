import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import User from "../types/user";

const MyPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);  // To store the image file itself
  const router = useRouter();

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
          const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/profileImage/${data.displayName}`;
          setProfileImage(imageUrl);
        }
      } catch (error) {
        console.error("Could not find user information:", error);
      }
    };

    fetchUser();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setProfileImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfileImage = async () => {
    if (!imageFile || !user) return;
    try {
      const formData = new FormData();
      formData.append('profileImage', imageFile);
      formData.append('displayName', user.displayName); // Send displayName i stedet for userId
  
      const accessToken = localStorage.getItem('accessToken');
      const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/users/updateProfileImage"; 
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
        body: formData,
      });
  
      if (!res.ok) throw new Error("Could not update profile image");
      const data = await res.json();
      setProfileImage(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/profileImage/${user.displayName}`);
      alert("Profilbildet ble oppdatert!");
    } catch (error) {
      console.error("Error updating profile image:", error);
    }
  };  

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg">Du er ikke logget inn. Vennligst logg inn først.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded hover:bg-blue-700"
        >
          Logg inn
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-10xl mx-auto bg-white p-6 rounded-lg shadow-lg flex">
        {/* Venstre side - Brukerinformasjon */}
        <div className="w-1/3 flex flex-col">
          <h1 className="text-4xl font-extrabold text-gray-800 mt-4">
            Velkommen til din side, {user.displayName ?? "Ukjent"}!
          </h1>
          <div className="mt-16">
            <p className="text-lg text-gray-800">
              <strong>Brukernavn:</strong> {user.displayName ?? "Ukjent"}
            </p>
            <p className="text-lg text-gray-800">
              <strong>E-post:</strong> {user.email ?? "Ukjent"}
            </p>
            <p className="text-lg text-gray-800">
              <strong>Rolle:</strong> {user.role ?? "Ukjent"}
            </p>
          </div>
  
          {/* Forside-knapp på bunnen av brukerinfo */}
          <button
            onClick={() => router.push("/")}
            className="mt-8 py-1 w-32 text-black text-lg font-semibold rounded hover:bg-gray-400"
          >
            Forside
          </button>
        </div>
  
        {/* Høyre side - Profilbilde */}
        <div className="w-2/3 flex flex-col items-center justify-center">
          {profileImage ? (
            <img src={profileImage} alt="Profilbilde" className="w-52 h-52 rounded-full object-cover mb-4" />
          ) : (
            <div className="w-52 h-52 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
              <span className="text-black">Ingen bilde</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4 ml-28 text-black"
          />
          <button
            onClick={handleSaveProfileImage}
            className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded hover:bg-blue-700"
          >
            Lagre profilbilde
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
