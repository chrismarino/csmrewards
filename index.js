// index.js
const csmrewards = require('./src/csmrewards');

if (require.main === module) {
  const nodeOperatorID = process.argv[2];
  if (!nodeOperatorID) {
    console.error("Please provide a nodeOperatorID as a command line argument.");
    process.exit(1);
  }

  csmrewards(nodeOperatorID)
    .then(result => {
      const { nodeOperatorID, keys, totalRequiredBond, totalRewardsEth, totalClaimableRewardsEth, distributedEth } = result;
      console.log("Node Operator ID:", nodeOperatorID);
      console.log("Keys:", keys);
      console.log("Total Required Bond:", totalRequiredBond.toFixed(4));
      console.log("Total Eth Rewards:", totalRewardsEth.toFixed(4));
      console.log("Excess Bond:", totalClaimableRewardsEth.toFixed(4));
      console.log("Total Distributed Eth:", (distributedEth ?? 0).toFixed(4));
      console.log("Total Node Operator Eth:", (totalRequiredBond + totalRewardsEth + totalClaimableRewardsEth).toFixed(4));
    })
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = csmrewards;