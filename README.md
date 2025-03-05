# Blockchain-Based Organ Donation Registry

A decentralized application (DApp) for organ donation registry using blockchain technology to ensure transparency, security, and efficiency in the organ donation process.

## Features

- **Secure Donor Registration**: Register as an organ donor with your personal and medical information securely stored on the blockchain.
- **Recipient Management**: Register as a recipient in need of an organ transplant.
- **Smart Contract Matching**: Automated matching between donors and recipients based on compatibility.
- **Transparent Process**: All stakeholders have visibility into the donation process while maintaining privacy.
- **Blockchain Security**: Immutable records ensure data integrity and prevent tampering.

## Technology Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Blockchain**: Ethereum (Solidity, Hardhat)
- **Database**: MongoDB (for off-chain data storage)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB
- MetaMask browser extension

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/blockchain-organ-donation.git
   cd blockchain-organ-donation
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` and fill in your configuration.

4. Compile and deploy the smart contract:
   ```
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network localhost
   ```

5. Update the `.env` file with the deployed contract address.

6. Start the backend server:
   ```
   npm run server
   ```

7. Start the frontend development server:
   ```
   npm run dev
   ```

## Project Structure

- `/contracts`: Solidity smart contracts
- `/scripts`: Deployment scripts for smart contracts
- `/server`: Express.js backend server
- `/src`: React.js frontend application
  - `/components`: Reusable UI components
  - `/context`: React context for state management
  - `/pages`: Application pages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.