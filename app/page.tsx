import NavBar from "./components/Navbar";

export default function HomePage() {
  return (
    <div>
      <NavBar />
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
