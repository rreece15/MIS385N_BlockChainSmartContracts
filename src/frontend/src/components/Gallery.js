// Gallery.js
import React from 'react';
import TopBar from './TopBar.js';
import NftCard from './NftCard'; // Component for individual NFT cards
import Sidebar from './Sidebar'; // Component for the sidebar
import '../styling/Gallery.css'; // Styling for the Gallery component
import nftDummyData from '../static/nftData.js'
import {ethers} from 'ethers';
import { useWallet } from './WalletContext.js';

const Gallery = () => {
  const { setUserAddress } = useWallet();

  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access if needed
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            // We use the first account we find
            const account = accounts[0];
            return account;
        } catch (error) {
            console.error("Failed to connect wallet", error);
            return null;
        }
    } else {
        console.log("MetaMask is not installed!");
        alert("Please install MetaMask to use this feature.");
        return null;
    }
  }

  async function handleConnectWallet() {
    const account = await connectWallet();
    if (account) {
        localStorage.setItem('userWalletAddress', account);
        console.log(account);
        // Update your state or context as necessary
        setUserAddress(account);
    }
}
  
    return (
      <>
        <TopBar onConnectWallet={handleConnectWallet} />
        <div className="gallery-container">
          <Sidebar />
          <div className="nft-content">
            {nftDummyData.map(nft => (
              <NftCard key={nft.id} nft={nft}/>
            ))}
          </div>
        </div>
      </>
    );
  };
  
  export default Gallery;