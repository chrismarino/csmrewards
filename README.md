# A node app that calculates the Node Operator Rewards.

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
    GITHUB_URL=<your_github_url>
    REWARDS_PROOF_FILE=<your_rewards_proof_file>
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