'use client';

/**
 * @author Andreas Nilsen
 * @description Line: 10-42, Tailwind CSS has been assisted by Copilot. I wrote it myself but asked how to style in Tailwind.  
 */

const Register = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-80">
        <h1 className="text-xl font-bold mb-4">Registrer deg</h1>
        <label htmlFor="username" className="block text-gray-700 mb-2">
          Brukernavn
        </label>
        <input
          type="text"
          id="username"
          className="border p-2 w-full mb-4 rounded"
          placeholder="Skriv inn brukernavn"
        />
        <label htmlFor="email" className="block text-gray-700 mb-2">
          E-post
        </label>
        <input
          type="email"
          id="email"
          className="border p-2 w-full mb-4 rounded"
          placeholder="Skriv inn e-post"
        />
        <label htmlFor="password" className="block text-gray-700 mb-2">
          Passord
        </label>
        <input
          type="password"
          id="password"
          className="border p-2 w-full mb-4 rounded"
          placeholder="Velg et passord"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600"
        >
          Registrer
        </button>
      </form>
    </div>
  );
};
export default Register;
