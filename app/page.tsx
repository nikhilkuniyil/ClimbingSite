export default function HomePage() {
  return (
    <div>
      <nav className="bg-gray-900 bg-opacity-80 fixed top-0 w-full p-4 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-lg font-bold">
            Climbing Tracker
          </div>
          <ul className="flex space-x-4 text-white">
            <li><a href="/" className="hover:text-gray-300">Home</a></li>
            <li><a href="/climbs" className="hover:text-gray-300">My Climbs</a></li>
            <li><a href="/schedule" className="hover:text-gray-300">Schedule Expedition</a></li>
            <li><a href="/gallery" className="hover:text-gray-300">Gallery</a></li>
          </ul>
        </div>
      </nav>

      <div
        className="bg-cover bg-center h-screen flex flex-col items-center justify-center text-white"
        style={{ backgroundImage: "url('/images/homepageBackground.jpg')" }}
      >
        <div className="bg-black bg-opacity-50 p-8 rounded-lg text-center">
          <h1 className="text-5xl font-extrabold mb-4">Welcome to Climbing Tracker</h1>
          <p className="text-2xl">
            Track your climbs, view your photos, and schedule new expeditions!
          </p>
        </div>
      </div>
    </div>
  );
}
