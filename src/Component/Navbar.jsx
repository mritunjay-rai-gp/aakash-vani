import React, { useState } from 'react';

export default function Navbar({ onSearch }) {
  const [inputCity, setInputCity] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = () => {
    if (inputCity.trim() !== '') {
      onSearch(inputCity.trim());
      setInputCity('');
      setMenuOpen(false); // close dropdown after search
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>AAkash Vani</h2>
      </div>

      {/* Hamburger icon on small screens */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <div className={`navbar-right ${menuOpen ? 'open' : ''}`}>
        <input
          type="text"
          placeholder="Search city..."
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input"
        />
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>
    </nav>
  );
}
