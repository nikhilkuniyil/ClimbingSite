"use client";

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase'; // Adjust the import path based on your project structure

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Please check your inbox.');
      setError(null); // Clear any previous errors
    } catch (error: any) {
      setError('Error sending password reset email. Please try again.');
      setMessage(null); // Clear any previous success messages
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-black">Forgot Password</h1>
      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="mb-4 p-2 border border-gray-300 rounded w-64"
      />
      <button
        onClick={handlePasswordReset}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Reset Password
      </button>
    </div>
  );
}
