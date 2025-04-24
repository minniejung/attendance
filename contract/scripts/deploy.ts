import { ethers } from "hardhat";
import { makeAbi } from "./abiGenerator";

async function main() {
  const forwarderContractName = "MeowForwarder";
  const tokenContractName = "MeowToken";
  const tokenSymbol = "MEOW";

  console.log(`Deploying contracts`);

  const forwarderContractFactory = await ethers.getContractFactory(
    forwarderContractName
  );
  const forwarder = await forwarderContractFactory.deploy(
    forwarderContractName
  );
  await forwarder.waitForDeployment();

  const tokenContractFactory =
    await ethers.getContractFactory(tokenContractName);
  const metaTxToken = await tokenContractFactory.deploy(
    tokenContractName,
    tokenSymbol,
    forwarder.target
  );
  await metaTxToken.waitForDeployment();

  console.log(`Contract deployed at: ${forwarder.target}`);
  await makeAbi(`${forwarderContractName}`, forwarder.target);

  console.log(`\nContract deployed at: ${metaTxToken.target}`);
  await makeAbi(`${tokenContractName}`, metaTxToken.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
