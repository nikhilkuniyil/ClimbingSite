"use client";

import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';

export default function SignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('Signed out successfully');
      router.push('/signin'); // Redirect to sign-in page after signing out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button onClick={handleSignOut} className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">
      Sign Out
    </button>
  );
}
