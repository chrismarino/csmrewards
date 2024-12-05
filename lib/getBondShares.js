const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

const getBondShares = async (nodeOperatorID) => {


  if (!nodeOperatorID) {
    return { error: 'nodeOperatorID is required' };
  }

  // Replace with your contract address and ABI
  const contractAddress = process.env.CSACCOUNTING_CONTRACT_ADDRESS;
  
  // Load the ABI from the JSON file
  const abiPath = path.resolve(process.cwd(), 'contracts/CSBondCore.json');
  const contractABI = JSON.parse(fs.readFileSync(abiPath, 'utf8')).abi;

  // Create a provider instance using the provided example
  const providerRPC = {
    dev: {
      name: 'development',
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
    //const claimableShares = await contract.getBondShares(address);
    const claimableShares = await contract.getBond(nodeOperatorID);
    let claimableSharesBigInt = (ethers.toBigInt(claimableShares)).toString();
    const claimableEth = Number(claimableSharesBigInt)/1e18; // Convert to ETH

    //console.log("claimableEth: ", claimableEth);
    return { claimableShares: claimableEth.toString() };
  } catch (error) {
    console.error('Error fetching claimable bond shares:', error);
    return { error: 'Error fetching claimable bond shares' };
  }
};

module.exports = { getBondShares };