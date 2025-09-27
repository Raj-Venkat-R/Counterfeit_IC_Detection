import React from 'react';
import { Bell, Search, Zap, Wallet } from 'lucide-react';
import { useWeb3Auth } from '../contexts/Web3AuthContext';
import { useAccount } from 'wagmi';

const Header: React.FC = () => {
  const { user, disconnect } = useWeb3Auth();
  const { address, isConnected } = useAccount();

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">
            IC Trust Platform
          </h1>
          <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-medium text-sm">Live Monitoring</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search ICs..."
              className="pl-10 pr-4 py-2 w-64 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </div>

          {/* Wallet Connection Status */}
          <div className="flex items-center gap-3">
            {isConnected && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                <Wallet className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium text-sm">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
            )}
            
            {/* User Avatar */}
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            
            {/* Disconnect Button */}
            {isConnected && (
              <button
                onClick={disconnect}
                className="text-gray-400 hover:text-white text-sm px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                title="Disconnect Wallet"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;