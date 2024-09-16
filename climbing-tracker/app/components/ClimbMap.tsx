// components/Map.tsx

"use client";

import { useLoadScript, Libraries, GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import React from 'react';

const libraries: Libraries = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 37.7749, // Default center location, can be changed dynamically
  lng: -122.4194,
};

const options = {
  disableDefaultUI: true, // Hide default UI elements for a cleaner look
  zoomControl: true,
};

// LatLngLiteral definition if it's not being picked up properly
type LatLngLiteral = {
  lat: number;
  lng: number;
};

// Define the props interface for the Map component
interface MapProps {
  lat: number;
  lng: number;
  trailPath?: LatLngLiteral[] | null; // Optional prop
}

const ClimbMap: React.FC<MapProps> = ({ lat, lng, trailPath }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string, // environment variable for API key
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '400px' }}
      center={{ lat, lng }}
      zoom={12}
      options={{ disableDefaultUI: true, zoomControl: true }}
    >
      {/* Marker for the peak */}
      <Marker position={{ lat, lng }} />

      {/* Polyline to show trail */}
      {trailPath && <Polyline path={trailPath} options={{ strokeColor: '#FF0000' }} />}
    </GoogleMap>
  );
};

export default ClimbMap;