"use client";

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from  '../lib/firebase'; // Adjust the path as needed
import { useRouter } from 'next/navigation';


export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Signed in successfully:', user);
      router.push('/dashboard'); // You can redirect the user or update the UI as needed here
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-black">Sign In</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="mb-4 p-2 border border-gray-300 rounded w-64"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="mb-4 p-2 border border-gray-300 rounded w-64"
      />
      <button
        onClick={handleSignIn}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Sign In
      </button>
    </div>
  );
}
