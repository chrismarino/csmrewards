# A node app that calculates the Node Operator Rewards.

## Contracts

Contract ABIs are produced by building the [community-staking-module](https://github.com/lidofinance/community-staking-module) and copying the following interface build artifacts. 
 * ICSBondCore.json
 * ICSBondCurve.json
 * ICSBondLock.json

These interfaces are combined into a single ABI to access all functions within the CSAccounting contract. CSModule has its own contract and its ABI is from the build artifacts.

 * ICSModule.json 
 
 These are necessary to reproduce the [getClaimableBondShares()](https://github.com/lidofinance/community-staking-module/blob/093a2a1e9e03a578abf74cb62bd8b53e159f513b/src/CSAccounting.sol#L596-L609) function.

## Functions

### getTotalBond(nodeOperatorID)

Returns the total Bond. Include any excess bond accumulated through daily rebasing.

### getClaimableBondShares(nodeOperatorID)

Recreates the private function [getClaimableBondShares()](https://github.com/lidofinance/community-staking-module/blob/093a2a1e9e03a578abf74cb62bd8b53e159f513b/src/CSAccounting.sol#L596-L609). 

```
            uint256 current = CSBondCore.getBondShares(nodeOperatorId);
            uint256 required = _sharesByEth(
                CSBondCurve.getBondAmountByKeysCount(
                    CSM.getNodeOperatorNonWithdrawnKeys(nodeOperatorId),
                    CSBondCurve.getBondCurve(nodeOperatorId)
                ) + CSBondLock.getActualLockedBond(nodeOperatorId)
            );
```

### getCumulativeFeeShares(proofURL)

Gets the values of the [CSM Rewards Proof](https://github.com/lidofinance/csm-rewards/blob/mainnet/proofs.json) for the Node Operator from GitHub.

### getDistributedShares(nodeOperatorID)

Returns the Eth distributed to the NO (not verified)

## Installation

1. **Clone the repository**:

    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Install dependencies**:

    ```sh
    npm install
    ```

3. **Create a `.env` file**:

    Create a `.env` file in the root directory of the project and add the following environment variables:

    ```env
    RPC_URL= <your_rpc_url>


    GITHUB_URL=https://raw.githubusercontent.com/
    REWARDS_PROOF_FILE=lidofinance/csm-rewards/refs/heads/mainnet/proofs.json



    CSACCOUNTING_CONTRACT_ADDRESS=0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da
    CSMODULE_CONTRACT_ADDRESS=0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F

    POOLED_ETH_SHARES__PROXY_CONTRACT=0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84
    DIST_SHARES_PROXY_CONTRACT=0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0



    ETHERSCAN_API_KEY= <your_etherscan_api_key>
    ETHERSCAN_URL=http://api.etherscan.io
    ```

## Running the App

1. **Run the app**:

    ```sh
    node csmrewards.js <nodeOperatorID>
    ```

    Replace `<nodeOperatorID>` with the ID of the node operator you want to query.

## Example

To run the app for node operator ID `5`, use the following command:
```sh
node csmrewards.js 5