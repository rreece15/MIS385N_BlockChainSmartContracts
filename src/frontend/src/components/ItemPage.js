// ItemPage.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import nftDummyData from '../static/nftData';
import TopBar from './TopBar'; // Assuming TopBar has the necessary links and style
import '../styling/ItemPage.css'; // Ensure this CSS matches the style of the Gallery for consistency

const ItemPage = () => {
  const [data, updateData] = useState({});
  const [dataFetched, updateFetched] = useState(false);
  const [address, updateAddress] = useState("0x");
  const [message, updateMessage] = useState("");

  const { tokenId } = useParams();
  const nft = nftDummyData.find(nft => nft.id.toString() === tokenId);
  //if !(dataFetched) getTokenData(tokenId);
  


  if (!nft) {
    return <div>NFT not found</div>;
  }

  // async function getTokenData(tokenId) {
  //   const ethers = require("ethers");
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const signer = provider.getSigner();
  //   const addr = await signer.getAddress();
  //   let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)

  //   var tokenURI = await contract.tokenURI(tokenId);
  //   const listedToken = await contract.getListedForTokenId(tokenId);
  //   var meta = await axios.get(tokenURI);
  //   meta = meta.data;

  //   let item = {
  //       tokenId: tokenId,
  //       seller: listedToken.seller,
  //       owner: listedToken.owner,
  //       image: meta.image,
  //       name: meta.name,
  //       description: meta.description,
  //       price: meta.price,
  //       amount: listedToken.amount
  //   }

  //   updateData(item);
  //   updateFetched(true);
  //   updateAddress(addr);

  // }

  // async function buyToken(tokenId, amount) {
  //   try{
  //     const ethers = require("ethers");
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();

  //     let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
  //     const saleprice = ethers.utils.parseUnits(data.price.toString(), 'ether');
  //     updateMessage("Transaction in progress...");

  //     let transaction = await contract.executeSale(tokenId, amount, {value: saleprice});
  //     await transaction.wait();
  //     alert("Transaction complete!");
  //     updateMessage("");
  //   }
  //   catch(e){
  //     alert("Transaction failed. Please try again: " + e);
  //   }
  // }

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


  // return (
  //   <>
  //     <TopBar />
  //     <div className="nft-detail-page">
  //       <div className="nft-detail-container">
  //         <Link to="/" className="back-to-gallery">Back to Gallery</Link>
  //         <div className="nft-detail">
  //           <h2>{data.title}</h2>
  //           <img src={data.imageUrl} alt={data.title} />
  //           <p>{data.description}</p>
  //           <p>Price: {data.price + "ETH"}</p>
  //           <p>Owner: {data.owner}</p>
  //           <p>Seller: {data.seller}</p>
  //           <p>Amount: {data.amount}</p>
  //           <div>
  //           { currAddress != data.owner && currAddress != data.seller ?
  //                       <button onClick={() => buyToken(tokenId)}>Buy this token</button>
  //                       : <p>{"You are the owner of this NFT"}</p>
  //                   }
  //           </div>
  //           <p>{message}</p>
  //         </div>

  //       </div>
  //     </div>
  //   </>
  // );

};

export default ItemPage;
