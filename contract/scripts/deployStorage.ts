import { ethers } from "hardhat";
import { makeAbi } from "./abiGenerator";

async function main() {
  const contractName = "Storage";

  console.log(`Deploying contracts`);

  const storageContractFactory = await ethers.getContractFactory(contractName);
  const storage = await storageContractFactory.deploy();
  await storage.waitForDeployment();

  console.log(`Contract deployed at: ${storage.target}`);
  await makeAbi(`${contractName}`, storage.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
