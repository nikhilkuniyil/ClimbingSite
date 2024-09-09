"use client";

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchClimbs = async () => {
      try {
        // Ensure the user is available
        if (!user?.uid) {
          console.log('User not authenticated yet.');
          return;
        }

        const response = await fetch(`http://localhost:3001/climbs?userId=${user.uid}`);
        
        if (response.ok) {
          const data = await response.json();

          // Ensure that data is an array before setting it to state
          if (Array.isArray(data.data)) {
            setClimbs(data.data); // Access data field from response and set the climbs
          } else {
            console.error('Climbs data is not an array:', data);
          }
        } else {
          console.error('Failed to fetch climbs');
        }
      } catch (error) {
        console.error('Error fetching climbs:', error);
        setError('Error fetching climbs.');
      }
    };

    fetchClimbs();
  }, [user]); // Fetch climbs whenever the user changes

  // Handle form submission for adding a new climb
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!date || !peak || !location || elevation <= 0) {
      setError('Please fill in all required fields and ensure values are positive.');
      setLoading(false);
      return;
    }

    const newClimb = {
      id: uuidv4(),
      date,
      peak,
      location,
      elevation,
      miles,
      image,
      userId: user?.uid,
    };

    try {
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
      setClimbs([...climbs, addedClimb.data]); // Add the new climb to the state
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
        <div className="flex justify-end mt-4 mr-8">
          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none"
            onClick={() => setModalIsOpen(true)}
          >
            Add New Climb
          </button>
        </div>
  
        {/* Loop through climbs */}
        {Array.isArray(climbs) && climbs.length > 0 ? (
          climbs.map((climb) => {
            // Format date to 'Month Day, Year'
            const formattedDate = new Intl.DateTimeFormat('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }).format(new Date(climb.date));
  
            return (
              <div
                key={climb.id}
                className="bg-white shadow-md rounded-lg p-6 mb-6 mx-auto flex flex-col"
                style={{ width: '600px', height: '700px' }}
              >
                {/* Peak Title at the Top */}
                <h3 className="text-2xl font-semibold text-center text-black">{climb.peak}</h3>
                {/* Date and Location Below the Title */}
                <p className="text-gray-500 text-center mb-4">
                  {formattedDate} &bull; {climb.location}
                </p>
  
                {/* Metrics in the Middle */}
                <div className="flex justify-around mb-4">
                  <div className="text-center">
                    <p className="text-gray-600 font-medium">Elevation</p>
                    <p className="text-gray-800">{climb.elevation} ft</p>
                  </div>
                  {climb.miles && (
                    <div className="text-center">
                      <p className="text-gray-600 font-medium">Mileage</p>
                      <p className="text-gray-800">{climb.miles} miles</p>
                    </div>
                  )}
                </div>
  
                {/* Spacer to push the image to the bottom */}
                <div className="flex-grow"></div>
  
                {/* Image at the Bottom */}
                <img
                  src={climb.image}
                  alt={climb.location}
                  className="rounded-lg mt-auto w-full h-2/3 object-cover"
                />
  
                {/* Buttons */}
                <div className="flex justify-center mt-4">
                  <button
                    className="text-blue-600 hover:underline mr-4"
                    onClick={() => setSelectedClimb(climb)}
                  >
                    View Details
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDeleteClimb(climb.id)}
                  >
                    Delete Climb
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-600 text-center mt-4">No climbs available</p>
        )}
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