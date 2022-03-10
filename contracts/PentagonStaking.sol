//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.9;
import "./FarmCoin.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "hardhat/console.sol";

contract PentagonStaking is Ownable {

	struct UserInfo {
		uint balances; // deposit amount
		uint lockTime; // Lock time lockTime>0 means locked.
		uint APY;
		uint lastUpdateTime; // Last Harvest Time
		uint rewards; // reward amount
	}

	event Deposited(address indexed user, uint256 amount);
	event Withdrawn(address indexed user, uint256 amount);
	event RewardPaid(address indexed user, uint256 reward);

	uint public noLockAPY = 10;
	uint public sixMonthLockAPY = 20;
	uint public oneYearLockAPY = 30;

	IERC20 public USDC;
	IERC20 public farmCoin;

	mapping(address => UserInfo) private users;
	uint private _totalSupply;

	constructor(address _farmCoin, address _usdc) {
		USDC = IERC20(_usdc); // ERC20 USDC
		farmCoin = IERC20(_farmCoin);
	}

	function balanceOf(address account) external view returns (uint256) {
    	return users[account].balances;
	}

	function earned(address account) public view returns (uint) {
		uint reward = (users[account].balances * users[account].APY * (block.timestamp - users[account].lastUpdateTime) / 365 days) + users[account].rewards;
		return reward;
	}

	modifier updateReward(address account) {
		if (account != address(0) && users[account].lockTime == 0) {
			users[account].rewards = earned(account);
			users[account].lastUpdateTime = block.timestamp;
		}
		_;
	}

	function depositUsdc(uint _amount, uint _type) external updateReward(msg.sender) {
		require(_amount > 0, "Cannot deposit 0");
		require(users[msg.sender].balances == 0, "Already deposited. Withdraw first");
		_totalSupply += _amount;
		if(_type == 0) {
			users[msg.sender].lockTime = 0;
			users[msg.sender].APY = noLockAPY;
		}
		else if(_type == 1) {
			users[msg.sender].lockTime = 183 days;
			users[msg.sender].APY = sixMonthLockAPY;
		}
		else if(_type == 2) {
			users[msg.sender].lockTime = 365 days;
			users[msg.sender].APY = oneYearLockAPY;
		}
		users[msg.sender].balances = _amount;
		users[msg.sender].lastUpdateTime = block.timestamp;
		USDC.transferFrom(msg.sender, address(this), _amount);
		emit Deposited(msg.sender, _amount);
	}

	function withdraw(uint _amount) external updateReward(msg.sender) {
		require(_amount > 0, "Cannot withdraw 0");
		require(_totalSupply >= _amount, "Not enough balance");
		require(users[msg.sender].balances >= _amount, "Not enough deposit amount");
		_totalSupply -= _amount;
		users[msg.sender].balances -= _amount;
		if(users[msg.sender].lockTime == 0) USDC.transfer(msg.sender, _amount);
		else USDC.transfer(msg.sender, _amount * 90 / 100);
		emit Withdrawn(msg.sender, _amount);
	}

	function getReward() external updateReward(msg.sender) {
		uint reward = users[msg.sender].rewards;
		if (reward > 0) {
			users[msg.sender].rewards = 0;
			farmCoin.transfer(msg.sender, reward);
			emit RewardPaid(msg.sender, reward);
		}
	}
}