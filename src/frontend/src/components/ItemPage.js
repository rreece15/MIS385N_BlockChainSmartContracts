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

import { Magic } from 'magic-sdk';

const PINATA_API = process.env.PINATA_API
const PINATA_API_SECRET = process.env.PINATA_API_SECRET
const MAGIC_API = "pk_live_B73ED313176B22C7";
const MAGIC_API_SECRET = "sk_live_E4DCE2E4BF4E724C";


const ItemPage = () => {
  const [data, updateData] = useState({});
  const [dataFetched, updateFetched] = useState(false);
  const [currAddress, updateAddress] = useState("0x");
  const [message, updateMessage] = useState("");

  const { id } = useParams();
  // const nft = nftDummyData.find(nft => nft.id.toString() === id);

  useEffect(() => {
      if (dataFetched == false) {
        getTokenData();
      }
      updateFetched(true);
  }, []);
  


  // if (!nft) {
  //   return <div>NFT not found</div>;
  // }

  async function getTokenData() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    // new address: 0xe87522aB2391Cdc2C87252964E2Be9F1046578B5
    // old address: 0x0B13d67EA1704370921ED3CdC9f8D2Be0A07ec9F
    const currAddress = await signer.getAddress();
    updateAddress(currAddress);
    const contractAddress = '0xe87522aB2391Cdc2C87252964E2Be9F1046578B5';
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
    const stuff = { tokenId: id, name, description, imageURL, fileURL, price, amount };
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

  async function Verify(emailAddress) {
    const magic = new Magic(MAGIC_API)
    try {
      await magic.auth.loginWithMagicLink({ email: emailAddress });
      // If verification succeeds, open the link
      window.open(data.fileURL, "_blank", "noopener noreferrer");
    } catch (e) {
      console.error("Magic Error: ", e);
    }
  }
  async function buyToken(tokenId, amount) {
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log("signer: ", signer);
   
      const contractAddress = '0xe87522aB2391Cdc2C87252964E2Be9F1046578B5';
      const marketplaceABI = MarketplaceJSON.abi;

      let contract = new ethers.Contract(contractAddress, marketplaceABI, signer);

      const saleprice = ethers.utils.parseUnits(data.price.toString(), 'wei');
      updateMessage("Transaction in progress...");
      // get gas price
      const gasPrice = saleprice * amount;

      let transaction = await contract.executeSale(tokenId, amount, {value: saleprice, gasPrice: gasPrice.toString()});
      await transaction.wait();
      alert("Transaction complete!");
      updateMessage("");
    }
    catch(e){
      alert("Transaction failed. Please try again: " + e);
    }
  }

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
            { currAddress != data.owner && currAddress != data.seller ?
                        (<button onClick={() => buyToken(id, 1)}>Buy this token</button>)
                        : (
                        <div>
                        <p>You are the owner of this token</p>
                        <p>
  <a href="#" onClick = {()=>Verify("reece.riherd@gmail.com")} target="_blank" rel="noopener noreferrer">
    Access File
  </a>
</p>

                        </div>
                      )

                    }
            </div>
            <p>{message}</p>
          </div>

        </div>
      </div>
    </>
  );

};

export default ItemPage;
