"use client";

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Signed in successfully:', user);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error.message);
    }
  };

  const handleCreateAccount = () => {
    router.push('/signup');
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password'); // Navigate to forgot password page
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
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mb-4"
      >
        Sign In
      </button>
      <button
        onClick={handleCreateAccount}
        className="text-blue-600 hover:underline mb-4"
      >
        Create Account
      </button>
      <button
        onClick={handleForgotPassword}
        className="text-blue-600 hover:underline"
      >
        Forgot Password?
      </button>
    </div>
  );
}
