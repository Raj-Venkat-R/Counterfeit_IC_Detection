import { ethers } from 'ethers';
import ICRegistryABI from '../abi/ICRegistry.json';

// Environment-provided deployed contract address
const CONTRACT_ADDRESS = import.meta.env.VITE_ICREGISTRY_ADDRESS as string | undefined;

// Try to get an ethers Contract connected to the user's wallet (if available)
const getContract = async () => {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS.length === 0) return null;
  const anyWindow = window as any;
  if (!anyWindow.ethereum) return null;

  // Ethers v6 API
  const provider = new ethers.BrowserProvider(anyWindow.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, ICRegistryABI as any, signer);
};

// Mock smart contract functions for IC verification
export const mockSmartContract = {
  // Submit IC verification to blockchain (mock)
  submitICVerification: async (
    _icId: string,
    _frequencySignature: number[],
    _authenticity: 'real' | 'fake',
    _confidence: number,
    _verifierAddress: string
  ): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const txHash =
      '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return txHash;
  },

  // Get IC verification from blockchain (mock)
  getICVerification: async (icId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      icId,
      isVerified: true,
      authenticity: 'real' as const,
      confidence: 95.5,
      verifierAddress: '0x1234567890123456789012345678901234567890',
      timestamp: Date.now(),
      txHash:
        '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    };
  },

  // Get user role from smart contract (mock)
  getUserRole: async (address: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const roleMap: { [key: string]: string } = {
      '0x1234567890123456789012345678901234567890': 'admin',
      '0x2345678901234567890123456789012345678901': 'manufacturer',
      '0x3456789012345678901234567890123456789012': 'verification_body',
      '0x4567890123456789012345678901234567890123': 'supplier',
    };
    return roleMap[address] || 'manufacturer';
  },

  // Get verification credits for user (mock)
  getUserCredits: async (address: string): Promise<number> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const creditsMap: { [key: string]: number } = {
      '0x1234567890123456789012345678901234567890': 1000,
      '0x2345678901234567890123456789012345678901': 850,
      '0x3456789012345678901234567890123456789012': 920,
      '0x4567890123456789012345678901234567890123': 750,
    };
    return creditsMap[address] || 0;
  },
};

// Unified submit function that uses Ethers contract if available, otherwise falls back to the mock
export const submitICVerification = async (
  icId: string,
  name: string,
  manufacturer: string,
  frequencySignature: number[],
  authenticity: 'real' | 'fake',
  confidence: number
): Promise<string> => {
  try {
    const contract = await getContract();
    if (!contract) throw new Error('No contract configured or wallet not available');

    const authenticityEnum = authenticity === 'real' ? 0 : 1; // REAL=0, FAKE=1
    const tx = await contract.submitICVerification(
      icId,
      name,
      manufacturer,
      frequencySignature,
      authenticityEnum,
      confidence
    );
    const receipt = await tx.wait();
    // Prefer the transaction hash for UI linking
    return receipt?.hash ?? tx.hash;
  } catch (err) {
    // Fallback to mock behavior to keep UX working in dev
    console.warn('[web3Utils] Falling back to mock submitICVerification:', err);
    const anyWindow = window as any;
    const verifier = anyWindow?.ethereum?.selectedAddress || '0x0000000000000000000000000000000000000000';
    return mockSmartContract.submitICVerification(icId, frequencySignature, authenticity, confidence, verifier);
  }
};

// Utility function to format Ethereum addresses
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Utility function to validate Ethereum address
export const isValidAddress = (address: string): boolean => {
  return ethers.isAddress(address);
};

// Utility function to get ENS name (mock implementation)
export const getENSName = async (address: string): Promise<string | null> => {
  // Mock ENS resolution
  const ensMap: { [key: string]: string } = {
    '0x1234567890123456789012345678901234567890': 'admin.ictrust.eth',
    '0x2345678901234567890123456789012345678901': 'johnsmith.eth',
    '0x3456789012345678901234567890123456789012': 'sarahchen.eth',
    '0x4567890123456789012345678901234567890123': 'mikejohnson.eth'
  };
  
  return (ensMap as any)[address] || null;
};
