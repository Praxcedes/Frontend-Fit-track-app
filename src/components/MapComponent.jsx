import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// Fix for default marker icons not showing with React Leaflet 
import L from 'leaflet';

// Fix icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Mock friend data with coordinates (for demonstration)
const MOCK_FRIENDS_LOCATIONS = [
  { id: 1, name: "Max Stone", coords: [34.0522, -118.2437] }, // Los Angeles
  { id: 2, name: "Griselda Jack", coords: [34.00, -118.30] },
];

// Component to handle map centering/view updates
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const MapComponent = ({ height = 350 }) => {
  // Default center (e.g., Chicago)
  const DEFAULT_CENTER = [41.8781, -87.6298];
  const [userPosition, setUserPosition] = useState(DEFAULT_CENTER);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Attempt to get user's current position from the browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([position.coords.latitude, position.coords.longitude]);
          setIsLoading(false);
        },
        () => {
          // Fallback on error (user denied or timeout)
          setIsLoading(false);
          console.warn("Geolocation denied or unavailable, using default center.");
        }
      );
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div style={{ height, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#111', borderRadius: '10px' }}>
      <p style={{ color: '#888' }}>Loading Map...</p>
    </div>;
  }

  return (
    <MapContainer center={userPosition} zoom={13} scrollWheelZoom={false} style={{ height }}>
      <ChangeView center={userPosition} zoom={13} />
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User Location Marker */}
      <Marker position={userPosition}>
        <Popup>You are here (Approximate)</Popup>
      </Marker>

      {/* Friend Locations */}
      {MOCK_FRIENDS_LOCATIONS.map(friend => (
        <Marker key={friend.id} position={friend.coords}>
          <Popup>{friend.name} is nearby!</Popup>
        </Marker>
      ))}

    </MapContainer>
  );
};

export default MapComponent;