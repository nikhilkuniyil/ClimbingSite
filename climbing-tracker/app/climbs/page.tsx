import { useState } from 'react';
import Modal from 'react-modal';
import NavBar from "../components/Navbar";

// Define the Climb interface if you haven't already
interface Climb {
  id: number;
  date: string;
  location: string;
  elevation: number;
  image: string;
  miles?: number;
}

export default function ClimbsPage() {
  const [climbs, setClimbs] = useState<Climb[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [elevation, setElevation] = useState(0);
  const [miles, setMiles] = useState(0);
  const [image, setImage] = useState('');

  // Open the modal
  const openModal = () => {
    setModalIsOpen(true);
  };

  // Close the modal and reset form fields
  const closeModal = () => {
    setDate('');           // Reset the date field
    setLocation('');       // Reset the location field
    setElevation(0);       // Reset the elevation field
    setMiles(0);           // Reset the miles field
    setImage('');          // Reset the image field
    setModalIsOpen(false); // Close the modal
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
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

    const newClimb = { date, location, elevation, miles, image };
  
    try {
      const res = await fetch('/api/climbs', {
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
      <NavBar />
      <div className="mt-16 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">My Climbs</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={openModal}
          >
            Add New Climb
          </button>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {climbs.map((climb) => (
            <div key={climb.id} className="bg-white shadow-md rounded-lg p-4">
              <img src={climb.image} alt={climb.location} className="rounded-lg mb-4"/>
              <h3 className="text-xl font-semibold">{climb.location}</h3>
              <p className="text-gray-600">{climb.date}</p>
              <p className="text-gray-600">{climb.elevation} ft</p>
              {climb.miles && <p className="text-gray-600">{climb.miles} miles</p>}
              <button className="mt-4 text-blue-600 hover:underline">View Details</button>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add New Climb"
        className="bg-white p-6 rounded-lg max-w-md mx-auto mt-20 shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-2xl font-bold mb-4">Add New Climb</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Elevation (ft)</label>
            <input
              type="number"
              value={elevation}
              onChange={(e) => setElevation(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Miles</label>
            <input
              type="number"
              step="0.01"
              value={miles}
              onChange={(e) => setMiles(parseFloat(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded mt-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-2"
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
              className={`bg-blue-600 text-white px-4 py-2 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Add Climb'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
