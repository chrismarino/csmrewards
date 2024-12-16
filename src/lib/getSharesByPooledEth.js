const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

async function getSharesByPooledEth(sharesAmount, curve) {
  if (sharesAmount === undefined || sharesAmount === null) {
    return { error: 'sharesAmount is required' };
  }

  // Replace with your contract address and ABI
  const proxyContractAddress = process.env.POOLED_ETH_SHARES__PROXY_CONTRACT;

  // Load the ABI from the JSON file
  const abiPath = path.resolve(process.cwd(), 'interfaces/pooledEthSharesImp.abi.json');
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
    const bigIntSharesAmount = BigInt(sharesAmount);
    const pooledEthShares = await contract.getSharesByPooledEth(bigIntSharesAmount);


    return pooledEthShares;
  } catch (error) {
    console.error('Error fetching pooled ETH shares:', error);
    return { error: 'Error fetching pooled ETH shares' };
  }
}

module.exports = { getSharesByPooledEth };