export async function getCoordinates(peakName: string): Promise<{ lat: number; lng: number } | null> {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // stored API key in .env.local
    console.log('Fetching coordinates for:', peakName);
    
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        peakName.replace(/\s/g, "")
      )}&key=${apiKey}`
    );
  
    const data = await response.json();
    console.log('Geocoding response:', data); // Debugging output
  
    if (data.status === 'OK' && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      console.log('Coordinates found:', { lat, lng });
      return { lat, lng };
    }
  
    console.error('Geocoding failed:', data.status, data.error_message);
    return null;
  }
  