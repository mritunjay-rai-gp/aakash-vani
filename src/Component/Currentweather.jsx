import React from 'react';
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
function MapUpdater({ lat, lon }) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.setView([lat, lon], 10);
    }
  }, [lat, lon, map]);

  return null;
}

export default function CurrentWeather({ weather, city }) {
  if (!weather || !weather.main || !weather.coord || !weather.weather || !weather.weather[0]) return null;

  const {
    temp,
    feels_like,
    humidity,
    pressure,
    temp_min,
    temp_max,
  } = weather.main;

  const { description } = weather.weather[0];
  const { speed, deg } = weather.wind || {};
  const visibility = weather.visibility ? (weather.visibility / 1000).toFixed(1) : 'N/A';
  const { lat, lon } = weather.coord;

  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '2rem',
      padding: '2rem',
    }}>
      
      {/* Weather Card */}
      <div style={{
        backgroundColor: '#f9f9f9',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        padding: '2rem',
        maxWidth: '450px',
        width: '100%',
        flex: '1',
      }}>
        <h2 style={{ margin: '0 0 10px' }}>{city}</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>{new Date().toLocaleString()}</p>

        <h1 style={{ fontSize: '3rem', margin: 0 }}>{Math.round(temp)}°C</h1>
        <p style={{ marginTop: '10px' }}>Feels like {Math.round(feels_like)}°C, {description}</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginTop: '1rem',
          fontSize: '15px',
        }}>
          <div><strong>Humidity:</strong> {humidity}%</div>
          <div><strong>Pressure:</strong> {pressure} hPa</div>
          <div><strong>Wind:</strong> {speed} m/s ({getWindDirection(deg)})</div>
          <div><strong>Visibility:</strong> {visibility} km</div>
          <div><strong>Min Temp:</strong> {Math.round(temp_min)}°C</div>
          <div><strong>Max Temp:</strong> {Math.round(temp_max)}°C</div>
        </div>
      </div>

      {/* Map */}
      <div style={{
        flex: '1',
        minWidth: '300px',
        maxWidth: '600px',
        height: '300px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}>
        <MapContainer
  center={[lat, lon]}
  zoom={10}
  scrollWheelZoom={false}
  style={{ height: '100%', width: '100%' }}
  key={`${lat}-${lon}`}  // Optional: ensures re-render
>
  <MapUpdater lat={lat} lon={lon} />

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lon]}>
            <Popup>{city}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}


