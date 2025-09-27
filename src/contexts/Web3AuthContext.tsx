import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';
import { User } from '../types';

interface Web3AuthContextType {
  user: User | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => void;
  disconnect: () => void;
  isLoading: boolean;
}

const Web3AuthContext = createContext<Web3AuthContextType | undefined>(undefined);

export const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext);
  if (context === undefined) {
    throw new Error('useWeb3Auth must be used within a Web3AuthProvider');
  }
  return context;
};

interface Web3AuthProviderProps {
  children: ReactNode;
}

export const Web3AuthProvider: React.FC<Web3AuthProviderProps> = ({ children }) => {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isConnected && address) {
      // Create user from wallet address
      const newUser: User = {
        id: address,
        address: address,
        name: ensName || `${address.slice(0, 6)}...${address.slice(-4)}`,
        role: 'manufacturer', // Default role, can be updated based on smart contract
        ensName: ensName || undefined,
      };
      
      setUser(newUser);
      localStorage.setItem('web3User', JSON.stringify(newUser));
    } else {
      setUser(null);
      localStorage.removeItem('web3User');
    }
    setIsLoading(false);
  }, [isConnected, address, ensName]);

  useEffect(() => {
    // Check for existing user on mount
    const savedUser = localStorage.getItem('web3User');
    if (savedUser && !isConnected) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('web3User');
      }
    }
    setIsLoading(false);
  }, []);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      if (!connectors || connectors.length === 0) {
        console.warn('[Web3Auth] No connectors available. Ensure MetaMask or a wallet is installed.');
        setIsLoading(false);
        return;
      }
      // Prefer injected connector if present
      const injected = connectors.find(c => (c as any).id === 'injected' || (c as any).name?.toLowerCase().includes('metamask'));
      const preferred = injected || connectors[0];
      connect({ connector: preferred });
    } catch (e) {
      console.error('[Web3Auth] Connect error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setUser(null);
    localStorage.removeItem('web3User');
  };

  return (
    <Web3AuthContext.Provider 
      value={{ 
        user, 
        isConnected, 
        isConnecting, 
        connect: handleConnect, 
        disconnect: handleDisconnect, 
        isLoading 
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};
