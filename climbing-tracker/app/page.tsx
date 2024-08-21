"use client";

import { useState } from "react";
import NavBar from "./components/Navbar";

export default function HomePage() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar isOpen={isNavOpen} onClose={toggleNav} />

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-screen flex flex-col items-center justify-center text-white"
        style={{ backgroundImage: "url('/images/snowyMountain2.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 p-8 text-center">
          <h1 className="text-5xl font-extrabold mb-4">Welcome to Climbing Tracker</h1>
          <p className="text-2xl mb-6">
            Track your climbs, view your photos, and schedule new expeditions!
          </p>
          <button
            className="bg-blue-600 text-white py-3 px-6 rounded-full hover:bg-blue-700"
            onClick={toggleNav}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center mb-10">
            <h2 className="text-4xl font-semibold text-gray-900 mb-4">Discover New Trails</h2>
            <p className="text-lg text-gray-700">
              Explore the most beautiful and challenging peaks, all while keeping track of your progress. Join a community of climbers today.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <img src="/images/starryMountain.jpg" alt="Trail 1" className="w-full h-64 object-cover rounded-lg shadow-lg" />
            <img src="/images/green.jpg" alt="Trail 2" className="w-full h-64 object-cover rounded-lg shadow-lg" />
            <img src="/images/rocks.jpg" alt="Trail 3" className="w-full h-64 object-cover rounded-lg shadow-lg" />
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto text-center">
          &copy; 2024 Climbing Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
