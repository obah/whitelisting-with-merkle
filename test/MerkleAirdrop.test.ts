import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("Airdrop", function () {
  async function deployMerkleToken() {
    const [owner] = await hre.ethers.getSigners();
    const merkleTokenFactory = await hre.ethers.getContractFactory(
      "MerkleToken"
    );
    const token = await merkleTokenFactory.deploy();

    return { token, owner };
  }

  async function deployMerkleAirdrop() {
    const [owner, otherUser] = await hre.ethers.getSigners();
    const merkleAirdropFactory = await hre.ethers.getContractFactory(
      "MerkleAirdrop"
    );

    const merkleRoot =
      "0x5e604f56fa243f867444fcacb07695a98a6a0ef48174f81e53276e6aaad78364";
    const duration = 360; //5 minutes
    const { token } = await loadFixture(deployMerkleToken);

    const merkleAirdrop = await merkleAirdropFactory.deploy(
      token,
      merkleRoot,
      duration
    );

    return { merkleAirdrop, merkleRoot, token, owner, otherUser };
  }

  describe("MerkleToken", () => {
    it("Should mint the 2 Million tokens to the deployer", async () => {
      const { token, owner } = await loadFixture(deployMerkleToken);

      const initialAmount = ethers.parseUnits("2000000", 18);

      expect(await token.balanceOf(owner)).to.equal(initialAmount);
    });
  });

  describe("MerkleAirdrop", () => {
    it("Should deploy correctly with the right constructor arguments set the correct merkle root", async () => {
      const { merkleAirdrop, merkleRoot, token, owner } = await loadFixture(
        deployMerkleAirdrop
      );

      expect(await merkleAirdrop.merkleRoot()).to.equal(merkleRoot);
      expect(await merkleAirdrop.TOKENADDRESS()).to.equal(token);
      expect(await merkleAirdrop.OWNER()).to.equal(owner);
    });

    it("should give airdrop to eligible contracts", async () => {
      const { merkleAirdrop, merkleRoot, otherUser, token } = await loadFixture(
        deployMerkleAirdrop
      );

      await merkleAirdrop.connect(otherUser).claimAirdrop([merkleRoot]);

      const aridropAmount = ethers.parseUnits("1000", 18);

      expect(await token.balanceOf(otherUser)).to.greaterThanOrEqual(
        aridropAmount
      );
    });

    it("should only give airdrop to an account once", async () => {});

    it("should not give airdrop to illegible accounts", async () => {});

    it("should not give airdrop after duration has ended", async () => {});

    it("should allow owner withdraw", async () => {});

    it("should not allow other accounts withdraw", async () => {});
  });
});
