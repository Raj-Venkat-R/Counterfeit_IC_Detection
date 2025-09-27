import React, { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Web3AuthProvider, useWeb3Auth } from './contexts/Web3AuthContext';
import { AuthProvider } from './contexts/AuthContext';
import { config } from './config/wagmi';
import Web3Login from './components/Web3Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import UploadIC from './components/UploadIC';
import ICRecords from './components/ICRecords';
import MarketView from './components/MarketView';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import '@rainbow-me/rainbowkit/styles.css';

const AppContent: React.FC = () => {
  const { user, isLoading, isConnected } = useWeb3Auth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isConnected) {
    return <Web3Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'upload':
        return <UploadIC />;
      case 'records':
        return <ICRecords />;
      case 'market':
        return <MarketView />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Web3AuthProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </Web3AuthProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;