# IC Trust Platform

A Web3-powered counterfeit IC detection platform built with React, TypeScript, and blockchain technology. This platform enables secure verification of integrated circuits using frequency signature analysis and blockchain-based authentication.

## Features

- 🔗 **Web3 Integration**: Connect with MetaMask and other Web3 wallets
- 🔍 **AI-Powered Detection**: Advanced frequency signature analysis for counterfeit detection
- ⛓️ **Blockchain Verification**: Immutable records on the blockchain
- 🏢 **Multi-Role Support**: Manufacturers, suppliers, verifiers, and administrators
- 📊 **Real-time Dashboard**: Live monitoring and analytics
- 🔒 **Secure Authentication**: Web3 wallet-based authentication

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Web3**: Wagmi, RainbowKit, Ethers.js
- **Blockchain**: Ethereum-compatible networks
- **UI Components**: Lucide React icons

## Getting Started (Frontend)

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Connect your Web3 wallet to interact with the platform

## Web3 Features

- Wallet connection and authentication
- Blockchain-based IC verification records
- Smart contract integration for secure data storage
- Decentralized verification system

## Hardhat + Smart Contracts

This project includes a Solidity contract `contracts/ICRegistry.sol` and a Hardhat setup for compilation and deployment.

### 1) Configure environment

Create a `.env` file (see `.env.example`):

```
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_cloud_project_id
VITE_ICREGISTRY_ADDRESS= # fill after deployment

SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
# or
# POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/YOUR_KEY

PRIVATE_KEY=0xYOUR_PRIVATE_KEY_WITHOUT_QUOTES
ETHERSCAN_API_KEY=your_etherscan_key_optional
```

### 2) Install Hardhat toolchain

```bash
npm install
```

This installs devDependencies like `hardhat`, `@nomicfoundation/hardhat-toolbox`, and `dotenv`.

### 3) Compile the contract

```bash
npm run hh:compile
```

Artifacts will be created under `artifacts/`.

### 4) Deploy the contract (example: Sepolia)

```bash
npm run hh:deploy:sepolia
```

The script `scripts/deploy.js` will output the deployed address, e.g.:

```
ICRegistry deployed to: 0xABC...123
```

Copy that address into your `.env` as `VITE_ICREGISTRY_ADDRESS`.

### 5) Export ABI for the frontend

```bash
npm run hh:export-abi
```

This writes `src/abi/ICRegistry.json` (ABI only). The frontend imports this to interact with the contract.

### 6) Run the frontend

```bash
npm run dev
```

Now the `Upload IC` flow mints verification to the on-chain `ICRegistry` when a wallet and contract address are configured. If no wallet/contract is configured, a mock fallback is used so the UI remains functional.

## License

MIT License
