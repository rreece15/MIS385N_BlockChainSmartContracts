// Sidebar.js
import React, { useState } from 'react';
import '../styling/Sidebar.css'; // Importing the CSS for styling

import TokenCreator from './createMedia';

const Sidebar = () => {
  const [searchToken, setSearchToken] = useState('');
  const [searchOwner, setSearchOwner] = useState('');
  const [filter, setFilter] = useState('');

  const handleSearchTokenChange = (e) => {
    setSearchToken(e.target.value);
    // Implement search token logic here
  };

  const handleSearchOwnerChange = (e) => {
    setSearchOwner(e.target.value);
    // Implement search owner logic here
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    // Implement filter logic here
  };

  return (
    <div className="sidebar">
      <div className="content-switch">
        {/* Assuming you have a toggle switch component */}
        <label>My Content</label>
        <input type="checkbox" id="contentToggle" />
      </div>
      <div className="search">
        {
          <TokenCreator />
          /* <input
          type="text"
          placeholder="Token ID"
          value={searchToken}
          onChange={handleSearchTokenChange}
        />
        <input
          type="text"
          placeholder="Owner Wallet Address"
          value={searchOwner}
          onChange={handleSearchOwnerChange}
        /> */}
      </div>
      <div className="filters">
        <div className="filter-section">
          <h5>Type</h5>
          <button onClick={() => setFilter('type')}>+</button>
        </div>
        <div className="filter-section">
          <h5>Filters</h5>
          <button onClick={() => setFilter('filters')}>-</button>
          <input type="search" placeholder="Search..." onChange={handleFilterChange} />
          <div className="filter-options">
            <label>
              <input type="checkbox" /> Recently Added
            </label>
            <label>
              <input type="checkbox" /> Movie Tickets
            </label>
            {/* ... other filter options ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
