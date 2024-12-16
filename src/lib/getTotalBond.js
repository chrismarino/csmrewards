const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

const getTotalBond = async (nodeOperatorID) => {


  if (!nodeOperatorID) {
    return { error: 'nodeOperatorID is required' };
  }

  // Replace with your contract address and ABI
  const contractAddress = process.env.CSACCOUNTING_CONTRACT_ADDRESS;
  
  // Load the ABI from the JSON file
  const abiPath = path.resolve(process.cwd(), 'interfaces/ICSBondCore.json');
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
    const totalBond = await contract.getBond(nodeOperatorID);
    let totalBondBigInt = (ethers.toBigInt(totalBond)).toString();
    const totalBondEth = Number(totalBondBigInt)/1e18; // Convert to ETH

    //console.log("totalBond: ", totalBond);
    return totalBondEth;
  } catch (error) {
    console.error('Error fetching claimable bond shares:', error);
    return { error: 'Error fetching claimable bond shares' };
  }
};

module.exports = { getTotalBond };