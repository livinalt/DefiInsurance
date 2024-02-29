// pages/index.tsx
import { useEffect, useState } from 'react';
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import contractABI from './abi.json';

export default function Home() {
  const contractAddress = "0x47f516c99303eFA5D509218B049E0Ef9F148738f";
  const abi = contractABI; 

  const [depositAmount, setDepositAmount] = useState(0);
  const [userAddress, setUserAddress] = useState("");
  const [userBalanceAddress, setUserBalanceAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [insuranceAddress, setInsuranceAddress] = useState("");
  const [collateralValue, setCollateralValue] = useState("");
  const [loanAddress, setLoanAddress] = useState("");
  const [walletPremiumPolicy, setWalletPremiumPolicy] = useState("0");
  const [paymentInsuAmount, setPaymentInsuAmount] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [loanInsuranceAddress, setLoanInsuranceAddress] = useState("");

  const [policyType, setPolicyType] = useState("0");

  const [provider, setProvider] = useState(null);
  const [initWalletLoader, setInitWalletLoader] = useState(false);
  const [depositLoader, setDepositLoader] = useState(false);
  const [withdrawLoader, setWithdrawLoader] = useState(false);
  const [userBalanceLoader, setUserBalanceLoader] = useState(false);
  const [walletInsuranceBalanceLoader, setWalletInsuranceBalanceLoader] = useState(false);
  const [claimInsuranceLoader, setClaimInsuranceLoader] = useState(false);
  const [payLoanPremiumLoader, setPayLoanPremiumLoader] = useState(false);
  const [payWalletPremiumLoader, setPayWalletPremiumLoader] = useState(false);
  const [loanInsuranceBalanceLoader, setLoanInsuranceBalanceLoader] = useState(false);
  const [claimLoanRequestLoader, setClaimLoanRequestLoader] = useState(false);
  


  async function initWallet() {
    try {
      setInitWalletLoader(true);
      if (typeof window.ethereum === 'undefined') {
        console.log("Please install a wallet extension like MetaMask.");
        alert("Please install a wallet extension like MetaMask.");
        return;
      }
      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider,
          },
        },
      });
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      setProvider(provider);
    } catch (error) {
      console.log(error);
    } finally {
      setInitWalletLoader(false);
    }
  }
  
  async function depositFunds() {
    try {
      setDepositLoader(true);
      if (!provider) return;
      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, signer);
      const txn = await smartContract.deposit(depositAmount, userAddress);
      await txn.wait();
      alert(`Successfully deposite ${depositAmount}`);
    } catch (error) {
      alert(error.message || "Error making deposit.");
    } finally {
      setDepositLoader(false);
    }
  }
  
  async function withdrawFunds() {
    try {
      setWithdrawLoader(true);
      if (!provider) return;
      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, signer);
      const txn = await smartContract.withdraw(withdrawAmount, withdrawAddress);
      await txn.wait();
      alert(`Successfully withdraw ${withdrawAmount}`);
    } catch (error) {
      alert(error.message || "Error making withdrawal.");
    } finally {
      setWithdrawLoader(false);
    }
  }
  
  async function userBalance() {
    try {
      setUserBalanceLoader(true);
      if (!provider) return;
      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, signer);
      // const txn = await smartContract.getUserBalance(userBalanceAddress);

      const balance = await smartContract.callStatic.getUserBalance(userBalanceAddress);
      
      // await txn.wait();
      alert(`Your balance is ${balance.toString()}`);

    } catch (error) {
      alert(error.message || "Error reading balance.");
    } finally {
      setUserBalanceLoader(false);
    }
  }
  
  async function readWalletInsuranceBalance() {
    try {
      setWalletInsuranceBalanceLoader(true);
      if (!provider) return;
      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, signer);
      const balance = await smartContract.callStatic.getWalletInsuranceBalance();
      // await txn.wait();
      alert(`Your balance is ${balance.toString()}`);
    }
      
      catch (error) {
      alert(error.message || "Error reading insurance balance.");
    } finally {
      setWalletInsuranceBalanceLoader(false);
    }
  }
  
  async function claimInsurance() {
    try {
      setClaimInsuranceLoader(true);
      if (!provider) return;
      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, signer);
      const txn = await smartContract.submitWalletClaim(loanAddress, collateralValue);
      await txn.wait();
      setClaimSuccess(true);
      setClaimError("");
    } catch (error) {
      alert(error.message || "Error claiming insurance.");
    } finally {
      setClaimInsuranceLoader(false);
    }
  }
  
  async function loanPayPremium() {
    try {
      setPayLoanPremiumLoader(true);
      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, signer);
      
      // Make sure paymentAmount is converted to the appropriate type if needed
      const amount = ethers.parseEther(paymentAmount.toString());
      const txn = await smartContract.payLoanPremium(loanAddress, amount, policyType, { gasLimit: 900000 });
      
      await txn.wait();
      alert("You have successfully paid your premium.");

    } catch (error) {
      console.log(error.message || "Error paying loan premium.");
    } finally {
      setPayLoanPremiumLoader(false);
    }
}

  
async function payWalletPremium() {
    try {
        setPayWalletPremiumLoader(true);

        if (!provider) return;
        const signer = provider.getSigner();
        const smartContract = new ethers.Contract(contractAddress, abi, signer);
        const amount = ethers.from(paymentAmount);
        const txn = await smartContract.payWalletPremium(walletPremiumPolicy, amount);
        
        await txn.wait();
        alert("You have successfully paid your wallet premium");
    } catch (error) {
        alert(error.message || "Error paying wallet premium.");
    } finally {
        setPayWalletPremiumLoader(false);
    }
}

  
  async function readLoanInsuranceBalance() {
    try {
        setLoanInsuranceBalanceLoader(true);
        if (!provider || !loanAddress) return;

        const signer = provider.getSigner();
        const smartContract = new ethers.Contract(contractAddress, abi, signer);
        const balance = await smartContract.callStatic.getLoanInsuranceBalance(loanAddress);

        alert(`Your Loan insurance balance is ${balance.toString()}`);
    } catch (error) {
        alert(error.message || "Error reading loan insurance balance.");
    } finally {
        setLoanInsuranceBalanceLoader(false);
    }
}

  
async function claimLoanRequest() {
  try {
      setClaimLoanRequestLoader(true);
      if (!provider) return;

      // Check if the loan is insured before submitting the claim
      const isInsured = await checkLoanInsurance(insuranceAddress);
      if (!isInsured) {
          alert("Error: Loan is not insured.");
          return;
      }

      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, signer);
      const txn = await smartContract.submitLoanClaim(insuranceAddress, collateralValue);

      await txn.wait();
      alert(`Loan request successful`);
  } catch (error) {
      alert(error.message || "Error claiming loan insurance.");
  } finally {
      setClaimLoanRequestLoader(false);
  }
}

async function checkLoanInsurance(loanAddress) {
  const signer = provider.getSigner();
  const smartContract = new ethers.Contract(contractAddress, abi, signer);
  return await smartContract.isLoanInsured(loanAddress);
}


  useEffect(() => {
    initWallet();
  }, []);

  return (
    <div className='m-6 space-y-8'>
      <h1 className="text-gray-700 text-3xl font-bold">
        Insurance Frontend Demo
      </h1>
  
      {/* DEPOSIT */}
      <hr />
      <div className='flex justify-between items-center'>
        <div>
          <h3 className='font-bold'>Deposit</h3>
          <label>Amount</label>
          <input
            className='border border-gray-500 mx-2'
            type="number"
            placeholder="Enter deposit Amount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />
          <label>Address</label>
          <input
            className='border border-gray-500 mx-2'
            type="text"
            placeholder="Enter address"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
          />
        </div>
        <button
          onClick={depositFunds}
          className='px-4 py-1 bg-slate-300 hover:bg-slate-500 transition-all'
          disabled={depositLoader}
        >
          {depositLoader ? "Depositing..." : "Deposit Funds"}
        </button>
      </div>
      <hr />
  
      {/* WITHDRAW */}
      <div className='flex justify-between items-center'>
        <div>
          <h3 className='font-bold'>Withdraw</h3>
          <label>Amount</label>
          <input
            className='border border-gray-500 mx-2'
            type="number"
            placeholder="Enter withdraw Amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
          />
          <label>Address</label>
          <input
            className='border border-gray-500 mx-2'
            type="text"
            placeholder="Enter address"
            value={withdrawAddress}
            onChange={(e) => setWithdrawAddress(e.target.value)}
          />
        </div>
        <button
          onClick={withdrawFunds}
          className='px-4 py-1 bg-slate-300 hover:bg-slate-500 transition-all'
        >
          Withdraw Funds
        </button>
      </div>
      <hr />
  
      {/* BALANCES */}
      <div className='flex justify-between items-center'>
        <h2 className='font-bold'>Wallet Insurance Balance</h2>
        <button
          className='px-4 py-1 bg-slate-300 hover:bg-slate-500 transition-all'
          onClick={readWalletInsuranceBalance}
        >
          Check Balance
        </button>
      </div>
      <div className='flex justify-between items-center'>
        <h4>User balance: <span className='font-bold'>{/* `${UserBalance}` */}</span></h4>
        <div>
          <label>Address</label>
          <input
            className='border border-gray-500 mx-2'
            type="text"
            placeholder="Enter your address"
            value={userBalanceAddress}
            onChange={(e) => setUserBalanceAddress(e.target.value)}
          />
        </div>
        <button
          onClick={userBalance}
          className='px-4 py-1 bg-slate-300 hover:bg-slate-500 transition-all'
        >
          Checking balance
        </button>
      </div>
      <hr />
  
      {/* LOAN INSURANCE BALANCE */}
      <div className='flex items-center'>
        <h3 className='font-bold'>Loan Insurance Balance</h3>
        <input
          className='border border-gray-500 mx-2'
          type="text"
          placeholder="Enter address"
          value={loanInsuranceAddress}
          onChange={(e) => setLoanInsuranceAddress(e.target.value)}
        />
        <button
          onClick={readLoanInsuranceBalance}
          className='px-4 py-1 bg-slate-300 hover:bg-slate-500 transition-all'
        >
          Check Balance
        </button>
      </div>
      <hr />
  
      {/* PAY WALLET PREMIUM */}
      <div className='flex justify-between items-center'>
        <h2 className='font-bold'>Wallet Premium</h2>
        <div>
          <label>Policy Type</label>
          <select
            className='border border-gray-500 mx-2'
            value={walletPremiumPolicy}
            onChange={(e) => setWalletPremiumPolicy(e.target.value)}
          >
            <option value="0">Basic</option>
            <option value="1">Partial</option>
            <option value="2">Advanced</option>
          </select>
        </div>
        <div>
          <label>Amount</label>
          <input
            className='border border-gray-500 mx-2'
            type="number"
            placeholder="Loan Amount"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
          />
        </div>
        <button
          onClick={payWalletPremium}
          className='px-4 py-1 bg-slate-300 hover:bg-slate-500 transition-all'
        >
          Pay Premium
        </button>
      </div>
      <hr />
  
      {/* PAY LOAN PREMIUM */}
      <div className='flex justify-between items-center'>
        <h2 className='font-bold'>Loan Insurance</h2>
        <div>
          <label>Address</label>
          <input
            className='border border-gray-500 mx-2'
            type="text"
            placeholder="Loan Address"
            value={loanAddress}
            onChange={(e) => setLoanAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Amount</label>
          <input
            className='border border-gray-500 mx-2'
            type="number"
            placeholder="Loan Amount"
            value={paymentInsuAmount}
            onChange={(e) => setPaymentInsuAmount(e.target.value)}
          />
        </div>
        <div>
          <label>Policy Type</label>
          <select
            className='border border-gray-500 mx-2'
            value={policyType}
            onChange={(e) => setPolicyType(e.target.value)}
          >
            <option value="0">Basic</option>
            <option value="1">Partial</option>
            <option value="2">Advanced</option>
          </select>
        </div>
        <button
          onClick={loanPayPremium}
          className='px-4 py-1 bg-slate-300 hover:bg-slate-500 transition-all'
        >
          Pay Loan Premium
        </button>
      </div>
      <hr />
  
      {/* SUBMIT LOAN CLAIM */}
      <div className='flex items-center'>
        <h2 className='font-bold'>Loan Insurance Request</h2>
        <input
          className='border border-gray-500 mx-2'
          type="text"
          placeholder="Enter Address"
          value={insuranceAddress}
          onChange={(e) => setInsuranceAddress(e.target.value)}
        />
        <input
          className='border border-gray-500 mx-2'
          type="number"
          placeholder="Collateral amount"
          value={collateralValue}
          onChange={(e) => setCollateralValue(e.target.value)}
        />
        <button
          onClick={claimLoanRequest}
          className='px-4 py-1 bg-slate-300 hover:bg-slate-500 transition-all'
        >
          Claim Loan Request
        </button>
      </div>
    </div>
  );
  
}