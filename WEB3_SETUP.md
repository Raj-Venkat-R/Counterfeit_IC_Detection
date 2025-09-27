# Web3 Setup Guide

This guide will help you set up the IC Trust Platform with Web3 functionality.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **A Web3 wallet** (MetaMask, WalletConnect, etc.)
3. **WalletConnect Project ID** (for RainbowKit)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Get a WalletConnect Project ID:
   - Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Create a new project
   - Copy your Project ID

3. Update the configuration:
   - Open `src/config/wagmi.ts`
   - Replace `YOUR_PROJECT_ID` with your actual Project ID

## Supported Networks

The platform supports the following networks:
- Ethereum Mainnet
- Sepolia Testnet
- Polygon
- Arbitrum
- Optimism

## Features

### Web3 Authentication
- Connect with MetaMask, WalletConnect, and other supported wallets
- ENS name resolution
- Secure wallet-based authentication

### Blockchain Integration
- Submit IC verification results to blockchain
- Immutable audit trail
- Smart contract integration (mock implementation)

### User Roles
- Admin: Full platform access
- Manufacturer: Can upload and verify ICs
- Supplier: Can view and manage IC records
- Verification Body: Can verify IC authenticity

## Development

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`

3. Connect your Web3 wallet to interact with the platform

## Smart Contract Integration

The platform includes mock smart contract functions for:
- `submitICVerification()`: Submit IC verification to blockchain
- `getICVerification()`: Retrieve IC verification from blockchain
- `getUserRole()`: Get user role from smart contract
- `getUserCredits()`: Get user verification credits

To integrate with real smart contracts, replace the mock functions in `src/utils/web3Utils.ts` with actual contract calls.

## Security Notes

- Always verify wallet connections
- Use test networks for development
- Implement proper error handling for blockchain transactions
- Consider gas fees and transaction costs

## Troubleshooting

### Common Issues

1. **Wallet not connecting**: Ensure you have a Web3 wallet installed
2. **Transaction failures**: Check network connection and gas fees
3. **ENS resolution**: Ensure you're connected to the correct network

### Support

For technical support, please refer to the documentation or create an issue in the repository.
