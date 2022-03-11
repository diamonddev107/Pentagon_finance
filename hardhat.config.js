require("@nomiclabs/hardhat-waffle");

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {

    },
    ropsten: {
      chainId: 3,
      url: process.env.API_URL,
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
      nonce:150
    },
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
