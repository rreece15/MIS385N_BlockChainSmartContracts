// TopBar.js
import React from 'react';
import '../styling/TopBar.css'; // Styling for the TopBar component
import DebaseLogo from '../static/images/debase_logo.png'
import { useWallet } from './WalletContext';
import UploadModal from './UploadModal';
import { useState } from 'react';

const TopBar = ({ onConnectWallet }) => {
  const { userAddress } = useWallet();
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="topbar">
      <div className="logo">
        <img src={DebaseLogo} alt="Debase Logo" />
      </div>
      <div className="navigation">
        <button style= {{backrounColor: 'gray'}} onClick = {() => setModalOpen(true)}>
          Upload
        </button>
        <UploadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
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
