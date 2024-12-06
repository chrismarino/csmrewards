const ethers = require('ethers');
const fs = require('fs');
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
  const moduleContractAddress = process.env.CSMODULE_CONTRACT_ADDRESS;
  
  // Load the ABI from the JSON file
  const bondCoreAbiPath = path.resolve(__dirname, 'interfaces/ICSBondCore.json');
  const bondCurveAbiPath = path.resolve(__dirname, 'interfaces/ICSBondCurve.json');
  const accountingAbi = JSON.parse(fs.readFileSync(bondCoreAbiPath, 'utf8'));
  const moduleContractABI = JSON.parse(fs.readFileSync(bondCurveAbiPath, 'utf8'));

  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const accountingContract = new ethers.Contract(accountingContractAddress, accountingAbi, provider);
  const moduleContract = new ethers.Contract(moduleContractAddress, moduleContractABI, provider);

  try {
    const current = await accountingContract.getBondShares(nodeOperatorID);
    const curve = await accountingContract.getBondCurve(nodeOperatorID);
    const curveID = await accountingContract.getBondCurveId(nodeOperatorID);
    const lockedBond = await accountingContract.getActualLockedBond(nodeOperatorID);
    const nonWithdrawnKeys = await moduleContract.getNodeOperatorNonWithdrawnKeys(nodeOperatorID);

    // Convert parameters to uint256 using ethers.BigNumber
    const nonWithdrawnKeysUint256 = ethers.BigNumber.from(nonWithdrawnKeys);
    const curveIDUint256 = ethers.BigNumber.from(curveID);

    // Specify the exact function signature to avoid ambiguity
    const amountbyKeyCount = await accountingContract["getBondAmountByKeysCount(uint256,uint256)"](nonWithdrawnKeysUint256, curveIDUint256);
    const getSharesByEth = amountbyKeyCount.add(lockedBond);

    console.log("current: ", current);
    console.log("curve: ", curve);
    console.log("lockedBond: ", lockedBond);
    console.log("nonWithdrawnKeys: ", nonWithdrawnKeys);
    console.log("getSharesByEth: ", getSharesByEth);

    let claimableSharesBigInt = ethers.BigNumber.from(claimableShares).toString();
    const claimableEth = Number(claimableSharesBigInt) / 1e18; // Convert to ETH

    console.log("claimableEth: ", claimableEth);
    console.log("totalBond: ", totalBond);
    return;
  } catch (error) {
    console.error('Error fetching claimable bond shares:', error);
    return { error: 'Error fetching claimable bond shares' };
  }
};

module.exports = { getClaimableBondShares };