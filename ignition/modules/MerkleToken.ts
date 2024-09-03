import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MerkleTokenModule = buildModule("MerkleToken", (m) => {
  const merkleToken = m.contract("MerkleToken", []);

  return { merkleToken };
});

export default MerkleTokenModule;
