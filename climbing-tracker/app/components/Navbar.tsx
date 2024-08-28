// components/NavBar.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function NavBar() {
  const { user } = useAuth(); // Get user from context
  const router = useRouter();

  // Handle log out
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      router.push('/'); // Redirect to the home page
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-gray-900 text-white fixed top-0 w-full p-4 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">Climbing Tracker</div>
        <ul className="flex space-x-4 text-white">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/climbs">My Climbs</Link></li>
          <li><Link href="/schedule">Schedule Expedition</Link></li>
          <li><Link href="/gallery">Gallery</Link></li>
          {user ? (
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Log Out
              </button>
            </li>
          ) : (
            <li><Link href="/signin">Sign In</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}
