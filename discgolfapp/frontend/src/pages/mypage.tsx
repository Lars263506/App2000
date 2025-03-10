import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import User from "../types/user";

const MyPage = () => {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken')
        const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/users/me"
        const res = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });
        if (!res.ok) throw new Error("Could not find user");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Could not find user information:", error);
      }
    };

    fetchUser();
  }, []);

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
      <div className="max-w-10xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-900">Min Side</h1>
        <div className="mt-6">
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


        <button
          onClick={() => router.push("/")}
          className="mt-8 px-6 py-3text-lg font-semibold rounded hover:bg-gray-400"
        >
          Forside
        </button>
      </div>
    </div>
  );
};

export default MyPage;
