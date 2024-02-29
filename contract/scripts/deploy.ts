import { ethers } from "hardhat";

async function main() {
  
  const defiInsuranceFactory = await ethers.deployContract("DefiInsuranceFactory");
  await defiInsuranceFactory.waitForDeployment();
  
  const defiInsurance = await ethers.deployContract("DefiInsurance");
  await defiInsurance.waitForDeployment();

  console.log(
    `DefiInsuranceFactory contract has been deployed to ${defiInsuranceFactory.target}`
  );
  
  console.log(
    `DefiInsurance contract has been deployed to ${defiInsurance.target}`
  );
}

// Successfully verified contract DefiInsurance on the block explorer.
// https://sepolia.etherscan.io/address/0x47f516c99303eFA5D509218B049E0Ef9F148738f#code


// DefiInsuranceFactory contract has been deployed to 0x902E326FF5bFe7b764dB333Bb08D6e23B91edb78
// DefiInsurance contract has been deployed to 0x47f516c99303eFA5D509218B049E0Ef9F148738f


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
