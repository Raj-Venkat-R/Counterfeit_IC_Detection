const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const ICRegistry = await ethers.getContractFactory("ICRegistry");
  const ic = await ICRegistry.deploy();
  await ic.waitForDeployment();

  const address = await ic.getAddress();
  console.log("ICRegistry deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
