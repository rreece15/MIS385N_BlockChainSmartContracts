// NftCard.js
import React from 'react';
import '../styling/NftCard.css'; // Styling for the NftCard
import { useNavigate } from 'react-router-dom';

const NftCard = ({ nft }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    console.log(nft.id)
    navigate(`/item/${nft.id}`);
  }

  return (
    <div className="nft-card" onClick={handleClick}>
      <img src={nft.imageURL} alt={nft.name} className="nft-image" />
      <div className="nft-info">
        <h5>{nft.name}</h5>
        <p>ID: {nft.id}</p>
      </div>
    </div>
  );
};

export default NftCard;
