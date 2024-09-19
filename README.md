# MerkleAirdrop

This repository contains the smart contracts source code, interaction scripts and unit test suites for MerkleAirdrop. The repository uses Hardhat as development environment for compilation, testing and deployment tasks.

## What is MerkleAirdrop

MerkleAirdrop implements the process of checking wallet addresses for validity in an airdrop, adds them to a whitelist for the airdrop and sends the reward to the addresses. It achieves this using the [MerkleAirdrop.sol](https://github.com/obah/whitelisting-with-merkle/blob/main/contracts/MerkleAirdrop.sol) and a script [merkle.ts](https://github.com/obah/whitelisting-with-merkle/blob/main/scripts/merkle.ts) to generate the root hash and proofs for all the eligible addresses.

## Contracts Documentation & Deployments

### [MerkleAirdrop.sol](https://github.com/obah/whitelisting-with-merkle/blob/main/contracts/MerkleAirdrop.sol)

The `MerkleAirdrop` contract facilitates a token airdrop using the Merkle Tree proof system to verify eligible participants. The contract distributes a predefined amount of tokens to eligible users who can claim the airdrop, provided they haven't claimed the aidrop already and meet the criteria based on the Merkle proof.

- Deployed address: 0xc270739b50d8ef6bEf63dd566e2393BD45825916
- [Lisk Sepolia Blockscout verification link](https://sepolia-blockscout.lisk.com/address/0xc270739b50d8ef6bEf63dd566e2393BD45825916#code)

Key features:

- `Merkle Tree Integration`: Ensures that only eligible participants, as per the Merkle root, can claim the airdrop.
- `ERC20 Token Compatibility`: Distributes ERC20 tokens via the airdrop.
- `One-time Claim`: Each eligible address can claim the airdrop only once.
- `Airdrop Expiration`: The airdrop has a set duration after which no further claims can be made.
- `Airdrop Balance Management`: Keeps track of available token balance for the airdrop.
- `Ownership Control`: Only the contract owner can perform administrative actions like updating the Merkle root or withdrawing leftover tokens.

Functions:

- `Constructor`: Initialise the contract with the ERC20 token address, merkle root and duration of airdrop.
- `claimAirdrop(bytes32[] memory _merkleProof)`: Allows eligible users to claim their airdrop if they provide a valid Merkle proof.
- `verifyProof(bytes32[] memory _proof, uint256 _amount, address _address)`: Verifies the provided Merkle proof against the stored Merkle root to ensure the claim is valid.
- `updateMerkleRoot(bytes32 _merkleRoot)`: Allows the owner to update the Merkle root.
- `withdraw(address _to)`: Allows the owner to withdraw the remaining tokens after the airdrop has ended.

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

## Test

To run the tests, use:

```
npx hardhat test
```

- To get merkle root and proofs, update `accounts.csv` in assets folder, with new addresses and amounts and run `npx hardhat run ./scripts/merkle.ts`

The tests include scenarios for token minting, MerkleDrop contract deployment, and claiming the airdrop.
