import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Forecast.css';

export default function Forecast({ city }) {
  const [forecastData, setForecastData] = useState([]);
  const [cityName, setCityName] = useState('');
  const apiKey = "64308156314090100edff979e22bf2d9";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );
        setForecastData(res.data.list);
        setCityName(res.data.city.name);
      } catch (err) {
        console.error("Forecast API error:", err);
      }
    };

    if (city) fetchData();
  }, [city]);

  const formatHour = (dt_txt) => {
    const date = new Date(dt_txt);
    return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
  };

  const groupByDay = () => {
    const grouped = {};
    forecastData.forEach(item => {
      const date = new Date(item.dt_txt).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric"
      });
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });
    return grouped;
  };

  const dailyData = Object.entries(groupByDay()).slice(0, 7);

  return (
    <div className="forecast-container-horizontal">

      {/* Hourly */}
      <div className="hourly-forecast">
       <h1 className="forecast-title">Weather Forecast for {cityName}</h1>
        <div className="hourly-scroll">
          {forecastData.slice(0, 8).map((item, i) => (
            <div key={i} className="hour-card">
              <div className="hour">{formatHour(item.dt_txt)}</div>
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt="icon"
                className="weather-icon"
              />
              <div className="temp">{Math.round(item.main.temp)}°C</div>
              <div className="desc">{item.weather[0].description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily */}
      <div className="daily-forecast">
        <h2>7-Day Forecast</h2>
        <div className="daily-list">
          {dailyData.map(([date, items], i) => {
            const temps = items.map(item => item.main.temp);
            const min = Math.min(...temps);
            const max = Math.max(...temps);
            const icon = items[0].weather[0].icon;
            const desc = items[0].weather[0].description;

            return (
              <div key={i} className="daily-item">
                <div className="daily-date">{date}</div>
                <img
                  src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                  alt="icon"
                  className="weather-icon"
                />
                <div className="daily-temp">{Math.round(max)} / {Math.round(min)}°C</div>
                <div className="daily-desc">{desc}</div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

