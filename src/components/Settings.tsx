import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Database, 
  Key,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState({
    profile: {
      name: user?.name || '',
      email: user?.email || '',
      company: user?.company || '',
      role: user?.role || '',
    },
    security: {
      twoFactorEnabled: false,
      apiKeyVisible: false,
      sessionTimeout: '24'
    },
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      weeklyReports: true,
      securityAlerts: true
    },
    blockchain: {
      autoMint: false,
      gasLimit: '21000',
      network: 'ethereum-mainnet'
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'blockchain', label: 'Blockchain', icon: Zap },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const mockApiKey = 'ic_trust_sk_1a2b3c4d5e6f7890abcdef1234567890';

  const ProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              value={settings.profile.name}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, name: e.target.value }
              }))}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, email: e.target.value }
              }))}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
            <input
              type="text"
              value={settings.profile.company}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, company: e.target.value }
              }))}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
            <select
              value={settings.profile.role}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, role: e.target.value }
              }))}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="manufacturer">Manufacturer</option>
              <option value="supplier">Supplier</option>
              <option value="verification_body">Verification Body</option>
              <option value="company">Company</option>
              <option value="ngo">NGO</option>
              <option value="community">Community</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">Account Status</h4>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-green-400 text-sm">Account Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm">2FA Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );

  const SecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
            <div>
              <div className="text-white font-medium">Two-Factor Authentication</div>
              <div className="text-gray-400 text-sm">Add an extra layer of security to your account</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.twoFactorEnabled}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, twoFactorEnabled: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>
          
          <div className="p-4 bg-gray-700/30 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-white font-medium">API Key</div>
                <div className="text-gray-400 text-sm">Use this key to access the IC Trust API</div>
              </div>
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-gray-800 rounded text-cyan-400 font-mono text-sm">
                {showApiKey ? mockApiKey : '•'.repeat(40)}
              </code>
              <button className="p-2 text-purple-400 hover:bg-purple-500/10 rounded transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="p-4 bg-gray-700/30 rounded-lg">
            <div className="mb-3">
              <div className="text-white font-medium mb-2">Session Timeout</div>
              <select
                value={settings.security.sessionTimeout}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, sessionTimeout: e.target.value }
                }))}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="1">1 hour</option>
                <option value="8">8 hours</option>
                <option value="24">24 hours</option>
                <option value="168">1 week</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
        
        <div className="space-y-4">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div>
                <div className="text-white font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-gray-400 text-sm">
                  {key === 'emailAlerts' && 'Receive email notifications for important events'}
                  {key === 'pushNotifications' && 'Get browser push notifications'}
                  {key === 'weeklyReports' && 'Receive weekly analysis summaries'}
                  {key === 'securityAlerts' && 'Immediate alerts for security events'}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value as boolean}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, [key]: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const BlockchainSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Blockchain Configuration</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
            <div>
              <div className="text-white font-medium">Auto-Mint to Blockchain</div>
              <div className="text-gray-400 text-sm">Automatically mint verified ICs to blockchain</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.blockchain.autoMint}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  blockchain: { ...prev.blockchain, autoMint: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>
          
          <div className="p-4 bg-gray-700/30 rounded-lg">
            <div className="mb-3">
              <label className="block text-white font-medium mb-2">Network</label>
              <select
                value={settings.blockchain.network}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  blockchain: { ...prev.blockchain, network: e.target.value }
                }))}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="ethereum-mainnet">Ethereum Mainnet</option>
                <option value="ethereum-goerli">Ethereum Goerli (Testnet)</option>
                <option value="polygon-mainnet">Polygon Mainnet</option>
                <option value="polygon-mumbai">Polygon Mumbai (Testnet)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Gas Limit</label>
              <input
                type="text"
                value={settings.blockchain.gasLimit}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  blockchain: { ...prev.blockchain, gasLimit: e.target.value }
                }))}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium">Blockchain Status</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Network:</span>
                <div className="text-white">Ethereum Mainnet</div>
              </div>
              <div>
                <span className="text-gray-400">Gas Price:</span>
                <div className="text-white">23 Gwei</div>
              </div>
              <div>
                <span className="text-gray-400">Block Height:</span>
                <div className="text-white">18,742,891</div>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400">Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile': return <ProfileSettings />;
      case 'security': return <SecuritySettings />;
      case 'notifications': return <NotificationSettings />;
      case 'blockchain': return <BlockchainSettings />;
      case 'appearance': return (
        <div className="text-center py-12">
          <Palette className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">Appearance Settings</h3>
          <p className="text-gray-500">Theme customization coming soon</p>
        </div>
      );
      default: return <ProfileSettings />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">
          Manage your account, security, and platform preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-400 border border-purple-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6">
            {renderActiveTab()}
            
            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-700">
              <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-cyan-600 transition-colors">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;