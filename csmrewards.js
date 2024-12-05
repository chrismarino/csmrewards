// csmrewards.js
const axios = require("axios");
const dotenv = require("dotenv");
const { getCumulativeFeeShares } = require("./lib/getCumulativeFeeShares");

// Load environment variables from .env file
dotenv.config();

// Get the GitHub URL and rewards proof file from environment variables
const githubUrl = process.env.GITHUB_URL;
const rewardsProofFile = process.env.REWARDS_PROOF_FILE;
const proofUrl = githubUrl + rewardsProofFile;

// Main function to handle the logic
async function main() {
  const nodeOperatorID = process.argv[2];
  if (!nodeOperatorID) {
    console.error("Please provide a nodeOperatorID as a command line argument.");
    process.exit(1);
  }

  const result = await getCumulativeFeeShares(nodeOperatorID);
  if (result) {
    console.log(`Returned data:`, result);
  }
}

// Call the main function
main();