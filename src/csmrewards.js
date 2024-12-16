const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const { getCumulativeFeeShares } = require("./lib/getCumulativeFeeShares");
const { getDistributedShares } = require("./lib/getDistributedShares");
const { getPooledEthByShares } = require("./lib/getPooledEthByShares");
const { getExcessBondShares } = require("./lib/getExcessBondShares");
const { getKeys } = require("./lib/getKeys");

// Get the GitHub URL and rewards proof file from environment variables
const githubUrl = process.env.GITHUB_URL;
const rewardsProofFile = process.env.REWARDS_PROOF_FILE;
const proofUrl = githubUrl + rewardsProofFile;

// Main function to handle the logic
async function csmrewards(nodeOperatorID) {
  if (!nodeOperatorID) {
    throw new Error("nodeOperatorID is required");
  }

  // Get the cumulative fees from the github proof file.
  const cumulativeFeeShares = await getCumulativeFeeShares(nodeOperatorID);
  const totalRewardsEth = await getPooledEthByShares(cumulativeFeeShares.cumulativeFeeShares);
  const excessBondShares = await getExcessBondShares(nodeOperatorID);
  const totalClaimableRewardsEth = await getPooledEthByShares(excessBondShares.excessBondShares);
  const totalRequiredBond = await getPooledEthByShares(excessBondShares.requiredBondShares);
  const distributedEth = await getDistributedShares(nodeOperatorID);
  const keyCount = parseInt(excessBondShares.keys, 10);
  const keys = await getKeys(nodeOperatorID, keyCount);

  return {
    nodeOperatorID,
    keyCount,
    keys,
    distributedEth,
    totalClaimableRewardsEth,
    totalRequiredBond,
    totalRewardsEth,
  };
}

module.exports = csmrewards;