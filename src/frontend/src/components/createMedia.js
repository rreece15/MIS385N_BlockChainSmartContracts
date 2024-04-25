import React, { useState } from 'react';
import ABIJSON from '../contracts/Marketplace.json'; // Assuming you have the contract ABI in a file
import Web3 from 'web3';
import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

// const reece_wallet = "0x2aEA1B5ad67CBbF5B15762912081088527f389c4";

// const pinataSDK = require('@pinata/sdk');
// const pinata = new pinataSDK({ pinataJWTKey: 'yourPinataJWTKey'});

// const web3 = new Web3('http://54.146.235.138:8546'); // Replace with your Ethereum node URL
const web3 = new Web3(window.ethereum);
const contractAddress = '0x6C6cFFBc5Bf9b3cffF21234F21B450e1c937B3E6'; // Replace with your contract address
const remix_contractAddress = '0xCb5B59882550520F35E98528c4a6d21b1fC1dCe4';
// const fs = require('fs')

async function createMediaToken(name, description, imageURL, fileURL, price, payment, amount) {
    try {

        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        const fromAddress = accounts[0];
        console.log(fromAddress);
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
                'pinata_api_key': "ecf152a26396b4af8b0e",
                'pinata_secret_api_key': "ddb768a9219ad9e58eee08e2d7a12354f2a275b5343b6338abd33b493c05eec2"
            }
        };

        const pinataResponse = await axios.post(pinataEndpoint, jsonData, pinataConfig);
        // const pinataResponse = await pinata.pinJSONToIPFS(jsonData)
        const ipfsHash = pinataResponse.data.IpfsHash;
        const ipfsURI = `ipfs://${ipfsHash}`

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
            <input
                type="text"
                value={payment}
                onChange={(e) => setInput7(e.target.value)}
                placeholder="Payment"
            />
            <button onClick={handleCreateToken}>Create Media Token</button>
        </div>
    );
}

export default TokenCreator;
