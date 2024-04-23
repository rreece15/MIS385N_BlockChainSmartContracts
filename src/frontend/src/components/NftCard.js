// NftCard.js
import React from 'react';
import '../styling/NftCard.css'; // Styling for the NftCard

const NftCard = ({ nft }) => {
  return (
    <div className="nft-card">
      <img src={nft.imageUrl} alt={nft.title} className="nft-image" />
      <div className="nft-info">
        <h5>{nft.title}</h5>
        <p>#{nft.id}</p>
      </div>
    </div>
  );
};

export default NftCard;
