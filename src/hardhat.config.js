require("@nomicfoundation/hardhat-toolbox");

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  mocha: {
    timeout: 100000000
  },
  networks: {
    hardhat: {
      blockGasLimit: 10000000,
      chainId: 31337,
    },
    // mis385n: {
    //   url: "http://54.146.235.138:8546",
    //   accounts: [process.env.PK],
    //   chainId: 385000,
    //   gasPrice: 2e9,
    //   gas: 30000000,
    // },
    // goerli: {
    //   url: 'https://rpc.ankr.com/eth_goerli',
    //   accounts: [process.env.PK],
    // },
    // fuji: {
    //   url: 'https://ava-testnet.public.blastapi.io/ext/bc/C/rpc',
    //   accounts: [process.env.PK],
    //   chainId: 43113,
    // },
    // xdcTestnet: {
    //   url: 'https://erpc.apothem.network',
    //   accounts: [process.env.PK],
    // },
    // arbitrumGoerli: {
    //   url: 'https://arbitrum-goerli.publicnode.com',
    //   accounts: [process.env.PK],
    // },
    // optimisticGoerli: {
    //   url: 'https://optimism-goerli.publicnode.com',
    //   accounts: [process.env.PK],
    //   gasPrice: 0.01e9,
    // },
    // polygonMumbai: {
    //   url: 'https://polygon-mumbai-bor.publicnode.com',
    //   accounts: [process.env.PK],
    // }
  },
  etherscan: {
    apiKey: {
    }
  }
};
