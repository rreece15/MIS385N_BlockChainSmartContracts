// ItemPage.js
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import nftDummyData from '../static/nftData';
import TopBar from './TopBar'; // Assuming TopBar has the necessary links and style
import '../styling/ItemPage.css'; // Ensure this CSS matches the style of the Gallery for consistency
import { useState } from 'react';
import MarketplaceJSON from '../contracts/Marketplace.json';
import axios from 'axios';
import { ethers } from 'ethers';
const PINATA_API = process.env.PINATA_API
const PINATA_API_SECRET = process.env.PINATA_API_SECRET


const ItemPage = () => {
  const [data, updateData] = useState({});
  const [dataFetched, updateFetched] = useState(false);
  const [address, updateAddress] = useState("0x");
  const [message, updateMessage] = useState("");

  const { id } = useParams();
  const nft = nftDummyData.find(nft => nft.id.toString() === id);

  useEffect(() => {
      if (dataFetched == false) {
        getTokenData();
      }
      updateFetched(true);
  }, []);
  


  if (!nft) {
    return <div>NFT not found</div>;
  }

  async function getTokenData() {
    const id = 1;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = '0x0B13d67EA1704370921ED3CdC9f8D2Be0A07ec9F';
    const marketplaceABI = MarketplaceJSON.abi;

    let contract = new ethers.Contract(contractAddress, marketplaceABI, signer);

    var tokenURI = await contract.uri(id);
    console.log(tokenURI);
    const listedToken = await contract.getListedForTokenID(id);
    console.log("************************")
    // console.log(meta);

    const ipfsHash = tokenURI.replace('ipfs://', '');
    const pinataUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    console.log(pinataUrl);
    
    const pinataConfig = {
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API,
        'pinata_secret_api_key': PINATA_API_SECRET
      }
    };

    const ipfsResponse = await axios.get(pinataUrl, pinataConfig);
    const { name, description, imageURL, fileURL, price, amount } = ipfsResponse.data;
    const stuff = { tokenId: nft.tokenId, name, description, imageURL, fileURL, price, amount };
    console.log(stuff);

    let item = {
        tokenId: id,
        seller: listedToken.seller,
        owner: listedToken.owner,
        imageURL: stuff.imageURL,
        name: stuff.name,
        description: stuff.description,
        price: stuff.price,
        amount: stuff.amount,
        fileURL: stuff.fileURL
    }

    updateData(item);
    updateFetched(true);
    // updateAddress(addr);

  }

  async function buyToken(tokenId, amount) {
    try{
      const ethers = require("ethers");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log("signer: ", signer);
   
      const contractAddress = '0x0B13d67EA1704370921ED3CdC9f8D2Be0A07ec9F';
      const marketplaceABI = MarketplaceJSON.abi;

      let contract = new ethers.Contract(contractAddress, marketplaceABI, signer);

      const saleprice = ethers.utils.parseUnits(data.price.toString(), 'ether');
      // updateMessage("Transaction in progress...");

      let transaction = await contract.executeSale(tokenId, amount, {value: saleprice});
      // await transaction.wait();
      alert("Transaction complete!");
      updateMessage("");
    }
    catch(e){
      alert("Transaction failed. Please try again: " + e);
    }
  }

  // return (
  //   <>
  //     <TopBar />
  //     <div className="nft-detail-page">
  //       <div className="nft-detail-container">
  //         <Link to="/" className="back-to-gallery">Back to Gallery</Link>
  //         <div className="nft-detail">
  //           <h2>{nft.title}</h2>
  //           <img src={nft.imageUrl} alt={nft.title} />
  //           <p>{nft.description}</p>
  //           <p>Price: {nft.price}</p>
  //           <button onClick={getTokenData}>
  //             Purchase
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );


  return (
    <>
      <TopBar />
      <div className="nft-detail-page">
        <div className="nft-detail-container">
          <Link to="/" className="back-to-gallery">Back to Gallery</Link>
          <div className="nft-detail">
            <h2>{data.title}</h2>
            <img src={data.imageURL} alt={data.title} />
            <p>{data.description}</p>
            <p>Price: {data.price + "WEI"}</p>
            <p>Owner: {data.owner}</p>
            <p>Seller: {data.seller}</p>
            <p>Amount: {data.amount}</p>
            <div>
            {/* { currAddress != data.owner && currAddress != data.seller ?
                        <button onClick={() => buyToken(id)}>Buy this token</button>
                        : <p>{"You are the owner of this NFT"}</p>
                    } */}
            </div>
            <p>{message}</p>
          </div>

        </div>
      </div>
    </>
  );

};

export default ItemPage;
