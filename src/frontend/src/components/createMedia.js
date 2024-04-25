import React, { useState } from 'react';
import ABIJSON from '../contracts/Marketplace.json'; // Assuming you have the contract ABI in a file
import '../styling/UploadModal.css'  // Make sure to create appropriate CSS
import Web3 from 'web3';
import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

const reece_wallet = "0x2aEA1B5ad67CBbF5B15762912081088527f389c4";

// const pinataSDK = require('@pinata/sdk');
// const pinata = new pinataSDK({ pinataJWTKey: 'yourPinataJWTKey'});

const web3 = new Web3(window.ethereum); // Replace with your Ethereum node URL
const contractAddress = '0x0B13d67EA1704370921ED3CdC9f8D2Be0A07ec9F'; // Replace with your contract address
const remix_contractAddress = '0xCb5B59882550520F35E98528c4a6d21b1fC1dCe4';
const PINATA_API = "ecf152a26396b4af8b0e";
const PINATA_API_SECRET = "ddb768a9219ad9e58eee08e2d7a12354f2a275b5343b6338abd33b493c05eec2";

async function createMediaToken(name, description, imageURL, fileURL, price, payment, amount) {
    try {
        // console.log(process.env.PINATA_API)
        // console.log(process.env.PINATA_API_SECRET)
        const inputData = {
            name: name,
            description: description,
            imageURL: imageURL,
            fileURL: fileURL,
            price: Number(price), // price is in wei
            amount: parseInt(amount),
        };

        console.log('Input Data: ', inputData);

        const jsonData = JSON.stringify(inputData);
        const pinataEndpoint = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

        const pinataConfig = {
            headers: {
                'Content-Type': 'application/json',
                'pinata_api_key': PINATA_API,
                'pinata_secret_api_key': PINATA_API_SECRET
            }
        };

        const pinataResponse = await axios.post(pinataEndpoint, jsonData, pinataConfig);
        const ipfsHash = pinataResponse.data.IpfsHash;
        const ipfsURI = `ipfs://${ipfsHash}`
        
        const accounts = await web3.eth.getAccounts();
        const fromAddress = accounts[0];

        console.log(ipfsURI);
        console.log(inputData.price);
        console.log(inputData.amount);

        const contractABI = ABIJSON.abi;
        const contract = new web3.eth.Contract(contractABI, contractAddress)
        const createTransaction = await contract.methods.createMedia(ipfsURI, inputData.price, inputData.amount).send({from: fromAddress, value: payment, gasPrice: '2000000000', gas: '30000000' });

        console.log("Successfully minted media.");
        console.log("Transaction hash: ", createTransaction.transactionHash);
    } catch (error) {
        console.error("Error: ", error.message);
    }
}

const TokenCreator = ({onClose, isOpen}) =>{
    const [imageURL, setImageURL] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [fileURL, setFileURL] = useState('');

    async function handleCreateToken(e) {
        try {
            // Call the createERC1155Token function with inputs
            console.log("handled");
            const res = await createMediaToken(title, description, imageURL, fileURL, price, amount);
            console.log(res);
        } catch (error) {
            console.error("Error creating token: ", error);
        }
    };

    return (
        <div className="modal-overlay">
        <div className="modal-content">
            <h2>Add New Item</h2>
            <form onSubmit={handleCreateToken}>
                <input
                    type="text"
                    placeholder="Image URL"
                    value={imageURL}
                    onChange={e => setImageURL(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Price"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Amount"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="File URL"
                    value={fileURL}
                    onChange={e => setFileURL(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
            <button onClick={() => console.log("ajhjkldfhjaklsdh;kfad")}>Close</button>
        </div>
    </div>
    );
}

export default TokenCreator;
export { createMediaToken };
