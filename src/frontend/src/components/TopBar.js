// TopBar.js
import React from 'react';
import '../styling/TopBar.css'; // Styling for the TopBar component
import DebaseLogo from '../static/images/debase_logo.png'
import { useWallet } from './WalletContext';

const TopBar = ({ onConnectWallet }) => {
  const { userAddress } = useWallet();

  return (
    <div className="topbar">
      <div className="logo">
        <img src={DebaseLogo} alt="Debase Logo" />
      </div>
      <div className="navigation">
        {/* Placeholder for navigation items */}
        {userAddress ? (
                <button disabled style={{ backgroundColor: 'gray' }}>Connected</button>
            ) : (
                <button style={{ backgroundColor: 'green' }} onClick={onConnectWallet}>
                    Connect Wallet
                </button> 
            )}
      </div>
    </div>
  );
};

export default TopBar;
