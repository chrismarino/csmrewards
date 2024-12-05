// csmrewards.js
const axios = require("axios");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Get the GitHub URL and rewards proof file from environment variables
const githubUrl = process.env.GITHUB_URL;
const rewardsProofFile = process.env.REWARDS_PROOF_FILE;
const proofUrl = githubUrl + rewardsProofFile;

// Make a request to GitHub API
async function getRewardsProof(proofUrl) {
  try {
    let proof = await axios.get(proofUrl);
    return proof.data;
  } catch (error) {
    console.error("Error making request to GitHub:", error);
    return null;
  }
}

// Function to get cumulativeFeeShares for a given nodeOperatorID
async function getCumulativeFeeShares(nodeOperatorID) {
  const data = await getRewardsProof(proofUrl);
  if (!data) {
    console.error("Failed to retrieve or parse data.");
    return null;
  }

  const operatorKey = `CSM Operator ${nodeOperatorID}`;
  
  if (data[operatorKey]) {
    const operatorData = data[operatorKey];
    console.log(`cumulativeFeeShares for ${operatorKey}:`, operatorData.cumulativeFeeShares);
    return { operatorKey, cumulativeFeeShares: operatorData.cumulativeFeeShares };
  } else {
    console.error(`No data found for ${operatorKey}`);
    return null;
  }
}

module.exports = { getCumulativeFeeShares };