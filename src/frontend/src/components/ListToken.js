import React from 'react';
import TopBar from './TopBar.js';
import NftCard from './NftCard'; // Component for individual NFT cards
import Sidebar from './Sidebar';

import { uploadFileToIPFS, uploadJSONToIPFS } from '../pinata.js';
import MarketplaceJSON from '../contracts/Marketplace.json';



export default function ListToken(){
    const[formParams, updateFormParams] = React.useState({name:"",description:"",price:""});
    const[fileURL, updateFileURL] = React.useState("");
    const[message, updateMessage] = React.useState("");
    const ethers = require("ethers");


    async function disableButton() {
        const listButton = document.getElementById("listButton");
        listButton.disabled = true;
        listButton.style.backgroundColor = "grey";

    }
    async function enableButton() {
        const listButton = document.getElementById("listButton");
        listButton.disabled = false;
        listButton.style.backgroundColor = "blue";
    }

    async function uploadMetadataToIPFS() {
        const {name,description,price} = formParams;
        if (!name || !description || !price || !fileURL) {
            updateMessage("Please fill out all fields");
            return -1;
        }

        const tokenJSON = {
            name,description,price,image:fileURL
        };

        try {
            const response = await uploadJSONToIPFS(tokenJSON);
            if (response.success === true) {
                console.log("Uploaded JSON to Pinata ", response);
                return response.pinataURL;
            }
        }
        catch (e) {
            console.log("Error uploading JSON metadata", e);
        }
    }

    async function listToken(e) {
        e.preventDefault();
        try {
            const metadataURL = await uploadMetadataToIPFS();
            if(metadataURL === -1) {
                return;
            }
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            updateMessage("Please wait...");
            disableButton();

            let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
            const price = ethers.utils.parseUnits(formParams.price, 'ether');
            let listingPrice = await contract.getListPrice();
            listingPrice = listingPrice.toString();


            let transaction = await contract.createToken(metadataURL, price, {value: listingPrice});
            await transaction.wait();
            updateMessage("");
            updateFormParams({name:"",description:"",price:""});
            updateFileURL("");
        }
        catch (e) {
            console.log("Error listing Token", e);
        }
    }

    async function OnChangeFile(e){
        var file = e.target.files[0];
        try {
            disableButton();
            updateMessage("Uploading file to IPFS...");
            const response = await uploadFileToIPFS(file);
            if(response.success === true) {
                console.log("Uploaded file to Pinata ", response);
                updateFileURL(response.pinataURL);
                enableButton();
            }
        }
        catch (e) {
            console.log("Error uploading file", e);
        }
    }


    return (
        <div>
            <TopBar />
            <div className="container">
                <div className="row">
                    <div className="col-8">
                        <h1>List a new Token</h1>
                        <form onSubmit={listToken}>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" className="form-control" placeholder="Enter name" value={formParams.name} onChange={(e) => updateFormParams({name:e.target.value,description:formParams.description,price:formParams.price})}/>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input type="text" className="form-control" placeholder="Enter description" value={formParams.description} onChange={(e) => updateFormParams({name:formParams.name,description:e.target.value,price:formParams.price})}/>
                            </div>
                            <div className="form-group">
                                <label>Price</label>
                                <input type="text" className="form-control" placeholder="Enter price" value={formParams.price} onChange={(e) => updateFormParams({name:formParams.name,description:formParams.description,price:e.target.value})}/>
                            </div>
                            <div className="form-group">
                                <label>Upload Image</label>
                                <input type="file" className="form-control" onChange={OnChangeFile}/>
                            </div>
                            <button id="listButton" type="submit" className="btn btn-primary">List Token</button>
                            <p>{message}</p>
                        </form>
                    </div>
                    <div className="col-4">
                        <Sidebar />
                    </div>
                </div>
            </div>
        </div>
    )


}