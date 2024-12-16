const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

const getKeys = async (nodeOperatorID, keyCount) => {
  if (!nodeOperatorID) {
    return { error: 'nodeOperatorID is required' };
  }

  // Replace with your contract address and ABI
  const moduleContractAddress = process.env.CSMODULE_CONTRACT_ADDRESS;
  const moduleAbiPath = path.resolve(process.cwd(), 'interfaces/ICSModule.json');
  const contractABI = JSON.parse(fs.readFileSync(moduleAbiPath, 'utf8')).abi;

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

  const contract = new ethers.Contract(moduleContractAddress, contractABI, provider);
  const startIndex = 0;
  const keys = [];

  try {
    for (let i = 0; i < keyCount; i++) {
      const key = await contract.getSigningKeys(nodeOperatorID, startIndex + i, 1);
      keys.push(key);
    }
    //console.log('keys:', keys);
    return keys;
  } catch (error) {
    console.error('Error fetching keys:', error);
    return { error: 'Error fetching keys' };
  }
};

module.exports = { getKeys };
