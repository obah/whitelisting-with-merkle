import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";
import csv from "csv-parser";
import { IProofs, IRow } from "../types";

const values: string[][] = [];
fs.createReadStream("./assets/accounts.csv")
  .pipe(csv())
  .on("data", (row: IRow) => {
    values.push([row.address, row.amount]);
  })
  .on("end", () => {
    const tree = StandardMerkleTree.of(values, ["address", "uint256"]);
    console.log("Merkle Root:", tree.root);

    fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));

    const proofs: IProofs = {};

    try {
      const loadedTree = StandardMerkleTree.load(
        JSON.parse(fs.readFileSync("tree.json", "utf8"))
      );
      for (const [i, v] of loadedTree.entries()) {
        const proof: string[] = loadedTree.getProof(i);
        proofs[v[0]] = proof;
      }

      fs.writeFileSync("proofs.json", JSON.stringify(proofs, null, 2));
      console.log("All proofs have been saved to 'proofs.json'.");
    } catch (err) {
      console.error("Error reading or processing 'tree.json':", err);
    }
  })
  .on("error", (err) => {
    console.error("Error reading 'airdrop.csv':", err);
  });

//merkle root: 0x5e604f56fa243f867444fcacb07695a98a6a0ef48174f81e53276e6aaad78364
