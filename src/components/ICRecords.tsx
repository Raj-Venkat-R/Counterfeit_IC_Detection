import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ExternalLink,
  Zap,
  Shield,
  Activity,
  Calendar
} from 'lucide-react';
import { mockICRecords } from '../utils/mockData';
import { ICRecord } from '../types';

const ICRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'real' | 'fake' | 'pending'>('all');
  const [records] = useState<ICRecord[]>(mockICRecords);

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'pending' && record.status === 'pending') ||
                         (filterStatus !== 'pending' && record.authenticity === filterStatus);
    
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (record: ICRecord) => {
    if (record.status === 'pending') return <Clock className="w-5 h-5 text-yellow-400" />;
    return record.authenticity === 'real' ? 
      <CheckCircle className="w-5 h-5 text-green-400" /> : 
      <AlertTriangle className="w-5 h-5 text-red-400" />;
  };

  const getStatusColor = (record: ICRecord) => {
    if (record.status === 'pending') return 'border-yellow-500/30 bg-yellow-500/10';
    return record.authenticity === 'real' ? 
      'border-green-500/30 bg-green-500/10' : 
      'border-red-500/30 bg-red-500/10';
  };

  const getStatusText = (record: ICRecord) => {
    if (record.status === 'pending') return 'Pending Verification';
    return record.authenticity === 'real' ? 'Authentic' : 'Counterfeit';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-2">IC Records Database</h1>
        <p className="text-gray-400">
          Browse all analyzed ICs with their authenticity status and blockchain verification
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by IC name, manufacturer, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Records</option>
              <option value="real">Authentic Only</option>
              <option value="fake">Counterfeits Only</option>
              <option value="pending">Pending Verification</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400">
            Showing <span className="text-white font-semibold">{filteredRecords.length}</span> of {records.length} records
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-gray-400">Authentic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-gray-400">Counterfeit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-400">Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRecords.map((record) => (
          <div
            key={record.id}
            className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-200 group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(record)}
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                    {record.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{record.manufacturer}</p>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(record)}`}>
                {getStatusText(record)}
              </div>
            </div>

            {/* IC Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-gray-400 text-sm">IC ID</span>
                <p className="text-white font-mono text-sm">{record.id}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Confidence</span>
                <p className="text-white font-semibold">{record.confidence}%</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Verified By</span>
                <p className="text-white text-sm">{record.verifiedBy}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Upload Date</span>
                <p className="text-white text-sm">{record.uploadedAt.toLocaleDateString()}</p>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Confidence Score</span>
                <span className="text-white font-semibold">{record.confidence}%</span>
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

            {/* Frequency Signature Preview */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-400 text-sm">Frequency Signature</span>
              </div>
              <div className="flex items-end gap-1 h-8">
                {record.frequencySignature.map((freq, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-t from-cyan-500 to-blue-400 rounded-sm flex-1 opacity-70"
                    style={{ height: `${(freq / 5) * 100}%` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Blockchain Info */}
            {record.blockchainHash && (
              <div className="bg-gray-700/30 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Blockchain Verified</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hash:</span>
                    <span className="text-cyan-400 font-mono">{record.blockchainHash.slice(0, 16)}...</span>
                  </div>
                  {record.blockchainCredit !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Credit Score:</span>
                      <span className="text-white font-semibold">{record.blockchainCredit}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Added by {record.uploadedBy}</span>
              </div>
              
              <div className="flex gap-2">
                {record.blockchainHash && (
                  <button className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
                <button className="p-2 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors">
                  <Zap className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-12 text-center">
          <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">No records found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default ICRecords;