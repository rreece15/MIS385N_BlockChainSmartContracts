import React, { useState } from 'react';
import ABIJSON from '../contracts/Marketplace.json'; // Assuming you have the contract ABI in a file
const axios = require('axios');

const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK({ pinataJWTKey: 'yourPinataJWTKey'});

const web3 = new Web3('http://54.146.235.138:8546'); // Replace with your Ethereum node URL
const contractAddress = '0x6498010be9903c50f0bbc396dF0b47f0be20030B'; // Replace with your contract address
const fs = require('fs')

async function createMediaToken(name, description, imageURL, fileURL, price, amount) {
    try {
        const inputData = {
            name: name,
            description: description,
            imageURL: imageURL,
            fileURL: fileURL,
            price: Number(price), // price is in wei
            amount: parseInt(amount),
        };

        const jsonData = JSON.stringify(inputData);

        // const pinataEndpoint = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

        // const pinataConfig = {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'pinata_api_key': process.env.PINATA_API,
        //         'pinata_secret_api_key': process.env.PINATA_API_SECRET
        //     }
        // };

        // const pinataResponse = await axios.post(pinataEndpoint, jsonData, pinataConfig);
        const pinataResponse = await pinata.pinJSONToIPFS(jsonData)
        const ipfsHash = pinataResponse.data.IpfsHash;
        const ipfsURI = `ipfs://${ipfsHash}`

        // const web3 = new Web3('http://54.146.235.138:8546')

        const rawABI = fs.readFileSync(ABIJSON);
        const contractABI = JSON.parse(rawABI);

        const contract = new web3.eth.Contract(contractABI, contractAddress)

        const createTransaction = await contract.methods.createMedia(ipfsURI, inputData[price], inputData[amount]).send({from: WALLETADDRESS});

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
    const [price, setInput5] = useState('');
    const [amount, setInput6] = useState('');

    const handleCreateToken = () => {
        // Call the createERC1155Token function with inputs
        createMediaToken(tokenName, description, imageURL, fileURL, price, amount);
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
        </div>
    );
}

export default TokenCreator;