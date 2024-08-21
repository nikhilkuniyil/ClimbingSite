import React from 'react';

interface NavBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavBar({ isOpen, onClose }: NavBarProps) {
  return (
    <div className={`fixed top-0 left-0 w-64 bg-gray-900 h-full z-50 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-4 flex justify-between items-center text-white">
        <h1 className="text-lg font-bold">Climbing Tracker</h1>
        <button onClick={onClose} className="text-xl">&times;</button>
      </div>
      <ul className="text-white mt-4">
        <li><a href="/" className="block p-4 hover:bg-gray-700">Home</a></li>
        <li><a href="/climbs" className="block p-4 hover:bg-gray-700">My Climbs</a></li>
        <li><a href="/schedule" className="block p-4 hover:bg-gray-700">Schedule Expedition</a></li>
        <li><a href="/gallery" className="block p-4 hover:bg-gray-700">Gallery</a></li>
      </ul>
    </div>
  );
}
