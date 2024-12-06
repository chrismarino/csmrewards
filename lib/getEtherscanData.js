const axios = require("axios");
const appUrl = process.env.ETHERSCAN_URL;
const apiKey = process.env.ETHERSCAN_API_KEY;
const action = "/api?module=account&action=balance"
const apiEndpoint = appUrl + action
const getEtherscanData = async (contract) => {
  try {
    const contractDataPromises = contract.map(async (contract) => {
      const addressURL = `${apiEndpoint}&address=${contract.address}&tag=latest&apikey=${apiKey}`;
      const quantityResponse = await axios.get(addressURL);

      return {
        address: contract.address,
        description: contract.description,
        quantity: quantityResponse.data.result, // Assuming the balance is in the 'result' field
        value: quantityResponse.data.result * 0.000000000000000001, // Convert Wei to Ether if needed
      };
    });

    return Promise.all(contractDataPromises);
  } catch (error) {
    console.error("Error fetching contract data:", error);
    throw new Error("Failed to fetch contract data");
  }
};

module.exports = getEtherscanData;
