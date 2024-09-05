"use client";

import { useState } from 'react';
import { useAuth } from '../lib/auth/AuthContext';
import Modal from 'react-modal';
import NavBar from '../components/Navbar';
import { v4 as uuidv4 } from 'uuid';

interface Climb {
  id: number;
  date: string;
  peak: string;
  location: string;
  elevation: number;
  image: string;
  miles?: number;
}

export default function ClimbsPage() {
  const [climbs, setClimbs] = useState<Climb[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'view'>('add');
  const [selectedClimb, setSelectedClimb] = useState<Climb | null>(null);

  const [date, setDate] = useState('');
  const [peak, setPeak] = useState('');
  const [location, setLocation] = useState('');
  const [elevation, setElevation] = useState(0);
  const [miles, setMiles] = useState(0);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  // Handle form submission for adding a new climb
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate inputs
    if (!date || !peak || !location || elevation <= 0) {
      setError('Please fill in all required fields and ensure values are positive.');
      setLoading(false);
      return;
    }

    const newClimb = {
      id: uuidv4(), // Unique ID
      date,
      peak,
      location,
      elevation,
      miles,
      image,
      userId: user?.uid, // Associate climb with the logged-in user
    };

    try {
      // POST request to your backend API to add a new climb
      const response = await fetch('http://localhost:3001/climbs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClimb),
      });

      if (!response.ok) {
        throw new Error('Failed to add climb');
      }

      const addedClimb = await response.json();
      setClimbs([...climbs, addedClimb.data]); // Update local state with the new climb
      setModalIsOpen(false);

      // Reset form fields
      setDate('');
      setPeak('');
      setLocation('');
      setElevation(0);
      setMiles(0);
      setImage('');
    } catch (err) {
      console.error(err);
      setError('Failed to add climb. Please try again.');
    } finally {
      setLoading(false);
    }
  };

   // Handle deletion of a climb
   const handleDeleteClimb = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3001/climbs/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setClimbs(climbs.filter((climb) => climb.id !== id));
      } else {
        console.error('Failed to delete the climb');
      }
    } catch (error) {
      console.error('Error deleting climb:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />
      <div className="container mx-auto p-4 mt-16">
        <div className="flex justify-end mb-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setModalIsOpen(true)}
          >
            Add New Climb
          </button>
        </div>

        {/* Loop through climbs, each card will be its own component on the page */}
        {climbs.map((climb) => (
          <div
            key={climb.id}
            className="bg-white shadow-md rounded-lg p-6 mb-6 mx-auto"
            style={{ width: '600px', height: '700px' }}
          >
            <img
              src={climb.image}
              alt={climb.location}
              className="rounded-lg mb-4 w-full h-2/3 object-cover"
            />
            <h3 className="text-xl font-semibold">{climb.peak}</h3>
            <p className="text-gray-600">{climb.location}</p>
            <p className="text-gray-600">{climb.date}</p>
            <p className="text-gray-600">{climb.elevation} ft</p>
            {climb.miles && <p className="text-gray-600">{climb.miles} miles</p>}
            <button
              className="mt-4 text-blue-600 hover:underline"
              onClick={() => setSelectedClimb(climb)}
            >
              View Details
            </button>

            <button
              className="mt-4 ml-4 text-red-600 hover:underline"
              onClick={() => handleDeleteClimb(climb.id)}
            >
              Delete Climb
            </button>
          </div>
        ))}
      </div>

      {/* Modal for Add/View Climb */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Add New Climb"
        className="bg-white p-6 rounded-lg max-w-md mx-auto mt-20 shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        {/* Form to Add New Climb */}
        <h2 className="text-2xl font-bold mb-4 text-black">Add New Climb</h2>
        {error && <p className="text-red-600">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-2 text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-black">Peak</label>
            <input
              type="text"
              value={peak}
              onChange={(e) => setPeak(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-2 text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-black">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-2 text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-black">Elevation (ft)</label>
            <input
              type="number"
              value={elevation}
              onChange={(e) => setElevation(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded mt-2 text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-black">Miles</label>
            <input
              type="number"
              step="0.01"
              value={miles}
              onChange={(e) => setMiles(parseFloat(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded mt-2 text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-black">Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-2 text-black"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setModalIsOpen(false)}
              className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Climb'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
