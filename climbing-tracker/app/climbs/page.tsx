"use client";

import { useState } from 'react';
import { useAuth } from '../lib/auth/AuthContext';
import Modal from 'react-modal';
import NavBar from '../components/Navbar';

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

  const { user } = useAuth();

  // Open the modal for adding a new climb
  const openAddModal = () => {
    setModalMode('add');
    setModalIsOpen(true);
  };

  // Open the modal for viewing climb details
  const openViewModal = (climb: Climb) => {
    setSelectedClimb(climb);
    setModalMode('view');
    setModalIsOpen(true);
  };

  // Close the modal and reset form fields
  const closeModal = () => {
    setDate('');
    setPeak('');
    setLocation('');
    setElevation(0);
    setMiles(0);
    setImage('');
    setSelectedClimb(null);
    setModalIsOpen(false);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission for adding a new climb
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (elevation <= 0) {
      alert('Elevation must be greater than 0');
      return;
    }

    if (miles < 0) {
      alert('Miles cannot be negative');
      return;
    }

    const newClimb = { date, peak, location, elevation, miles, image, userID: user?.uid };

    try {
      const res = await fetch('http://localhost:3001/climbs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClimb),
      });

      if (res.ok) {
        const addedClimb = await res.json(); // Get the response from the server, which should include the id
        setClimbs([...climbs, addedClimb.data]); // Include the full climb object with the id
        closeModal();
      } else {
        console.error('Failed to add climb');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Display NavBar always at the top */}
      <NavBar />

      {/* Main Content */}
      <div className="mt-16 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">My Climbs</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={openAddModal}
          >
            Add New Climb
          </button>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {climbs.map((climb) => (
            <div key={climb.id} className="bg-white shadow-md rounded-lg p-4">
              <img src={climb.image} alt={climb.location} className="rounded-lg mb-4" />
              <h3 className="text-xl font-semibold text-black">{climb.peak}</h3>
              <p className="text-gray-600">{climb.location}</p>
              <p className="text-gray-600">{climb.date}</p>
              <p className="text-gray-600">{climb.elevation} ft</p>
              {climb.miles && <p className="text-gray-600">{climb.miles} miles</p>}
              <button
                className="mt-4 text-blue-600 hover:underline"
                onClick={() => openViewModal(climb)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Add/View Climb */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel={modalMode === 'add' ? "Add New Climb" : "View Climb Details"}
        className="bg-white p-6 rounded-lg max-w-md mx-auto mt-20 shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        {modalMode === 'add' ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-black">Add New Climb</h2>
            <form onSubmit={handleSubmit}>
              {/* Add the form fields here */}
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
                  onClick={closeModal}
                  className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Climb
                </button>
              </div>
            </form>
          </>
        ) : (
          selectedClimb && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-black">View Climb Details</h2>
              <img src={selectedClimb.image} alt={selectedClimb.peak} className="rounded-lg mb-4" />
              <p className="text-gray-600">Date: {selectedClimb.date}</p>
              <p className="text-gray-600">Peak: {selectedClimb.peak}</p>
              <p className="text-gray-600">Location: {selectedClimb.location}</p>
              <p className="text-gray-600">Elevation: {selectedClimb.elevation} ft</p>
              {selectedClimb.miles && <p className="text-gray-600">Miles: {selectedClimb.miles}</p>}
              <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={closeModal}
              >
                Close
              </button>
            </>
          )
        )}
      </Modal>
    </div>
  );
}
