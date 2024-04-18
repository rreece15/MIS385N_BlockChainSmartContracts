// TopBar.js
import React from 'react';
import '../styling/TopBar.css'; // Styling for the TopBar component

const TopBar = ({ onConnectWallet }) => {
  return (
    <div className="topbar">
      <div className="logo">
        ContentBase
      </div>
      <div className="navigation">
        {/* Placeholder for navigation items */}
        <button className="connect-wallet" onClick={onConnectWallet}>
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default TopBar;
