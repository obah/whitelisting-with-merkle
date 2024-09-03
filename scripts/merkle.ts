import { MerkleTree } from "merkletreejs";
import fs from "fs";
import keccak256 from "keccak256";

const hashEntry = (address: string, amount: string): string => {
  console.log(address);
  return keccak256(address + amount).toString();
};

function readCSV(filename: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(
          data
            .split("\n")
            .slice(1)
            .map((line) => line.split(","))
        );
      }
    });
  });
}

async function main() {
  const filePath = "./assets/accounts.csv";
  const entries: any = await readCSV(filePath);

  const hashedEntries = entries.map((entry: string[]) =>
    hashEntry(entry[0], entry[1])
  );

  const merkleTree = new MerkleTree(hashedEntries, keccak256, {
    sortPairs: true,
  });

  const merkleRoot = merkleTree.getHexRoot();
  console.log("Merkle root:", merkleRoot);
}

main();

//Merkle root: 0xdf09421d713e44d31c6bd9639e3c7eebd4d35bdd4282e1f3063ea891a50a4744
