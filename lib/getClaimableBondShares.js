const ethers = require('ethers');
const fs = require('fs');
const { get } = require('http');
const path = require('path');

// Implement the logic to get the claimable bond shares
// uint256 current = CSBondCore.getBondShares(nodeOperatorId);
// uint256 required = _sharesByEth(
//     CSBondCurve.getBondAmountByKeysCount(CSM.getNodeOperatorNonWithdrawnKeys(nodeOperatorId), CSBondCurve.getBondCurve(nodeOperatorId)) 
//    + CSBondLock.getActualLockedBond(nodeOperatorId)
// );

const getClaimableBondShares = async (nodeOperatorID) => {


  if (!nodeOperatorID) {
    return { error: 'nodeOperatorID is required' };
  }

  // Replace with your contract address and ABI
  const accountingContractAddress = process.env.CSACCOUNTING_CONTRACT_ADDRESS;
  const moduleContractAddress = process.env.CSMODULE_CONTRACT_ADDRESS
  
  // Load the ABI from the JSON file
  const bondCoreAbiPath = path.resolve(process.cwd(), 'interfaces/ICSBondCore.json');
  const bondCurveAbiPath = path.resolve(process.cwd(), 'interfaces/ICSBondCurve.json');
  const bondLockAbiPath = path.resolve(process.cwd(), 'interfaces/ICSBondLock.json');

  const bondCoreContractABI = JSON.parse(fs.readFileSync(bondCoreAbiPath, 'utf8')).abi;
  const bondCurveContractABI = JSON.parse(fs.readFileSync(bondCurveAbiPath, 'utf8')).abi;
  const bondLockContractABI = JSON.parse(fs.readFileSync(bondLockAbiPath, 'utf8')).abi;

  // Combine the APIs into a single object
  const accountingAbi = [
    ...bondCoreContractABI,
    ...bondCurveContractABI,
    ...bondLockContractABI
  ];

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

  const accountingContract = new ethers.Contract(accountingContractAddress, accountingAbi, provider);
  const moduleContract = new ethers.Contract(moduleContractAddress, moduleContractABI, provider);


  try {

    const current = await accountingContract.getBondShares(nodeOperatorID);
    const curve = await accountingContract.getBondCurve(nodeOperatorID);
    const lockedBond = await accountingContract.getActualLockedBond(nodeOperatorID);
    const  nonWithdrawnKeys = await moduleContract.getNodeOperatorNonWithdrawnKeys(nodeOperatorID);



    const amountbyKeyCount = await accountingContract.getBondAmountByKeysCount["getBondAmountByKeysCount(uint256,(uint256[],uint256))"](nonWithdrawnKeys, curve);
    const getSharesByEth = (amountbyKeyCount + lockedBond);

    console.log("current: ", current);
    console.log("curve: ", curve);
    console.log("lockedBond: ", lockedBond);
    console.log("nonWithdrawnKeys: ", nonWithdrawnKeys);
    console.log("getSharesByEth: ", getSharesByEth);
    //const required = await moduleContract.getSharesByEth(curve + lockedBond);

    //const bondShares = await accountingContract.getClaimableBondShares(nodeOperatorID);
    //const totalBond = await contract.getBond(nodeOperatorID);
    let claimableSharesBigInt = (ethers.toBigInt(claimableShares)).toString();
    const claimableEth = Number(claimableSharesBigInt)/1e18; // Convert to ETH

    console.log("claimableEth: ", claimableEth);
    console.log("totalBond: ", totalBond);
    return;
  } catch (error) {
    console.error('Error fetching claimable bond shares:', error);
    return { error: 'Error fetching claimable bond shares' };
  }
};

module.exports = { getClaimableBondShares };