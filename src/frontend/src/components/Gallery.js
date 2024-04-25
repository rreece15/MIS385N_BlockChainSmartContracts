// Gallery.js
import React, { useEffect } from 'react';
import TopBar from './TopBar.js';
import NftCard from './NftCard'; // Component for individual NFT cards
import Sidebar from './Sidebar'; // Component for the sidebar
import '../styling/Gallery.css'; // Styling for the Gallery component
import nftDummyData from '../static/nftData.js'
import {ethers} from 'ethers';
import { useWallet } from './WalletContext.js';
import { useState } from 'react';
import MarketplaceJSON from '../contracts/Marketplace.json';
import axios from "axios";

const PINATA_API = process.env.PINATA_API
const PINATA_API_SECRET = process.env.PINATA_API_SECRET


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

  const [data, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);
  const [myTokens, updateMyTokens] = useState(false);

  const getIpfsUrlFromPinata = (tokenURI) => {
      console.log(tokenURI);
      const ipfsHash = tokenURI.replace('ipfs://', '');
      return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  };

  async function getAllTokenData() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress = '0xe87522aB2391Cdc2C87252964E2Be9F1046578B5';
      
      const contract = new ethers.Contract(contractAddress, MarketplaceJSON.abi, signer);

      try {
          console.log("Fetching all tokens");
          let tokens = await contract.getAllTokens();
          console.log(tokens);

          const items = await Promise.all(tokens.map(async (token) => {
              try {
                  let tokenURI = await contract.uri(token.tokenID);
                  tokenURI = getIpfsUrlFromPinata(tokenURI);

                  const pinataConfig = {
                      headers: {
                          'Content-Type': 'application/json',
                          'pinata_api_key': PINATA_API,
                          'pinata_secret_api_key': PINATA_API_SECRET
                      }
                  };

                  let metaResponse = await axios.get(tokenURI, pinataConfig);
                  let meta = metaResponse.data;
                  console.log(meta)

                  let price = ethers.utils.formatUnits(token.price.toString(), 'ether');
                  let item = {
                      id: token.tokenID.toNumber(),
                      seller: token.seller,
                      owner: token.owner,
                      imageURL: meta.imageURL,
                      name: meta.name,
                      description: meta.description,
                      price: price,
                      amount: token.amountListed.toNumber(),
                      fileURL: meta.fileURL
                  };

                  return item;
              } catch (error) {
                  console.error("Error fetching metadata for token", token.id.toNumber(), error);
                  return null; // or continue with empty or default values
              }
          }));

          // Filter out any null entries due to errors
          const validItems = items.filter(item => item !== null);
          console.log(validItems.length, "valid items")

          updateData(validItems);
          updateFetched(true);
      } catch (error) {
          console.error("Failed to fetch all tokens:", error);
          updateFetched(false); // Indicate that fetching failed
      }
  }

  async function getMyTokens() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = '0xe87522aB2391Cdc2C87252964E2Be9F1046578B5';
    
    const contract = new ethers.Contract(contractAddress, MarketplaceJSON.abi, signer);

    try {
        console.log("Fetching all tokens");
        let tokens = await contract.getMyTokens();
        console.log(tokens);

        const items = await Promise.all(tokens.map(async (token) => {
            try {
                let tokenURI = await contract.uri(token.tokenID);
                tokenURI = getIpfsUrlFromPinata(tokenURI);

                const pinataConfig = {
                    headers: {
                        'Content-Type': 'application/json',
                        'pinata_api_key': PINATA_API,
                        'pinata_secret_api_key': PINATA_API_SECRET
                    }
                };

                let metaResponse = await axios.get(tokenURI, pinataConfig);
                let meta = metaResponse.data;
                console.log(meta)

                let price = ethers.utils.formatUnits(token.price.toString(), 'ether');
                let item = {
                    id: token.tokenID.toNumber(),
                    seller: token.seller,
                    owner: token.owner,
                    imageURL: meta.imageURL,
                    name: meta.name,
                    description: meta.description,
                    price: price,
                    amount: token.amountListed.toNumber(),
                    fileURL: meta.fileURL
                };

                return item;
            } catch (error) {
                console.error("Error fetching metadata for token", token.id.toNumber(), error);
                return null; // or continue with empty or default values
            }
        }));

        // Filter out any null entries due to errors
        const validItems = items.filter(item => item !== null);
        console.log(validItems.length, "valid items")

        updateData(validItems);
        updateFetched(true);
    } catch (error) {
        console.error("Failed to fetch all tokens:", error);
        updateFetched(false); // Indicate that fetching failed
    }
}

  // call useEffect that gets called when myTokens changes
  useEffect(() => {
    console.log("My tokens changed");
    if (myTokens) {
        getMyTokens();
    } else {
        getAllTokenData();
    }
  }, [myTokens]);
  
    return (
      <>
        <TopBar onConnectWallet={handleConnectWallet} />
        <div className="gallery-container">
          <Sidebar setMyToken={updateMyTokens}/>
          <div className="nft-content">
            {/* {nftDummyData.map(nft => (
              <NftCard key={nft.id} nft={nft}/>
            ))} */}
            {data.map(nft => (
              <NftCard key={nft.id} nft={nft}/>
            ))} 
          </div>
        </div>
      </>
    );
  

  }
  export default Gallery;