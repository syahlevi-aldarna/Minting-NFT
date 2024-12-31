require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.0"
      },
      {
        version: "0.8.20"
      },
      {
        version: "0.8.27"
      }
    ]
  },
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_API_URL_SEPOLIA,
      accounts: [process.env.PRIVATE_KEY]
    },
    opSepolia: {
      url: process.env.OP_SEPOLIA_RPC_URL,
      chainId: 11155420, // Update dengan chain ID yang benar dari error message
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
