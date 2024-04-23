// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const path = require("path");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );
  const balance = await deployer.getBalance();
  console.log("Account balance:", (balance).toString());
  const Marketplace = await ethers.getContractFactory("Marketplace");
  // console.log("check");
  const marketplace = await Marketplace.deploy()
  // console.log("check1");
  await marketplace.deployed()
  // const Token = await ethers.getContractFactory("Token");
  // const token = await Token.deploy();
  // await token.deployed();

  

  console.log("Marketplace address:", marketplace.address);
  const data = {
    address: marketplace.address,
    abi: JSON.parse(marketplace.interface.format('json')),
  }

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(marketplace);
}

function saveFrontendFiles(token) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ Token: token.address }, undefined, 2)
  );

  // fs.writeFileSync(
  //   path.join(contractsDir, "Token.json"),
  //   JSON.stringify(data)
  // );

  const TokenArtifact = artifacts.readArtifactSync("Marketplace");

  fs.writeFileSync(
    path.join(contractsDir, "Marketplace.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });