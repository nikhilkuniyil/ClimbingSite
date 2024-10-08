"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth/AuthContext';
import Modal from 'react-modal';
import NavBar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import ClimbMap from '../components/ClimbMap';
import { auth } from '../lib/firebase';
import { getCoordinates } from '../utils/geocoding';


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
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [climbToDelete, setClimbToDelete] = useState<Climb | null>(null);

  const [date, setDate] = useState('');
  const [peak, setPeak] = useState('');
  const [location, setLocation] = useState('');
  const [elevation, setElevation] = useState(0);
  const [miles, setMiles] = useState(0);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMapVisible, setIsMapVisible] = useState(false); // State for map visibility
  const [mapLat, setMapLat] = useState(37.7749); // Default map lat
  const [mapLng, setMapLng] = useState(-122.4194); // Default map lng
  const [trailPath, setTrailPath] = useState<google.maps.LatLngLiteral[] | null>(null);


  const { user } = useAuth();
  const router = useRouter();


  // Add useEffect hooks here
  useEffect(() => {
    console.log('isMapVisible:', isMapVisible);
  }, [isMapVisible]);

  useEffect(() => {
    console.log('modalIsOpen:', modalIsOpen);
  }, [modalIsOpen]);

  useEffect(() => {
    console.log('deleteModalIsOpen:', deleteModalIsOpen);
  }, [deleteModalIsOpen]);

  useEffect(() => {
    // redirect user to sign-in page if they are not logged in
    if (!user) {
      router.push('/signin');
      return;
    }

    const fetchClimbs = async () => {
      try {
        const currentUser = auth.currentUser; // Get the currently authenticated user
        if (currentUser) {
          const idToken = await currentUser.getIdToken(); // Fetch the user's ID token
          console.log('ID Token:', idToken);

          const response = await fetch(`http://localhost:3001/climbs?userId=${currentUser.uid}`, {
            headers: {
              Authorization: `Bearer ${idToken}`, // Include the ID token in the request header
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();
          console.log('Fetched climbs data:', data);
          if (Array.isArray(data.data)) {
            setClimbs(data.data); // Set the climbs data
          } else {
            console.error('Climbs data is not an array:', data);
          }
        } else {
          console.log('No authenticated user.');
        }
      } catch (error) {
        console.error('Error fetching climbs:', error);
      }
    };

    fetchClimbs();
  }, [user]);

  const loadMapDetails = async (peakName: string) => {
    try{
      console.log('Loading map details for:', peakName);
    const coordinates = await getCoordinates(peakName);
    if (coordinates) {
      setMapLat(coordinates.lat);
      setMapLng(coordinates.lng);
      console.log('Coordinates set:', coordinates);
      
      // Optionally, load a trail path 
      // const trail = [
      //   { lat: coordinates.lat, lng: coordinates.lng - 0.01 },
      //   { lat: coordinates.lat + 0.01, lng: coordinates.lng },
      //   { lat: coordinates.lat + 0.02, lng: coordinates.lng + 0.01 },
      // ];
      // setTrailPath(trail); // Set the trail path
      // console.log('Trail path set:', trail);
  
      setIsMapVisible(true); // Show the map and hide the image
      console.log('Map visibility set to true');
    }
  } catch (error) {
    console.error('Error loading map details:', error);
  }
};

{/*
  // Function to revert back to the image view
  const showImage = () => {
    setIsMapVisible(false); // Hide the map and show the image
*/}

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
    if (!climbToDelete) return;

    try {
      const res = await fetch(`http://localhost:3001/climbs/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setClimbs(climbs.filter((climb) => climb.id !== id));
        setDeleteModalIsOpen(false); // Close the modal on success
        setClimbToDelete(null);
      } else {
        console.error('Failed to delete the climb');
      }
    } catch (error) {
      console.error('Error deleting climb:', error);
    }
  };

  const confirmDeleteClimb = (climb: Climb) => {
    setClimbToDelete(climb); // Set the climb to delete
    setDeleteModalIsOpen(true); // Open the delete confirmation modal
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
            const formattedDate = new Intl.DateTimeFormat('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }).format(new Date(climb.date));

            return (
              <div
                key={climb.id}
                className="bg-white shadow-md rounded-lg p-6 mb-6 mx-auto flex flex-col relative"
                style={{ width: '600px', height: '700px' }}
              >
                <h3 className="text-2xl font-semibold text-center text-black">{climb.peak}</h3>
                <p className="text-gray-500 text-center mb-4">
                  {formattedDate} &bull; {climb.location}
                </p>

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

                {/* Image and Map Sliders */}
                <div className="relative h-2/3 overflow-hidden">
                  <div
                    className={`absolute inset-0 transition-transform duration-500 ${isMapVisible ? '-translate-x-full' : 'translate-x-0'}`}
                    style={{ width: '100%' }}
                  >
                    <img src={climb.image} alt={climb.location} className="rounded-lg w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full cursor-pointer" onClick={() => loadMapDetails(climb.peak)}>
                      View on Map
                    </div>
                  </div>

                  {/* Map */}
                  <div
                    className={`absolute inset-0 transition-transform duration-500 ${isMapVisible ? 'translate-x-0' : 'translate-x-full'}`}
                    style={{ width: '100%' }}
                  >
                    <ClimbMap lat={mapLat} lng={mapLng} trailPath={trailPath} />
                        {/*
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full cursor-pointer" onClick={showImage}>
                      Back to Image
                    </div>
                        */}
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <button className="text-blue-600 hover:underline mr-4" onClick={() => setSelectedClimb(climb)}>
                    View Details
                  </button>
                  <button className="text-red-600 hover:underline" onClick={() => confirmDeleteClimb(climb)}>
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
            <button type="button" onClick={() => setModalIsOpen(false)} className="bg-gray-300 text-black px-4 py-2 rounded mr-2">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={loading}>
              {loading ? 'Adding...' : 'Add Climb'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={() => setDeleteModalIsOpen(false)}
        contentLabel="Confirm Delete Climb"
        className="bg-white p-6 rounded-lg max-w-md mx-auto mt-20 shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-2xl font-bold mb-4 text-black">Confirm Delete</h2>
        <p>Are you sure you want to delete this climb?</p>
        <div className="flex justify-end mt-4">
          <button className="bg-gray-300 text-black px-4 py-2 rounded mr-2" onClick={() => setDeleteModalIsOpen(false)}>
            Cancel
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => {
            if (climbToDelete) {
              handleDeleteClimb(climbToDelete.id);
            }
          }}>
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
//}