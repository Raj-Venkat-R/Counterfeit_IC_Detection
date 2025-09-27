import React from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Cpu, 
  Activity,
  Zap,
  Users
} from 'lucide-react';
import { mockICRecords } from '../utils/mockData';
import { useWeb3Auth } from '../contexts/Web3AuthContext';
import { useAccount } from 'wagmi';

const Dashboard: React.FC = () => {
  const { user } = useWeb3Auth();
  const { address, isConnected } = useAccount();

  const totalRecords = mockICRecords.length;
  const authenticRecords = mockICRecords.filter(ic => ic.authenticity === 'real').length;
  const counterfeits = mockICRecords.filter(ic => ic.authenticity === 'fake').length;
  const pendingVerification = mockICRecords.filter(ic => ic.status === 'pending').length;
  const avgConfidence = mockICRecords.reduce((sum, ic) => sum + ic.confidence, 0) / totalRecords;

  const stats = [
    {
      title: 'Total ICs Analyzed',
      value: totalRecords.toString(),
      icon: Cpu,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-400'
    },
    {
      title: 'Authentic ICs',
      value: authenticRecords.toString(),
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      textColor: 'text-green-400'
    },
    {
      title: 'Counterfeits Detected',
      value: counterfeits.toString(),
      icon: AlertTriangle,
      color: 'from-red-500 to-pink-500',
      textColor: 'text-red-400'
    },
    {
      title: 'Pending Verification',
      value: pendingVerification.toString(),
      icon: Shield,
      color: 'from-yellow-500 to-orange-500',
      textColor: 'text-yellow-400'
    }
  ];

  const recentActivity = mockICRecords.slice(0, 5).map(ic => ({
    id: ic.id,
    name: ic.name,
    status: ic.authenticity,
    confidence: ic.confidence,
    time: ic.uploadedAt,
    verifier: ic.verifiedBy
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome back, {user?.name}
            </h1>
            <p className="text-gray-400">
              Monitor IC authenticity and blockchain verification status in real-time
            </p>
            {isConnected && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="text-gray-500">Connected:</span>
                <span className="text-cyan-400 font-mono">{address}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-medium">System Online</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg opacity-80 group-hover:opacity-100 transition-opacity`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className={`w-4 h-4 ${stat.textColor}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* AI Performance & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Performance */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">AI Model Performance</h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-full">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 font-medium text-sm">v2.1.3</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Average Confidence</span>
              <span className="text-white font-semibold">{avgConfidence.toFixed(1)}%</span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${avgConfidence}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{((authenticRecords/totalRecords)*100).toFixed(0)}%</div>
                <div className="text-gray-400 text-sm">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">2.4s</div>
                <div className="text-gray-400 text-sm">Avg Analysis Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                <div className={`w-3 h-3 rounded-full ${activity.status === 'real' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{activity.name}</div>
                  <div className="text-gray-400 text-sm">{activity.verifier}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{activity.confidence}%</div>
                  <div className="text-gray-400 text-xs">
                    {activity.time.toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;