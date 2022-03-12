
async function main() {
  const FarmCoin = await hre.ethers.getContractFactory("FarmCoin")
  const farmCoin = await FarmCoin.deploy("100000000000000000000000000")
  await farmCoin.deployed()
  console.log("FarmCoin deployed to:", farmCoin.address)

  const PentagonStaking = await ethers.getContractFactory("PentagonStaking")
  const pentagon = await PentagonStaking.deploy(farmCoin.address, "0x70cDFb73f78c51BF8a77b36c911d1F8c305d48E6")
  await pentagon.deployed()
  console.log("PentagonStaking deployed to:", pentagon.address)

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
