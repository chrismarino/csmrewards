// csmrewards.js
const axios = require("axios");
const dotenv = require("dotenv");
const { getCumulativeFeeShares } = require("./lib/getCumulativeFeeShares");
const { getDistributedShares } = require("./lib/getDistributedShares");
const { getPooledEthShares } = require("./lib/getPooledEthShares");
const { getTotalBond } = require("./lib/getTotalBond");
const { getClaimableBondShares } = require("./lib/getClaimableBondShares");
const getEtherscanData = require("./lib/getEtherscanData");

// Load environment variables from .env file
dotenv.config();

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

  //console.log(`Cumulative Fee Shares:`, cumulativeFeeShares);
  const totalRewardsEth = await getPooledEthShares(cumulativeFeeShares.cumulativeFeeShares);
  console.log(`Total Eth Rewards:`, totalRewardsEth);

  // const claimableBondShares = await getClaimableBondShares(nodeOperatorID);
  // console.log(`Total Claimable Bond Shares:`, claimableBondShares);

  const distributedEth = await getDistributedShares(nodeOperatorID);
  console.log(`Total Distributed Eth:`, distributedEth ?? 0);

  const totalBondEth = await getTotalBond(nodeOperatorID);
  console.log(`Total Bond Eth:`, totalBondEth);


}

// Export the functions
module.exports = {
  csmrewards,
  getPooledEthShares,
  getDistributedShares,
  getTotalBond
};

// If the script is run directly, call the csmrewards function with the command line argument
if (require.main === module) {
  const nodeOperatorID = process.argv[2];
  csmrewards(nodeOperatorID).catch(error => {
    console.error(error);
    process.exit(1);
  });
}