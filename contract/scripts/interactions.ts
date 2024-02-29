import {ethers} from 'hardhat';

async function main() {

 
    const factorydefiAddress = "0x902E326FF5bFe7b764dB333Bb08D6e23B91edb78";

    const factoryDefi = await ethers.getContractAt("DefiInsuranceFactory", factorydefiAddress);
    const createWallet = await factoryDefi.createWalletInsurance();
    await createWallet.wait();
    console.log("-------------------------------------------------------------------------------");
    console.log("New Wallet Insurance Contrcat has been created");
    console.log("-------------------------------------------------------------------------------");

    const createLoanIn = await factoryDefi.createLoanInsurance();
    await createLoanIn.wait();
    console.log("-------------------------------------------------------------------------------");
    console.log("New Collateral Protection contract has been created");
    console.log("-------------------------------------------------------------------------------");

    const walletInsurance = await factoryDefi.getWalletInsuranceContracts();
    // await walletInsurance.wait();
    console.log("-------------------------------------------------------------------------------");
    console.log(`You can now view all wallets insurance contracts ${walletInsurance}`);
    console.log("-------------------------------------------------------------------------------");
    
    const loanInsurance = await factoryDefi.getWalletInsuranceContracts();
    // await walletInsurance.wait();
    console.log("-------------------------------------------------------------------------------");
    console.log(`You can now view all loan insurance contracts ${loanInsurance}`);
    console.log("-------------------------------------------------------------------------------");
    



    const defiAddress = "0x7b1a26554E1f0c51D107De59AA7E4c2fea2A0eE4";
    const DefiInsurance = await ethers.getContractAt("DefiInsurance", defiAddress);
   
    const loanAddress = "0x7b1a26554E1f0c51D107De59AA7E4c2fea2A0eE4";
    const depositAmount = await ethers.parseUnits("0.00000000000000005", 18);
    const withdrawAmount = await ethers.parseUnits("0.00000000000000002", 18);
    const loanPolicy = await ethers.parseEther("0.000000000000000001");
    const loanAmount = await ethers.parseUnits("2", 18);

    console.log("-------------------------------------------------------------------------------");

    const depositTx= await DefiInsurance.deposit(depositAmount, loanAddress);
    // await insureWallet.wait();
    console.log(`You have successfully deposited ${depositAmount}Eth to ${loanAddress}`);
    console.log("-------------------------------------------------------------------------------");

    const withdrawFunds = await DefiInsurance.withdraw(withdrawAmount, loanAddress);
    await withdrawFunds.wait();
    console.log(`You have withdrawn ${withdrawAmount}Eth from your account`);
    console.log("-------------------------------------------------------------------------------");

    const tx = await DefiInsurance.payWalletPremium(loanPolicy, loanAmount);
    await tx.wait();
    console.log(`Your wallet Premium is paid`);
    console.log("-------------------------------------------------------------------------------");
    
    
    const txn= await DefiInsurance.payLoanPremium(loanAddress,loanAmount,loanPolicy);
    await txn.wait();
    console.log(`You have paid your ${loanAmount} loan premium and have subscibed for Policy ${loanPolicy} level `);
    console.log("-------------------------------------------------------------------------------");

    const claimInsurance = await DefiInsurance.submitWalletClaim();
    await claimInsurance.wait();
    console.log(`You have claimed your Insurance`);
    console.log("-------------------------------------------------------------------------------");
   
    const InsuredBalance= await DefiInsurance.getLoanInsuranceBalance(loanAddress);
    // await insureWallet.wait();
    console.log(`Wallet insurance balance is ${InsuredBalance}`);
    console.log("-------------------------------------------------------------------------------"); 
    
   

    
    // const walletClaim= await DefiInsurance.submitWalletClaim();
    // await walletClaim.wait();
    // console.log(`Wallet is now insured`);
    // console.log("-------------------------------------------------------------------------------");

     // const accountBalance = await DefiInsurance.getUserBalance(loanAddress);
    // // await accountBalance.wait();
    // console.log(`Your account balance is ${accountBalance} from your account`);
    // console.log("-------------------------------------------------------------------------------");

    
}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });