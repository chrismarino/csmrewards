const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

const getDistributedShares = async (nodeOperatorID) => {


  if (!nodeOperatorID) {
    return { error: 'nodeOperatorID is required' };
  }

  // Replace with your contract address and ABI
  const proxyContractAddress = process.env.DIST_SHARES_PROXY_CONTRACT;
  
  // Load the ABI from the JSON file
  const abiPath = path.resolve(process.cwd(), 'interfaces/distSharesImp.abi.json');
  const distSharesProxyContractABI = fs.readFileSync(abiPath, 'utf8');

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

  const contract = new ethers.Contract(proxyContractAddress, distSharesProxyContractABI, provider);

  try {
    //console.log(`Fetching distributed shares for nodeOperatorID: ${nodeOperatorID}`);
    const distributedShares = await contract.distributedShares(nodeOperatorID);
    let distributedSharesBigInt = (ethers.toBigInt(distributedShares)).toString();
    const distributedEth = Number(distributedSharesBigInt) / 1e18; // Convert to ETH

    //console.log("distributedEth: ", distributedEth);
    return distributedEth;
  } catch (error) {
    console.error('Error fetching claimable bond shares:', error);
    return { error: 'Error fetching claimable bond shares' };
  }
};

module.exports = { getDistributedShares };