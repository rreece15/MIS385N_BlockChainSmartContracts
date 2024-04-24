// Gallery.js
import React from 'react';
import TopBar from './TopBar.js';
import NftCard from './NftCard'; // Component for individual NFT cards
import Sidebar from './Sidebar'; // Component for the sidebar
import '../styling/Gallery.css'; // Styling for the Gallery component
import nftDummyData from '../static/nftData.js'
import {ethers} from 'ethers';
import { useWallet } from './WalletContext.js';
import { useState } from 'react';

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

  const [data, updateData] = useState({});
  const [dataFetched, updateFetched] = useState(false);


  // async function getAllTokenData(tokenId) {
  //   const ethers = require("ethers");
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const signer = provider.getSigner();
    
  //   let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
  //   let transaction = await contract.getAllTokens(tokenId);


  //   const items = await Promise.all(transaction.map(async (i) => {
  //       var tokenURI = await contract.tokenURI(i.tokenId);
  //       tokenURI = GetIpfsUrlFromPinata(tokenURI);
  //       let meta = await axios.get(tokenURI);
  //       meta = meta.data;

  //       let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
  //       let item = {
  //           tokenId: i.tokenId.toNumber(),
  //           seller: i.seller,
  //           owner: i.owner,
  //           image: meta.image,
  //           name: meta.name,
  //           description: meta.description,
  //           amount: i.amount
  //       }
  //       return item;
  //   }))

  //   updateData(items);
  //   updateFetched(true);
// }

  // if(!dataFetched){
  //   // getAllTokenData();
  // }

  
    return (
      <>
        <TopBar onConnectWallet={handleConnectWallet} />
        <div className="gallery-container">
          <Sidebar />
          <div className="nft-content">
            {nftDummyData.map(nft => (
              <NftCard key={nft.id} nft={nft}/>
            ))}
            {/* {data.map(nft => (
              <NftCard key={nft.tokenId} nft={nft}/>
            ))}  */}
          </div>
        </div>
      </>
    );
  

  }
  export default Gallery;