// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract DefiInsurance {
    address public owner;

    // Crypto Wallet Insurance
    uint256 public payoutAmount;
    mapping(address => bool) public insuredWallets;
    mapping(address => uint256) public walletPolicyStartTime;
    uint256 constant public POLICY_DURATION = 30 days;
    enum WalletPolicyType {Basic, Partial, Advanced, Customized}

    // Collateral Protection
    uint256 public fullCoverageThreshold;
    uint256 public partialPolicyThreshold;
    mapping(address => uint256) public insuredLoans;
    enum LoanPolicyType {fullPolicy, partialPolicy, dynamicPolicy, escalatingPolicy}

    // User balances mapping
    mapping(address => uint256) public userBalances;

    event WalletInsured(address indexed wallet, uint256 premium);
    event WalletClaimSubmitted(address indexed wallet, uint256 amount);
    event LoanInsured(address indexed loan, uint256 amountInsured);
    event LoanClaimProcessed(address indexed loan, uint256 amountPaid);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
        _;
    }

    // Function for users to deposit funds
    function deposit(uint256 _amount, address _address) external payable {
        require(_amount > 0, "Deposit amount must be greater than zero");
        userBalances[_address] += _amount; // Update user balance
    }

    // Function for users to withdraw funds
    function withdraw(uint256 _amount, address _address) external payable returns(uint256){
    require(msg.sender == _address, "You are not authorized to withdraw from this account");
    require(userBalances[_address] >= _amount, "Insufficient balance");

    userBalances[_address] -= _amount; 
    payable(_address).transfer(_amount); 
    return userBalances[_address];
}

    // Function to get user balance
    function getUserBalance(address _address) external view returns (uint256) {
        return userBalances[_address];
    }

    // Function to get the balance related to Crypto Wallet Insurance
    function getWalletInsuranceBalance() external view returns (uint256) {
        return payoutAmount;
    }

    // Function for users to pay premium and select policy type for Crypto Wallet Insurance
    function payWalletPremium(WalletPolicyType _policy, uint256 _paymentAmount) external payable{
        require(!insuredWallets[msg.sender], "Wallet is already insured");
        require(_paymentAmount > 0, "Payment amount must be greater than zero");

        // Calculate payout amount based on policy type
        if (_policy == WalletPolicyType.Basic) {
            payoutAmount = _paymentAmount;
        } 
        
        else if (_policy == WalletPolicyType.Partial) {
            payoutAmount = _paymentAmount / 2;
        } 
        
        else if (_policy == WalletPolicyType.Advanced) {
            payoutAmount = _paymentAmount * 2;
        } 
        
        else if (_policy == WalletPolicyType.Customized) {
            payoutAmount = _paymentAmount * 3;
        }

        insuredWallets[msg.sender] = true;
        walletPolicyStartTime[msg.sender] = block.timestamp; // Record the start time of the policy
        userBalances[msg.sender] -= _paymentAmount; 
        emit WalletInsured(msg.sender, _paymentAmount);
    }

    // Function for users to submit insurance claim for Wallet Insurance
    function submitWalletClaim() external {
        require(insuredWallets[msg.sender], "Wallet is not insured");
        require(block.timestamp < walletPolicyStartTime[msg.sender] + POLICY_DURATION, "Policy has expired");

        userBalances[msg.sender] += payoutAmount; // Add payout amount to user's balance
        emit WalletClaimSubmitted(msg.sender, payoutAmount);
    }

    // Function to get the balance related to Collateral Protection
    function getLoanInsuranceBalance(address _loanAddress) external view returns (uint256) {
        return insuredLoans[_loanAddress];
    }

    // Function for users to pay premium and select policy type for Collateral Protection
    function payLoanPremium(address _loanAddress, uint256 _loanAmount, LoanPolicyType _policy) external payable {
        require(insuredLoans[_loanAddress] == 0, "Loan is already insured");
        require(_loanAmount > 0, "Loan amount must be greater than zero");

        if (_policy == LoanPolicyType.fullPolicy) {
            fullCoverageThreshold = _loanAmount; // Set full coverage threshold to loan amount
        } 
        
        else if (_policy == LoanPolicyType.partialPolicy) {
            partialPolicyThreshold = _loanAmount / 2; // Set partial coverage threshold to half of the loan amount
        } 
        
        insuredLoans[_loanAddress] = _loanAmount;
        userBalances[msg.sender] -= _loanAmount; // Deduct premium payment from user's balance
        emit LoanInsured(_loanAddress, _loanAmount);
    }

    // Function for users to submit insurance claim for Collateral Protection
    function submitLoanClaim(address _loanAddress, uint256 _collateralValue) external {
        require(insuredLoans[_loanAddress] > 0, "Loan is not insured");
        uint256 amountPaid;

        if (_collateralValue < partialPolicyThreshold) {
            amountPaid = insuredLoans[_loanAddress] / 2; // Reimburse half of the loan amount for partial coverage
        } 
        
        else if (_collateralValue < fullCoverageThreshold) {
            amountPaid = insuredLoans[_loanAddress]; // Reimburse full loan amount for full coverage
        }
        
        userBalances[msg.sender] += amountPaid; // Add insurance payout to user's balance
        emit LoanClaimProcessed(_loanAddress, amountPaid);
    }

    // Function to check if a loan is insured
    function isLoanInsured(address _loanAddress) external view returns (bool) {
        return insuredLoans[_loanAddress] > 0;
    }
}
