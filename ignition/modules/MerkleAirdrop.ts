import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MERKLE_ROOT =
  "0x5e604f56fa243f867444fcacb07695a98a6a0ef48174f81e53276e6aaad78364";
const TOKEN_ADDRESS = "0x7EC98659b285e5071030bF4Fbe2Cf5fE05EEb65D";
const DURATION = 7 * 24 * 60 * 60;

const MerkleAirdropModule = buildModule("MerkleAirdrop", (m) => {
  const MerkleAirdrop = m.contract("MerkleAirdrop", [
    TOKEN_ADDRESS,
    MERKLE_ROOT,
    DURATION,
  ]);

  return { MerkleAirdrop };
});

export default MerkleAirdropModule;
