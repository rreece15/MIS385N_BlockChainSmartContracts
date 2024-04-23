// Gallery.js
import React from 'react';
import TopBar from './TopBar.js';
import NftCard from './NftCard'; // Component for individual NFT cards
import Sidebar from './Sidebar'; // Component for the sidebar
import '../styling/Gallery.css'; // Styling for the Gallery component
import nftDummyData from '../static/nftData.js'

const Gallery = () => {
    // Function to handle wallet connection - for example purposes
    const handleConnectWallet = () => {
      console.log('Wallet connection logic would go here.');
    };
  
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