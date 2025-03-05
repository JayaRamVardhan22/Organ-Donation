const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const OrganDonationRegistry = await hre.ethers.getContractFactory("OrganDonationRegistry");
  const organDonationRegistry = await OrganDonationRegistry.deploy();

  await organDonationRegistry.waitForDeployment();
  
  const address = await organDonationRegistry.getAddress();
  console.log("OrganDonationRegistry deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });