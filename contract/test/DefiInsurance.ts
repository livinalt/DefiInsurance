import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("DefiInsurance", function () {
  
  async function deployDefiInsuranceFixture() {
    
    const [owner, otherAccount] = await ethers.getSigners();

    const DefiInsurance = await ethers.getContractFactory("DefiInsurance");
    const defiInsurance = await DefiInsurance.deploy();

    return { defiInsurance, owner, otherAccount };
  }

  describe("Deployment", function () {
   
    it("Should set the right owner", async function () {
      const { defiInsurance, owner } = await loadFixture(deployDefiInsuranceFixture);

      expect(await defiInsurance.owner()).to.equal(owner.address);
    });

  });

  describe("Pay premium", function () {
   
    it("Should check if wallet has been insured", async function () {
      const { defiInsurance, owner, otherAccount } = await loadFixture(deployDefiInsuranceFixture);
      const insuredWallet = owner.address;
      expect(await defiInsurance.owner()).to.equal( insuredWallet).to.be.revertedWith("This Wallet is already insured");
    });

    it("Deposit premium into DeFi scheme", async function () {
      const { defiInsurance, owner, otherAccount } = await loadFixture(deployDefiInsuranceFixture);
      const depositAmount = await ethers.parseUnits("0.00000000000005", 18);
      const depositTx = await defiInsurance.payWalletPremium(depositAmount, owner.address);
      await depositTx.wait();
      // const policy = await ethers.parseEther("0.000000000000000001");
      const AaccountBalance = await ethers.parseUnits("0",18);
      const newAaccountBalance = await ethers.parseUnits("0.000000000002",18);
      const balance = newAaccountBalance - AaccountBalance;

      // await balance.await();
      expect(depositTx).to.be.equal(balance);
    });
    
  });

  describe("Get Insured Wallet Balance", function () {
   
    it("Get the balance related to Crypto Wallet Insurance", async function () {
      const { defiInsurance, owner } = await loadFixture(deployDefiInsuranceFixture);
      expect(await defiInsurance.getWalletInsuranceBalance());
    });

  });
  
   
    // it("Should validate if wallet is insured", async function () {
    //   const { defiInsurance, owner, otherAccount } = await loadFixture(deployDefiInsuranceFixture);
    //   const insuredWallet = await otherAccount.address;
    //   expect(await defiInsurance.owner()).to.equal( insuredWallet).to.be.revertedWith("Wallet is not insured");
    // });

    // it("Should fail if the unlockTime is not in the future", async function () {
    //   const defiInsurance = await ethers.getContractFactory("DefiInsurance");
    //   const unlockTime = 2000;
    //   const blocktime = 4000;
    //   await expect(blocktime).to.equal(unlockTime).to.be.revertedWith(
    //     "Policy has expired"
    //   );
    // });

    // it("Withdraw claim from premium from DeFi scheme", async function () {
    //   const { defiInsurance, owner, otherAccount } = await loadFixture(deployDefiInsuranceFixture);
    //   const claim = await ethers.parseUnits("20", 18);
    //   // await depositTx.await();
    //   expect(await defiInsurance.submitWalletClaim()).to( withdraw(claim));
    // });
   
    
    // it("Withdraw claim from premium from DeFi scheme", async function () {
    //   const { defiInsurance, owner, otherAccount } = await loadFixture(deployDefiInsuranceFixture);
    //   const claim = await ethers.parseEther("20");
    //   // await depositTx.await();
    //   expect(await defiInsurance.payWalletPremium(claim)).to.equal( claim);
    // });

  

  // describe("Pay Premium and select Policy type", function () {
   
  //   it("Get the balance related to Crypto Wallet Insurance", async function () {
  //     const { defiInsurance, owner } = await loadFixture(deployDefiInsuranceFixture);
  //     expect(await defiInsurance.getWalletInsuranceBalance());
  //   });

  // });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { lock } = await loadFixture(deployOneYearLockFixture);

  //       await expect(lock.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime);

  //       // We use lock.connect() to send a transaction from another account
  //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).not.to.be.reverted;
  //     });
  //   });

  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { lock, unlockTime, lockedAmount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw())
  //         .to.emit(lock, "Withdrawal")
  //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //     });
  //   });

  //   describe("Transfers", function () {
  //     it("Should transfer the funds to the owner", async function () {
  //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).to.changeEtherBalances(
  //         [owner, lock],
  //         [lockedAmount, -lockedAmount]
  //       );
  //     });
  //   });
  // });
});
