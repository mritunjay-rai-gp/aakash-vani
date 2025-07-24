import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Navbar from './Component/Navbar';
import Forecast from './Component/Forecast';
import CurrentWeather from './Component/Currentweather';

function App() {
  const [city, setCity] = useState('Delhi');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_KEY = '64308156314090100edff979e22bf2d9';

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(res.data);
      setError(null); // Clear previous errors
    } catch (error) {
      console.error('City not found or API error:', error);
      setWeatherData(null);
      setError('City not found or API error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar onSearch={setCity} />

      {error && (
        <div style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <div className="spinner"></div>
          <p>Loading weather data...</p>
        </div>
      )}

      {weatherData && !loading && (
        <CurrentWeather weather={weatherData} city={city} />
      )}

      {!loading && <Forecast city={city} />}

    </>
  );
}

export default App;
