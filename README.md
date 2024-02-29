
# DeFi Insurance Platform

## Overview

The DeFi Insurance Platform is a decentralized insurance solution built on the Ethereum blockchain. It aims to provide insurance services for crypto wallets and collateral-backed loans within the decentralized finance (DeFi) ecosystem. By leveraging smart contracts, the platform offers transparent and trustless insurance coverage, enhancing security and risk management for DeFi participants.

## Functionalities

### Wallet Insurance

- Users can purchase insurance for their crypto wallets to protect against various risks, such as hacks, theft, or loss of funds.
- Different policy types are available, offering varying levels of coverage and premiums.
- In the event of an insured incident, users can submit a claim to receive compensation according to their policy terms.

### Loan Insurance

- Collateral-backed loans are insured to protect lenders and borrowers against default or liquidation events.
- Insurance coverage can be customized based on factors such as loan amount, collateral type, and policy type.
- Claims can be processed automatically based on predefined criteria, ensuring prompt reimbursement for eligible parties.

## Contracts

### DefiInsurance.sol

The `DefiInsurance.sol` contract serves as the main contract for providing insurance services. It includes the two componenets of the project which are the ```Wallet Insurance``` and the ```Loan Insurance```  which ges on to implement depositing and withdrawing funds, purchasing wallet and loan insurance, and processing insurance claims.

### DefiInsuranceFactory.sol

The `DefiInsuranceFactory.sol` contract acts as a factory contract for deploying instances of the `DefiInsurance.sol` contract. It includes functions for creating new instances of wallet and loan insurance contracts.

## Usage

### Prerequisites

- Node.js
- Hardhat
- Ethers.js

### Deployment

1. Clone the repository:

```
git clone https://github.com/livinalt/defiInsurance.git
```

2. Install dependencies:

```
cd defi-insurance-platform
npm install
```

3. Deploy the contracts:

```typscript
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
```


## Contribution
Feel free to contribute to this project. Simply fork it and create a pull requests. 


## Author
This project was created by Jeremiah Samuel and you can reach me via email: livinalt@gmail.com


## License
This project is licensed under the MIT License.