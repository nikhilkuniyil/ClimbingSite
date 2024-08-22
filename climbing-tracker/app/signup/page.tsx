// pages/signup/page.tsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../lib/firebase";

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async () => {
    setError(null);
    setSuccess(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Account created successfully:', user);
      setSuccess('Account created successfully!');
      // You can redirect the user or update the UI as needed here
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error creating account:', error);
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-black">Create an Account</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}
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
        onClick={handleSignUp}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Sign Up
      </button>
    </div>
  );
}
