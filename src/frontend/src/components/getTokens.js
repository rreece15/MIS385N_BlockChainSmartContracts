const Web3 = require('web3');
import MarketplaceABI from '../contracts/Marketplace.json'; // Assuming you have the contract ABI in a file
const axios = require('axios');

const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT});
const PINATA_API = process.env.PINATA_API
const PINATA_API_SECRET = process.env.PINATA_API_SECRET

const web3 = new Web3('http://54.146.235.138:8546'); // Replace with your Ethereum node URL
const contractAddress = '0x6498010be9903c50f0bbc396dF0b47f0be20030B'; // Replace with your contract address

const MarketplaceContract = new web3.eth.Contract(MarketplaceABI, contractAddress);

const getAllTokens = async () => {
    try {
      // Call the getAlltokens function of the Marketplace contract
      const tokens = await MarketplaceContract.methods.getAllTokens().call();
  
      // Fetch URI for each tokenId
      const tokensWithURIs = await Promise.all(
        tokens.map(async (token) => {
          const tokenID = token.tokenID;
          const uri = await MarketplaceContract.methods.uri(tokenID).call();
          return { tokenID, uri };
        })
      );
  
      // Fetch additional data from the URI
      const tokensWithDetails = await Promise.all(
        tokensWithURIs.map(async (token) => {
            const ipfsHash = token.uri.replace('ipfs://', '');
            const pinataUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
            
            const pinataConfig = {
              headers: {
                'Content-Type': 'application/json',
                'pinata_api_key': PINATA_API,
                'pinata_secret_api_key': PINATA_API_SECRET
              }
            };
    
            const ipfsResponse = await axios.get(pinataUrl, pinataConfig);
            const { name, description, imageURL, fileURL, price, amount } = ipfsResponse.data;
            return { tokenId: nft.tokenId, name, description, imageURL, fileURL, price, amount };
          })
      );
  
      return tokensWithDetails;
    } catch (error) {
      console.error('Error getting all tokens:', error.message);
      return [];
    }
};

const getMyTokens = async () => {
  try {
    // Call the getAlltokens function of the Marketplace contract
    const tokens = await MarketplaceContract.methods.getAllTokens().call();

    // Fetch URI for each tokenId
    const tokensWithURIs = await Promise.all(
      tokens.map(async (token) => {
        const tokenID = token.tokenID;
        const uri = await MarketplaceContract.methods.uri(tokenID).call();
        return { tokenID, uri };
      })
    );

    // Fetch additional data from the URI
    const tokensWithDetails = await Promise.all(
      tokensWithURIs.map(async (token) => {
          const ipfsHash = token.uri.replace('ipfs://', '');
          const pinataUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
          
          const pinataConfig = {
            headers: {
              'Content-Type': 'application/json',
              'pinata_api_key': PINATA_API,
              'pinata_secret_api_key': PINATA_API_SECRET
            }
          };
  
          const ipfsResponse = await axios.get(pinataUrl, pinataConfig);
          const { name, description, imageURL, fileURL, price, amount } = ipfsResponse.data;
          return { tokenId: nft.tokenId, name, description, imageURL, fileURL, price, amount };
        })
    );

    return tokensWithDetails;
  } catch (error) {
    console.error('Error getting all tokens:', error.message);
    return [];
  }
};

const getAvailableTokens = async () => {
  try {
    // Call the getAlltokens function of the Marketplace contract
    const tokens = await MarketplaceContract.methods.getAvailableTokens().call();

    // Fetch URI for each tokenId
    const tokensWithURIs = await Promise.all(
      tokens.map(async (token) => {
        const tokenID = token.tokenID;
        const uri = await MarketplaceContract.methods.uri(tokenID).call();
        return { tokenID, uri };
      })
    );

    // Fetch additional data from the URI
    const tokensWithDetails = await Promise.all(
      tokensWithURIs.map(async (token) => {
          const ipfsHash = token.uri.replace('ipfs://', '');
          const pinataUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
          
          const pinataConfig = {
            headers: {
              'Content-Type': 'application/json',
              'pinata_api_key': PINATA_API,
              'pinata_secret_api_key': PINATA_API_SECRET
            }
          };
  
          const ipfsResponse = await axios.get(pinataUrl, pinataConfig);
          const { name, description, imageURL, fileURL, price, amount } = ipfsResponse.data;
          return { tokenId: nft.tokenId, name, description, imageURL, fileURL, price, amount };
        })
    );

    return tokensWithDetails;
  } catch (error) {
    console.error('Error getting all tokens:', error.message);
    return [];
  }
};

export default getAvailableTokens;
export { getAllTokens, getMyTokens}