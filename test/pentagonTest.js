const { expect } = require("chai");
const { ethers } = require("hardhat");
const zeroAddress = 0x0000000000000000000000000000000000000000

describe("Pentagon Finance Test", function () {
  let farm
  let pentagon
  let usdc
  before(async function () {
    accounts = await ethers.getSigners()
    const tUSDC = await ethers.getContractFactory("tUSDC")
    const FarmCoin = await ethers.getContractFactory("FarmCoin")
    const PentagonStaking = await ethers.getContractFactory("PentagonStaking")
    usdc = await tUSDC.deploy("100000000000000000000000000")
    farm = await FarmCoin.deploy("100000000000000000000000000")
    pentagon = await PentagonStaking.deploy(farm.address, usdc.address)
  })
  
  it("Mint tUSDC", async function () {
		await expect(usdc.transfer(accounts[1].address, "500000000000000000000000")).to.emit(usdc, 'Transfer');
    expect(await usdc.balanceOf(accounts[1].address)).to.equal("500000000000000000000000")

    await expect(usdc.transfer(accounts[2].address, "500000000000000000000000")).to.emit(usdc, 'Transfer');
    expect(await usdc.balanceOf(accounts[2].address)).to.equal("500000000000000000000000")
    
    await expect(usdc.transfer(accounts[3].address, "500000000000000000000000")).to.emit(usdc, 'Transfer');
    expect(await usdc.balanceOf(accounts[3].address)).to.equal("500000000000000000000000")

    await expect(farm.transfer(pentagon.address, "500000000000000000000000")).to.emit(farm, 'Transfer');
  })

  it("Check deposit", async function () {
    const depositAmount = "10000000000000000000";
    await usdc.connect(accounts[1]).approve(pentagon.address, depositAmount);
    await expect(pentagon.connect(accounts[1]).depositUsdc(depositAmount, 0)).emit(pentagon, "Deposited")
    expect(await pentagon.balanceOf(accounts[1].address)).to.equal(depositAmount)

    await usdc.connect(accounts[2]).approve(pentagon.address, depositAmount);
    await expect(pentagon.connect(accounts[2]).depositUsdc(depositAmount, 1)).emit(pentagon, "Deposited")
    expect(await pentagon.balanceOf(accounts[2].address)).to.equal(depositAmount)

  })

  it("Check getReward", async function () {
    // const provider = new ethers.providers.JsonRpcProvider();
    // console.log(await provider.getBlockNumber())

    await expect(pentagon.connect(accounts[1]).getReward()).emit(pentagon, "RewardPaid")
    await pentagon.connect(accounts[2]).getReward()

    expect(await farm.balanceOf(accounts[1].address)).not.equal(0)
    expect(await farm.balanceOf(accounts[2].address)).to.equal(0)

  })

  it("Check withdraw", async function () {
    const withdrawAmount = "10000000000000000000";
    await expect(pentagon.connect(accounts[1]).withdraw(withdrawAmount)).emit(pentagon, "Withdrawn")
    await expect(pentagon.connect(accounts[2]).withdraw(withdrawAmount)).emit(pentagon, "Withdrawn")

    expect(await usdc.balanceOf(accounts[1].address)).to.equal("500000000000000000000000")
    expect(await usdc.balanceOf(accounts[2].address)).to.equal("499999000000000000000000")
    
  })
});
