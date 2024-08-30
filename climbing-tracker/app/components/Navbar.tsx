"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/auth/AuthContext'; // Adjust path if necessary
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface NavBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavBar() {
  const { user } = useAuth(); // Get user from context
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown

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
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-xl font-bold mr-4">Climbing Tracker</h1>
        <ul className="flex space-x-4">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/climbs">My Climbs</Link></li>
          <li><Link href="/schedule">Schedule Expedition</Link></li>
          <li><Link href="/gallery">Gallery</Link></li>
        </ul>
      </div>

      {/* User profile dropdown */}
      <div className="relative">
        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5c4.694 0 8.5 3.806 8.5 8.5s-3.806 8.5-8.5 8.5-8.5-3.806-8.5-8.5 3.806-8.5 8.5-8.5zM15 12.75L9 18m0-5.25l-3 3M21 12l-1.5-1.5m-6 6l1.5-1.5M15 9l3 3m0 0l1.5-1.5" />
          </svg>
        </button>
        
        {/* Dropdown menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
            <Link legacyBehavior href="/user-profile">
              <a className="block px-4 py-2 text-sm hover:bg-gray-200">Profile</a>
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
