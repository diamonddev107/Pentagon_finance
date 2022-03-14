require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
require("@nomiclabs/hardhat-etherscan");
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      timeout: 200000,

    },
    ropsten: {
      chainId: 3,
      url: "https://ropsten.infura.io/v3/475f30009ec149f9a426b73a074256c6",
      accounts: {
        mnemonic: process.env.MNEMONIC
      },
      gas: 2100000, 
      gasPrice: 8000000000
    },
    kovan: {
      accounts: 
      {
          mnemonic: process.env.MNEMONIC,
      },
      url: "https://kovan.infura.io/v3/99b8947af7e14278ae235bb21eb81f53",
      chainId: 42,
      timeout: 200000,
      gas: 2100000, 
      gasPrice: 8000000000,
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "https://ropsten.infura.io/v3/475f30009ec149f9a426b73a074256c6"
  },
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
};
