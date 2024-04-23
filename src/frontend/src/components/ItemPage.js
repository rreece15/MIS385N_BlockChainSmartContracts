// ItemPage.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import nftDummyData from '../static/nftData';
import TopBar from './TopBar'; // Assuming TopBar has the necessary links and style
import '../styling/ItemPage.css'; // Ensure this CSS matches the style of the Gallery for consistency

const ItemPage = () => {
  const { id } = useParams();
  const nft = nftDummyData.find(nft => nft.id.toString() === id);

  if (!nft) {
    return <div>NFT not found</div>;
  }

  return (
    <>
      <TopBar />
      <div className="nft-detail-page">
        <div className="nft-detail-container">
          <Link to="/" className="back-to-gallery">Back to Gallery</Link>
          <div className="nft-detail">
            <h2>{nft.title}</h2>
            <img src={nft.imageUrl} alt={nft.title} />
            <p>{nft.description}</p>
            <p>Price: {nft.price}</p>
            <button onClick={() => console.log('Purchase logic goes here')}>
              Purchase
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemPage;
