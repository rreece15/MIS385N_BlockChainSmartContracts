import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import NftCard from "./NftCard";
import { useState } from "react";
import axios from "axios";
import MarketplaceJSON from "../contracts/Marketplace.json";



export default function Profile() {
    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const [address, updateAddress] = useState("0x");
    const [message, updateMessage] = useState("");
    const [totalPrice, updateTotalPrice] = useState(0);


    async function getTokenData(tokenId) {
        const ethers = require("ethers");
        let sumPrice = 0;

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();

        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)

        let transaction = await contract.getMyTokens();
        const items = await Promise.all(transaction.map(async (i) => {
            var tokenURI = await contract.tokenURI(i.tokenId);
            tokenURI = GetIpfsUrlFromPinata(tokenURI);
            let meta = await axios.get(tokenURI);
            meta = meta.data;

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            sumPrice += parseFloat(price);
            let item = {
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.image,
                name: meta.name,
                description: meta.description,
                price: price,
                amount: i.amount
            }
            return item;
        }))
        updateData(items);
        updateFetched(true);
        updateAddress(addr);
        updateTotalPrice(sumPrice);
    }

    if (!dataFetched) {
        getTokenData();
    }

    return (
        <>
            <TopBar onConnectWallet={handleConnectWallet} />
            <div className="gallery-container">
                <Sidebar />
                <div className="profile-header">
                    <div className="profile-info">
                        <h1>Profile</h1>
                        <p>Address: {address}</p>
                        <p>Total Value: {totalPrice} ETH</p>
                    </div>
                    <div className="nft-content">
                        {data.map(nft => (
                            <NftCard key={nft.tokenId} nft={nft} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}