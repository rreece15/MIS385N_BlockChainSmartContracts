import React, { useState } from 'react';
import ABIJSON from '../contracts/Marketplace.json'; // Assuming you have the contract ABI in a file
import '../styling/UploadModal.css'  // Make sure to create appropriate CSS
import Web3 from 'web3';
import axios from 'axios';

const web3 = new Web3(window.ethereum);
const contractAddress = '0xe87522aB2391Cdc2C87252964E2Be9F1046578B5'; // Replace with your contract address
const remix_contractAddress = '0xCb5B59882550520F35E98528c4a6d21b1fC1dCe4';
const PINATA_API = "ecf152a26396b4af8b0e";
const PINATA_API_SECRET = "ddb768a9219ad9e58eee08e2d7a12354f2a275b5343b6338abd33b493c05eec2";

async function createMediaToken(name, description, imageURL, fileURL, price, payment, amount) {
    try {

        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        const fromAddress = accounts[0];
        console.log(fromAddress);
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
        const ipfsURI = `ipfs://${ipfsHash}`;

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

function TokenCreator() {
    const [tokenName, setInput1] = useState('');
    const [description, setInput2] = useState('');
    const [imageURL, setInput3] = useState('');
    const [fileURL, setInput4] = useState('');
    const [amount, setInput5] = useState('');
    const [price, setInput6] = useState('');
    const [payment, setInput7] = useState('');

    const handleCreateToken = () => {
        // Call the createERC1155Token function with inputs
        console.log("handled");
        createMediaToken(tokenName, description, imageURL, fileURL, price, payment, amount);
    };

    return (
        <div>
            <input
                type="text"
                value={tokenName}
                onChange={(e) => setInput1(e.target.value)}
                placeholder="Name"
            />
            <input
                type="text"
                value={description}
                onChange={(e) => setInput2(e.target.value)}
                placeholder="Description"
            />
            <input
                type="text"
                value={imageURL}
                onChange={(e) => setInput3(e.target.value)}
                placeholder="Image URL"
            />
            <input
                type="text"
                value={fileURL}
                onChange={(e) => setInput4(e.target.value)}
                placeholder="File URL"
            />
            <input
                type="text"
                value={amount}
                onChange={(e) => setInput5(e.target.value)}
                placeholder="Amount"
            />
            <input
                type="text"
                value={price}
                onChange={(e) => setInput6(e.target.value)}
                placeholder="Price"
            />
            <button onClick={handleCreateToken}>Create Media Token</button>
            <button onClick={() => console.log('ajkdl;faj')}>Close</button>
        </div>
    );
}

export default TokenCreator;
