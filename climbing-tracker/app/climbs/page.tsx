import { useEffect, useState } from 'react';
import NavBar from "../components/Navbar";

interface Climb {
  id: number;
  date: string;
  location: string;
  elevation: number;
  image: string;
  miles?: number; // Add miles as optional if it's not always present
}

export default function ClimbsPage() {
    // State to hold climbs fetched from the backend
    const [climbs, setClimbs] = useState<Climb[]>([]);

    // Fetch climbs from the backend when the component mounts
    useEffect(() => {
        fetch('/api/climbs')
            .then(response => response.json())
            .then(data => setClimbs(data.data))
            .catch(error => console.error('Error fetching climbs:', error));
    }, []);

    return (
      <div>
        <NavBar />
        <div className="mt-16 p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">My Climbs</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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
                <p className="text-gray-600">{climb.miles} miles</p>
                <button className="mt-4 text-blue-600 hover:underline">View Details</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}
