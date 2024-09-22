import { useSession, signIn } from 'next-auth/react';
import { addEventToGoogleCalendar } from '../lib/calendar';
import { useState } from 'react';

function SchedulePage() {
  const { data: session } = useSession();
  const [climbDetails, setClimbDetails] = useState({
    peak: '',
    location: '',
    date: '',
    time: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClimbDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleScheduleClick = async () => {
    if (!session) {
      signIn('google');
    } else if (session.accessToken) {
      // Only proceed if accessToken is defined
      try {
        await addEventToGoogleCalendar(session.accessToken, climbDetails); // event added to Google Calendar
        alert('Climb added to Google Calendar!');
      } catch (error) {
        alert('Failed to add event to Google Calendar');
      }
    } else {
      alert('No access token found. Please sign in again.');
    }
  };
  

  return (
    <div className="container mx-auto p-4 mt-16">
      <h1 className="text-2xl font-bold mb-4">Schedule a Climb</h1>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          name="peak"
          placeholder="Peak"
          value={climbDetails.peak}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={climbDetails.location}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="date"
          placeholder="Date"
          value={climbDetails.date}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          type="time"
          name="time"
          placeholder="Time"
          value={climbDetails.time}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleScheduleClick}
        >
          Schedule Climb
        </button>
      </div>
    </div>
  );
}

export default SchedulePage;