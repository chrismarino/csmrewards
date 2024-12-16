// csmrewards.js
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const { getCumulativeFeeShares } = require("./lib/getCumulativeFeeShares");
const { getDistributedShares } = require("./lib/getDistributedShares");
const { getPooledEthByShares } = require("./lib/getPooledEthByShares");
const { getTotalBond } = require("./lib/getTotalBond");
const { getExcessBondShares } = require("./lib/getExcessBondShares");

// Get the GitHub URL and rewards proof file from environment variables
const githubUrl = process.env.GITHUB_URL;
const rewardsProofFile = process.env.REWARDS_PROOF_FILE;
const proofUrl = githubUrl + rewardsProofFile;

// Main function to handle the logic
async function csmrewards(nodeOperatorID) {
  if (!nodeOperatorID) {
    console.error("Please provide a nodeOperatorID as a command line argument.");
    process.exit(1);
  }
// Get the cumulative fees from the github proof file.
  const cumulativeFeeShares = await getCumulativeFeeShares(nodeOperatorID);
  const totalRewardsEth = await getPooledEthByShares(cumulativeFeeShares.cumulativeFeeShares);
  const excessBondShares = await getExcessBondShares(nodeOperatorID);
  const totalClaimableRewardsEth = await getPooledEthByShares(excessBondShares.excessBondShares);
  const totalRequiredBond = await getPooledEthByShares(excessBondShares.requiredBondShares);
  const distributedEth = await getDistributedShares(nodeOperatorID);
  console.log("Keys:", excessBondShares.keys);
  console.log("Total Required Bond:", totalRequiredBond.toFixed(4));
  console.log("Total Eth Rewards:", totalRewardsEth.toFixed(4));
  console.log("Excess Bond:", totalClaimableRewardsEth.toFixed(4));
  console.log("Total Distributed Eth:", (distributedEth ?? 0).toFixed(4));
  console.log("Total Node Operator Eth:", (totalRequiredBond + totalRewardsEth + totalClaimableRewardsEth).toFixed(4));
}

// Export the functions
module.exports = { csmrewards};

// If the script is run directly, call the csmrewards function with the command line argument
if (require.main === module) {
  const nodeOperatorID = process.argv[2];
  csmrewards(nodeOperatorID).catch(error => {
    console.error(error);
    process.exit(1);
  });
}
