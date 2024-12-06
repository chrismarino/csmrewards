const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

const getPooledEthShares = async (sharesAmount) => {


  if (!sharesAmount) {
    return { error: 'sharesAmount is required' };
  }

  // Replace with your contract address and ABI
  const proxyContractAddress = process.env.POOLED_ETH_SHARES__PROXY_CONTRACT;

  // Load the ABI from the JSON file
  const abiPath = path.resolve(process.cwd(), 'interfaces/pooledEthSharesImp.abi.json');
  //const contractABI = JSON.parse(fs.readFileSync(abiPath, 'utf8')).abi;
  const pooledEthSharesProxyContractABI = fs.readFileSync(abiPath, 'utf8');

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

  const contract = new ethers.Contract(proxyContractAddress, pooledEthSharesProxyContractABI, provider);

  try {
    //console.log(`Fetching distributed shares for sharesAmount: ${sharesAmount}`);
    const bigIntSharesAmount = BigInt(sharesAmount);
    const pooledEthShares = await contract.getPooledEthByShares(bigIntSharesAmount);
    let pooledEthSharesBigInt = (ethers.toBigInt(pooledEthShares)).toString();
    const pooledEth = Number(pooledEthSharesBigInt) / 1e18; // Convert to ETH

    //console.log("pooledEth: ", pooledEth);
    return pooledEth;
  } catch (error) {
    console.error('Error fetching pooledEthShares:', error);
    return { error: 'Error fetching pooledEthShares' };
  }
};

module.exports = { getPooledEthShares };