import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Shield, 
  ExternalLink,
  Star,
  Eye,
  CheckCircle,
  AlertTriangle,
  Building,
  Calendar,
  Zap
} from 'lucide-react';
import { mockICRecords } from '../utils/mockData';
import { ICRecord } from '../types';

const MarketView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'authentic' | 'counterfeit'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'confidence' | 'credit'>('date');
  const [records] = useState<ICRecord[]>(mockICRecords);

  const filteredAndSortedRecords = records
    .filter(record => {
      const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === 'all' ||
                             (filterCategory === 'authentic' && record.authenticity === 'real') ||
                             (filterCategory === 'counterfeit' && record.authenticity === 'fake');
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return b.confidence - a.confidence;
        case 'credit':
          return (b.blockchainCredit || 0) - (a.blockchainCredit || 0);
        case 'date':
        default:
          return b.uploadedAt.getTime() - a.uploadedAt.getTime();
      }
    });

  const marketStats = {
    totalICs: records.length,
    authenticRate: Math.round((records.filter(r => r.authenticity === 'real').length / records.length) * 100),
    avgConfidence: Math.round(records.reduce((sum, r) => sum + r.confidence, 0) / records.length),
    totalCredits: records.reduce((sum, r) => sum + (r.blockchainCredit || 0), 0)
  };

  const ICCard: React.FC<{ record: ICRecord }> = ({ record }) => {
    const isAuthentic = record.authenticity === 'real';
    
    return (
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-200 group">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {isAuthentic ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                {record.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Building className="w-4 h-4" />
                <span>{record.manufacturer}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className={`px-3 py-1 rounded-full border text-sm font-medium ${
              isAuthentic 
                ? 'border-green-500/30 bg-green-500/10 text-green-400'
                : 'border-red-500/30 bg-red-500/10 text-red-400'
            }`}>
              {isAuthentic ? 'Authentic' : 'Counterfeit'}
            </div>
            
            {record.blockchainCredit && (
              <div className="flex items-center gap-1 text-cyan-400 text-sm">
                <Star className="w-3 h-3 fill-current" />
                <span>{record.blockchainCredit}</span>
              </div>
            )}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{record.confidence}%</div>
            <div className="text-xs text-gray-400">Confidence</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-cyan-400">{record.id}</div>
            <div className="text-xs text-gray-400">IC ID</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">{record.verifiedBy.split(' ')[0]}</div>
            <div className="text-xs text-gray-400">Verifier</div>
          </div>
        </div>

        {/* Confidence Visualization */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Trust Score</span>
            <span className="text-white">{record.confidence}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                record.confidence >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                record.confidence >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' :
                'bg-gradient-to-r from-red-500 to-pink-400'
              }`}
              style={{ width: `${record.confidence}%` }}
            />
          </div>
        </div>

        {/* Blockchain Status */}
        {record.blockchainHash ? (
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Blockchain Verified</span>
            </div>
            <div className="text-xs text-gray-400">
              Hash: {record.blockchainHash.slice(0, 20)}...
            </div>
          </div>
        ) : (
          <div className="bg-gray-700/30 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Awaiting Blockchain Verification</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{record.uploadedAt.toLocaleDateString()}</span>
          </div>
          
          <div className="flex gap-2">
            <button className="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded transition-colors">
              <Zap className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-2">IC Market Overview</h1>
        <p className="text-gray-400">
          Explore the marketplace of verified ICs with their authenticity status and blockchain credits
        </p>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Eye className="w-5 h-5 text-blue-400" />
            </div>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{marketStats.totalICs}</div>
          <div className="text-gray-400 text-sm">Total ICs Listed</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{marketStats.authenticRate}%</div>
          <div className="text-gray-400 text-sm">Authenticity Rate</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{marketStats.avgConfidence}%</div>
          <div className="text-gray-400 text-sm">Avg Confidence</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Star className="w-5 h-5 text-cyan-400" />
            </div>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{marketStats.totalCredits.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Total Credits</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search ICs or manufacturers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Categories</option>
                <option value="authentic">Authentic Only</option>
                <option value="counterfeit">Counterfeits Only</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="date">Sort by Date</option>
                <option value="confidence">Sort by Confidence</option>
                <option value="credit">Sort by Credits</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400">
            Showing <span className="text-white font-semibold">{filteredAndSortedRecords.length}</span> of {records.length} ICs
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-400">Verified Authentic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-gray-400">Counterfeit Detected</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3 text-cyan-400" />
              <span className="text-gray-400">Blockchain Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* IC Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAndSortedRecords.map((record) => (
          <ICCard key={record.id} record={record} />
        ))}
      </div>

      {filteredAndSortedRecords.length === 0 && (
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-12 text-center">
          <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">No ICs found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default MarketView;