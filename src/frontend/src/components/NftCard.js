// NftCard.js
import React from 'react';
import '../styling/NftCard.css'; // Styling for the NftCard
import { useNavigate } from 'react-router-dom';

const NftCard = ({ nft }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/item/${nft.id}`);
  }

  return (
    <div className="nft-card" onClick={handleClick}>
      <img src={nft.imageUrl} alt={nft.title} className="nft-image" />
      <div className="nft-info">
        <h5>{nft.title}</h5>
        <p>#{nft.id}</p>
      </div>
    </div>
  );
};

export default NftCard;
