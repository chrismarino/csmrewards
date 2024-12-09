const ethers = require("ethers");
const fs = require("fs");
const path = require("path");

const getRequiredBond = async (nodeOperatorID) => {
  if (!nodeOperatorID) {
    return { error: "nodeOperatorID is required" };
  }

  const contractAddress = process.env.CSACCOUNTING_CONTRACT_ADDRESS;

  // Load the ABI from the JSON file
  const abiPath = path.resolve(__dirname, "../interfaces/ICSBondCurve.json");
  const contractABI = JSON.parse(fs.readFileSync(abiPath, "utf8")).abi;

  // Create a provider instance using the provided example
  const providerRPC = {
    dev: {
      name: "development",
      rpc: process.env.RPC_URL,
      chainId: 1, // provider for mainnet
    },
  };

  const provider = new ethers.JsonRpcProvider(providerRPC.dev.rpc, {
    chainId: providerRPC.dev.chainId,
    name: providerRPC.dev.name,
  });

  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  try {
    const curveID = await contract.getBondCurveId(nodeOperatorID);

    console.log("curveId:", ethers.formatUnits(curveID, 0));

    const requiredBond = await contract[
      "getBondAmountByKeysCount(uint256,uint256)"
    ](nodeOperatorID, curveID);

    console.log("requiredBond:", ethers.formatEther(requiredBond));
  } catch (error) {
    console.error("Error fetching claimable bond shares:", error);
    return { error: "Error fetching claimable bond shares" };
  }
};

module.exports = { getRequiredBond };
