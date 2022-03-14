const { ethers } = require("hardhat");

const increaseTimestamp = async (increase) => {
  await ethers.provider.send('evm_increaseTime',  [increase]);
  await ethers.provider.send('evm_mine');
}

const increaseTimeTo = async (target) => {
  let now = (await ethers.provider.getBlock('latest')).timestamp;
  if (target < now)
    throw Error(
      `Cannot increase current time(${now}) to a moment in the past(${target})`
    );
  let diff = target - now;
  return increaseTimestamp(diff);
}

const latestTime = async () => {
  const block = await(ethers.provider.getBlock('latest'));
  return block.timestamp;
}

const duration = {
  seconds: function (val) {
    return val;
  },
  minutes: function (val) {
    return val * this.seconds(60);
  },
  hours: function (val) {
    return val * this.minutes(60);
  },
  days: function (val) {
    return val * this.hours(24);
  },
  weeks: function (val) {
    return val * this.days(7);
  },
  months: function (val) {
    return val * this.days(30);
  },
  years: function (val) {
    return val * this.days(365);
  },
};

module.exports = {
  increaseTimestamp,
  increaseTimeTo,
  latestTime,
  duration,
};
