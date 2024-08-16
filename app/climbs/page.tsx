import NavBar from "../components/Navbar";

export default function ClimbsPage() {
    const climbs = [
      // Example climb data
      { id: 1, date: '2024-08-16', location: 'Mount Everest', elevation: 29029, image: '/images/everest.jpg' },
      { id: 2, date: '2024-07-20', location: 'Mount Kilimanjaro', elevation: 19341, image: '/images/kilimanjaro.jpg' },
      // Add more climbs...
    ];
  
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
                <button className="mt-4 text-blue-600 hover:underline">View Details</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  