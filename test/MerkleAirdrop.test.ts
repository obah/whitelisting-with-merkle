import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Airdrop", function () {
  // Fixture for deploying the Web3CXI token contract
  async function deployTokenFixture() {
    // Get the first signer (account) as the owner
    const [owner] = await hre.ethers.getSigners();

    // Deploy the ERC20 token contract (Web3CXI)
    const erc20Token = await hre.ethers.getContractFactory("Web3CXI");
    const token = await erc20Token.deploy();

    // Return the deployed token contract and owner
    return { token, owner };
  }

  // Fixture for deploying the MerkleDrop contract
  async function delpoymerkleDropFixture() {
    // Load the token fixture to get the deployed token contract
    const { token } = await loadFixture(deployTokenFixture);

    // Get three signers: owner, other, and acct1
    const [owner, other, acct1] = await hre.ethers.getSigners();

    // Predefined Merkle root to use in the MerkleDrop contract generated using the createMerkleproof.js
    const merkleRoot =
      "0xdad72816f97715084a191a6a826bd9f1fad5ea7bf96dc7a9111319c6302a635b";

    // Deploy the MerkleDrop contract with the token address and Merkle root
    const merkleDrop = await hre.ethers.getContractFactory("MerkleDrop");
    const merkleDropAddress = await merkleDrop.deploy(token, merkleRoot);

    // Return the deployed contracts and other relevant data
    return { token, owner, other, merkleDropAddress, merkleRoot, acct1 };
  }

  // Tests for the Web3CXI token deployment
  describe("Web3CXI Deployment", function () {
    it("Should mint the right 1 Million tokens", async function () {
      // Load the token fixture
      const { token } = await loadFixture(deployTokenFixture);

      // Define the expected total supply (1 million tokens with 18 decimals)
      const tokents = ethers.parseUnits("1000000", 18);

      // Assert that the total supply is correct
      await expect(await token.totalSupply()).to.equal(tokents);
    });
  });

  // Tests for the MerkleDrop contract deployment
  describe("MerkleDrop Deployment", function () {
    it("Should set the correct Merkle root", async function () {
      // Load the MerkleDrop fixture
      const { token, owner, merkleDropAddress, merkleRoot } = await loadFixture(
        delpoymerkleDropFixture
      );

      // Assert that the Merkle root is set correctly in the contract
      await expect(await merkleDropAddress.merkleRoot()).to.equal(merkleRoot);
    });

    it("Should set the correct token address", async function () {
      // Load the MerkleDrop fixture
      const { token, merkleDropAddress } = await loadFixture(
        delpoymerkleDropFixture
      );

      // Assert that the token address is correctly set in the MerkleDrop contract
      await expect(token).to.equal(await merkleDropAddress.tokenAddress());
    });

    it("Should have the correct owner", async function () {
      // Load the MerkleDrop fixture
      const { owner, merkleDropAddress } = await loadFixture(
        delpoymerkleDropFixture
      );

      // Assert that the owner address is correctly set in the MerkleDrop contract
      await expect(owner.address).to.equal(await merkleDropAddress.owner());
    });
  });

  // Tests for the airdrop function in the MerkleDrop contract
  describe("Airdrop function", function () {
    it("Should claim airdrop", async function () {
      // Load the MerkleDrop fixture
      const { token, owner, merkleDropAddress, merkleRoot, acct1 } =
        await loadFixture(delpoymerkleDropFixture);

      // Define the total amount of tokens (1 million tokens with 18 decimals)
      const tokents = ethers.parseUnits("1000000", 18);

      // Transfer the tokens to the MerkleDrop contract to fund the airdrop
      await token.transfer(merkleDropAddress, tokents);

      // Define the proof and the amount to claim (20 tokens) generated using the createMerkleproof.js
      const proof = [
        "0x5d76a71bd6d384317c384db87cc35e7b1b49606ffaca4572af7f37d037120a72",
        "0x5f8f6140f4928eb94c6d333b9942fe8199178ea0f1337b43970a92677153a18b",
        "0xc4b85746a83f0dd6a03a4b18b22c8ecb5fc810be93e7123b2e11fdabc5de05fc",
      ];
      const amount = ethers.parseUnits("20", 18);

      // Claim the airdrop using the proof and amount
      await merkleDropAddress.connect(acct1).claimAirDrop(proof, 1n, amount);

      // Assert that the account has received the correct amount of tokens
      await expect(await token.balanceOf(acct1.address)).to.equal(amount);
    });
  });
});

// describe("Lock", function () {
//   // We define a fixture to reuse the same setup in every test.
//   // We use loadFixture to run this setup once, snapshot that state,
//   // and reset Hardhat Network to that snapshot in every test.
//   async function deployOneYearLockFixture() {
//     const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
//     const ONE_GWEI = 1_000_000_000;

//     const lockedAmount = ONE_GWEI;
//     const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

//     // Contracts are deployed using the first signer/account by default
//     const [owner, otherAccount] = await hre.ethers.getSigners();

//     const Lock = await hre.ethers.getContractFactory("Lock");
//     const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

//     return { lock, unlockTime, lockedAmount, owner, otherAccount };
//   }

//   describe("Deployment", function () {
//     it("Should set the right unlockTime", async function () {
//       const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

//       expect(await lock.unlockTime()).to.equal(unlockTime);
//     });

//     it("Should set the right owner", async function () {
//       const { lock, owner } = await loadFixture(deployOneYearLockFixture);

//       expect(await lock.owner()).to.equal(owner.address);
//     });

//     it("Should receive and store the funds to lock", async function () {
//       const { lock, lockedAmount } = await loadFixture(
//         deployOneYearLockFixture
//       );

//       expect(await hre.ethers.provider.getBalance(lock.target)).to.equal(
//         lockedAmount
//       );
//     });

//     it("Should fail if the unlockTime is not in the future", async function () {
//       // We don't use the fixture here because we want a different deployment
//       const latestTime = await time.latest();
//       const Lock = await hre.ethers.getContractFactory("Lock");
//       await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
//         "Unlock time should be in the future"
//       );
//     });
//   });

//   describe("Withdrawals", function () {
//     describe("Validations", function () {
//       it("Should revert with the right error if called too soon", async function () {
//         const { lock } = await loadFixture(deployOneYearLockFixture);

//         await expect(lock.withdraw()).to.be.revertedWith(
//           "You can't withdraw yet"
//         );
//       });

//       it("Should revert with the right error if called from another account", async function () {
//         const { lock, unlockTime, otherAccount } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         // We can increase the time in Hardhat Network
//         await time.increaseTo(unlockTime);

//         // We use lock.connect() to send a transaction from another account
//         await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
//           "You aren't the owner"
//         );
//       });

//       it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
//         const { lock, unlockTime } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         // Transactions are sent using the first signer by default
//         await time.increaseTo(unlockTime);

//         await expect(lock.withdraw()).not.to.be.reverted;
//       });
//     });

//     describe("Events", function () {
//       it("Should emit an event on withdrawals", async function () {
//         const { lock, unlockTime, lockedAmount } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         await time.increaseTo(unlockTime);

//         await expect(lock.withdraw())
//           .to.emit(lock, "Withdrawal")
//           .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
//       });
//     });

//     describe("Transfers", function () {
//       it("Should transfer the funds to the owner", async function () {
//         const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         await time.increaseTo(unlockTime);

//         await expect(lock.withdraw()).to.changeEtherBalances(
//           [owner, lock],
//           [lockedAmount, -lockedAmount]
//         );
//       });
//     });
//   });
// });
