import { ethers } from "hardhat";
import { makeAbi } from "./abiGenerator";

async function main() {
  const forwarderContractName = "MeowForwarder";
  const tokenContractName = "MeowToken";
  const tokenSymbol = "MEOW";
  const storageContractName = "Storage";

  console.log(`Deploying contracts...\n`);

  // forwarder contract
  const forwarderFactory = await ethers.getContractFactory(
    forwarderContractName
  );
  const forwarder = await forwarderFactory.deploy(forwarderContractName);
  await forwarder.waitForDeployment();

  console.log(`✅ ${forwarderContractName} deployed at: ${forwarder.target}`);
  await makeAbi(forwarderContractName, forwarder.target);

  // token with forwarder
  const tokenFactory = await ethers.getContractFactory(tokenContractName);
  const token = await tokenFactory.deploy(
    tokenContractName,
    tokenSymbol,
    forwarder.target
  );
  await token.waitForDeployment();

  console.log(`✅ ${tokenContractName} deployed at: ${token.target}`);
  await makeAbi(tokenContractName, token.target);

  // storage with forwarder
  const storageFactory = await ethers.getContractFactory(storageContractName);
  const storage = await storageFactory.deploy(forwarder.target);
  await storage.waitForDeployment();

  console.log(`✅ ${storageContractName} deployed at: ${storage.target}`);
  await makeAbi(storageContractName, storage.target);
}

main().catch((error) => {
  console.error("❌ Deployment error:", error);
  process.exitCode = 1;
});
