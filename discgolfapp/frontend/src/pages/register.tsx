import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

/**
 * @author Adrijoh and Lars263506 (GitHub)
 * @returns Sign up form for new users
 */

const Register = () => {
  const [locked, setLocked] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    if (locked)
      return;

    setLocked(true);
    const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/users/';

    event.preventDefault();
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName,
          email,
          password,
        }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error: Error | any) {
      toast.error(error.message);
    } finally {
      setLocked(false);
      setDisplayName('');
      setEmail('');
      setPassword('');
      toast.success('Brukeren ble opprettet!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div className="flex flex-col">
      <input
        type="text"
        className="border p-2 rounded"
        placeholder="Skriv inn et kallenavn"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      </div>
      <div className="flex flex-col">
      <input
        type="email"
        className="border p-2 rounded"
        placeholder="Skriv inn e-post"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      </div>
      <div className="flex flex-col">
      <input
        type="password"
        className="border p-2 rounded"
        placeholder="Velg et passord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      </div>
      <button
      type="submit"
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
      Registrer
      </button>
      <ToastContainer />
    </form>
  );
};

export default Register;