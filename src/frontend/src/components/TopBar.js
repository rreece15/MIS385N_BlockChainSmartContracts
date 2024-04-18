// TopBar.js
import React from 'react';
import '../styling/TopBar.css'; // Styling for the TopBar component
import DebaseLogo from '../static/images/debase_logo.png'

const TopBar = ({ onConnectWallet }) => {
  return (
    <div className="topbar">
      <div className="logo">
        <img src={DebaseLogo} alt="Debase Logo" />
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
