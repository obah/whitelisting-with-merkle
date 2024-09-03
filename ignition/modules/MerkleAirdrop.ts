import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MERKLE_ROOT =
  "0xdf09421d713e44d31c6bd9639e3c7eebd4d35bdd4282e1f3063ea891a50a4744";
const TOKEN_ADDRESS = "";
const DURATION = 7 * 24 * 60 * 60;

const MerkleAirdropModule = buildModule("MerkleAirdrop", (m) => {
  const MerkleAirdrop = m.contract("MerkleToken", [
    MERKLE_ROOT,
    TOKEN_ADDRESS,
    DURATION,
  ]);

  return { MerkleAirdrop };
});

export default MerkleAirdropModule;

// const LockModule = buildModule("LockModule", (m) => {
//   const unlockTime = m.getParameter("unlockTime", JAN_1ST_2030);
//   const lockedAmount = m.getParameter("lockedAmount", ONE_GWEI);

//   const lock = m.contract("Lock", [unlockTime], {
//     value: lockedAmount,
//   });

//   return { lock };
// });

// export default LockModule;
