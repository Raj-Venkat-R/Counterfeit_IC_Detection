import React, { useState } from 'react';
import { Wallet, AlertCircle, Loader2 } from 'lucide-react';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useWeb3Auth } from '../contexts/Web3AuthContext';

const Web3Login: React.FC = () => {
  const { connect, isConnecting, isConnected } = useWeb3Auth();
  const [error, setError] = useState('');
  const { openConnectModal } = useConnectModal();

  const handleConnect = async () => {
    try {
      setError('');
      // Prefer RainbowKit modal when available for better UX & more wallet options
      if (openConnectModal) {
        openConnectModal();
      } else {
        await connect();
      }
    } catch (err) {
      setError('Failed to connect wallet. Please try again.');
      console.error('Wallet connection error:', err);
    }
  };

  if (isConnected) {
    return null; // Don't show login if already connected
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">IC Trust Platform</h1>
            <p className="text-gray-400">Connect your Web3 wallet to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* RainbowKit ConnectButton offers robust wallet choices */}
            <div className="w-full">
              <ConnectButton accountStatus="address" chainStatus="icon" showBalance={false} />
            </div>

            {/* Backup button if ConnectButton fails to render for any reason */}
            <div className="text-center">
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Connect with MetaMask, WalletConnect, or other supported wallets
              </p>
              <p className="text-xs text-gray-500 mt-1">
                If nothing happens when clicking connect, ensure a wallet like MetaMask is installed and no blockers (ad-blockers/corporate firewall) are preventing popups.
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h3 className="text-blue-400 font-semibold mb-2">Web3 Features</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Secure wallet-based authentication</li>
              <li>• Blockchain-verified IC records</li>
              <li>• Decentralized verification system</li>
              <li>• Immutable audit trail</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Web3Login;
