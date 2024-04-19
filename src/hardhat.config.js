require('dotenv').config()
require("@nomicfoundation/hardhat-toolbox");

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    mis385n: {
      url: "http://54.146.235.138:8546",
      accounts: [process.env.PK],
      chainId: 385000,
      gasPrice: 2e9,
      gas: 30000000,
    }
  },
};
