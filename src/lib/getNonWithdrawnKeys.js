const ethers = require('ethers');
const fs = require('fs');
const { get } = require('http');
const path = require('path');
const {getSharesByPooledEth} = require('./getSharesByPooledEth');

// Implement the logic to get the claimable bond shares
// uint256 current = CSBondCore.getBondShares(nodeOperatorId);
// uint256 required = _sharesByEth(
//     CSBondCurve.getBondAmountByKeysCount(CSM.getNodeOperatorNonWithdrawnKeys(nodeOperatorId), CSBondCurve.getBondCurve(nodeOperatorId)) 
//    + CSBondLock.getActualLockedBond(nodeOperatorId)
// );

const getExcessBondShares = async (nodeOperatorID) => {


  if (!nodeOperatorID) {
    return { error: 'nodeOperatorID is required' };
  }

  // Replace with your contract address and ABI
  const accountingContractAddress = process.env.CSACCOUNTING_CONTRACT_ADDRESS;
  const moduleContractAddress = process.env.CSMODULE_CONTRACT_ADDRESS
  
  // Load the ABI from the JSON file


  const moduleAbiPath = path.resolve(process.cwd(), 'interfaces/ICSModule.json');
  const moduleContractABI = JSON.parse(fs.readFileSync(moduleAbiPath, 'utf8')).abi;

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

  const moduleContract = new ethers.Contract(moduleContractAddress, moduleContractABI, provider);


  try {


    const  nonWithdrawnKeys = await moduleContract.getNodeOperatorNonWithdrawnKeys(nodeOperatorID);

    const requiredBondShares = await getSharesByPooledEth((bondAmountByKeyCount + lockedBond), curve);
    //console.log(`Claimable Bond Shares. Current:`, current, "Required:", required);
    const excessBondShares = currentBondShares - BigInt(requiredBondShares);
    return  {keys:nonWithdrawnKeys , requiredBondShares, excessBondShares };
  } catch (error) {
    console.error('Error fetching claimable bond shares:', error);
    return { error: 'Error fetching claimable bond shares' };
  }
};

module.exports = { getExcessBondShares };