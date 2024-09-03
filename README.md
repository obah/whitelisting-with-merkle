# MerkleAirdrop

---

The MerkleAirdrop project shows how to check wallet addresses for validity in an airdrop, add them to a whitelist for the airdrop and reward the addresses. It achieves this using a script [merkle.ts](https://github.com/obah/whitelisting-with-merkle/blob/main/scripts/merkle.ts)

## Table of Contents

- [Setup and Installation](#setup-and-installation)
- [Deploying the MerkleAirdrop Contract](#deploying-the-merkleairdrop-contract)
- [Generate Merkle Proof](#generate-merkle-proof)

## Setup and Installation

### Prerequisites

Ensure you have the following installed:

- Node.js
- Hardhat

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/obah/whitelisting-with-merkle.git
   cd whitelisting-with-merkle
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Deploying the MerkleAirdrop Contract
The CSV file is found in the assets folder
1. Deploy the MerkleToken contract
   ```
   npx hardhat ignition "./ignition/modules/MerkleToken.ts"
   ```
   Use the address of the deployed token in the deploy script for MerkleAirdrop found in /ignition/modules/MerkleAirdrop.ts
2. Deploy the MerkleAirdrop contract
   ```
   npx hardhat ignition "./ignition/modules/MerkleAirdrop.ts"
   ```

## Generate Merkle Proof
The CSV file is found in the assets folder and can be replaced, and path updated in the Merkle.ts file found in scripts folder
run 
   ```
   npx hardhat run "./scripts/Merkle.ts"
   ```
   the merkple proof should be in the console
---
