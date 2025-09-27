import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  Loader,
  Activity,
  Link
} from 'lucide-react';
import { generateMockFrequencyData, simulateAIAnalysis, generateMockBlockchainHash } from '../utils/mockData';
import { useWeb3Auth } from '../contexts/Web3AuthContext';
import { useAccount } from 'wagmi';
import { submitICVerification } from '../utils/web3Utils';

interface AnalysisState {
  isAnalyzing: boolean;
  result: {
    authenticity: 'real' | 'fake';
    confidence: number;
    processingTime: number;
  } | null;
  blockchainHash: string | null;
}

const UploadIC: React.FC = () => {
  const { user } = useWeb3Auth();
  const { address, isConnected } = useAccount();
  const [icName, setIcName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [frequencyData, setFrequencyData] = useState<number[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisState>({
    isAnalyzing: false,
    result: null,
    blockchainHash: null
  });

  const handleGenerateData = () => {
    const mockData = generateMockFrequencyData();
    setFrequencyData(mockData);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate file processing
      const mockData = generateMockFrequencyData();
      setFrequencyData(mockData);
      setIcName(file.name.replace('.csv', '').replace('.json', ''));
    }
  };

  const handleAnalyze = async () => {
    if (!frequencyData.length || !icName || !isConnected) return;

    setAnalysis({ isAnalyzing: true, result: null, blockchainHash: null });

    try {
      const result = await simulateAIAnalysis(frequencyData);
      setAnalysis({
        isAnalyzing: false,
        result,
        blockchainHash: null
      });
    } catch (error) {
      setAnalysis({ isAnalyzing: false, result: null, blockchainHash: null });
    }
  };

  const handleMintToBlockchain = async () => {
    if (!analysis.result || !address) return;

    try {
      const txHash = await submitICVerification(
        `IC-${Date.now()}`,
        icName || 'Unknown IC',
        manufacturer || 'Unknown',
        frequencyData,
        analysis.result.authenticity,
        analysis.result.confidence
      );
      
      setAnalysis(prev => ({
        ...prev,
        blockchainHash: txHash
      }));
    } catch (error) {
      console.error('Blockchain submission failed:', error);
    }
  };

  const ConfidenceBar: React.FC<{ confidence: number }> = ({ confidence }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Confidence Score</span>
        <span className="text-white font-semibold">{confidence.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${
            confidence >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
            confidence >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' :
            'bg-gradient-to-r from-red-500 to-pink-400'
          }`}
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Upload IC for Analysis</h1>
        <p className="text-gray-400">
          Upload IC test data or generate mock data for AI authenticity verification
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">IC Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">IC Name</label>
              <input
                type="text"
                value={icName}
                onChange={(e) => setIcName(e.target.value)}
                placeholder="e.g., Intel Core i7-13700K"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Manufacturer</label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="e.g., Intel Corp"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Test Data</label>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-purple-500/50 transition-colors">
                  <input
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">Drop files here or click to upload</p>
                    <p className="text-gray-500 text-sm mt-1">CSV, JSON files accepted</p>
                  </label>
                </div>

                <div className="text-center">
                  <span className="text-gray-400 text-sm">or</span>
                </div>

                <button
                  onClick={handleGenerateData}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:from-blue-500/30 hover:to-cyan-500/30 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  Generate Mock Data
                </button>
              </div>
            </div>

            {frequencyData.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Frequency Signature</label>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    <span className="text-cyan-400 font-medium">8-point frequency analysis</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {frequencyData.map((freq, index) => (
                      <div key={index} className="text-center">
                        <div className="text-white font-mono text-sm">{freq.toFixed(2)}</div>
                        <div className="text-gray-500 text-xs">F{index + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!frequencyData.length || !icName || analysis.isAnalyzing}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {analysis.isAnalyzing ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Analyze IC
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Analysis Results</h2>
          
          {analysis.isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">AI model processing...</p>
              <p className="text-gray-500 text-sm">This may take a few seconds</p>
            </div>
          )}

          {analysis.result && (
            <div className="space-y-6">
              {/* Main Result */}
              <div className={`p-6 rounded-xl border ${
                analysis.result.authenticity === 'real' 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  {analysis.result.authenticity === 'real' ? (
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                  )}
                  <div>
                    <h3 className={`text-xl font-bold ${
                      analysis.result.authenticity === 'real' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {analysis.result.authenticity === 'real' ? 'Authentic IC' : 'Counterfeit Detected'}
                    </h3>
                    <p className="text-gray-400">Analysis completed in {(analysis.result.processingTime / 1000).toFixed(1)}s</p>
                  </div>
                </div>

                <ConfidenceBar confidence={analysis.result.confidence} />
              </div>

              {/* Blockchain Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Blockchain Verification</h3>
                
                {!analysis.blockchainHash ? (
                  <button
                    onClick={handleMintToBlockchain}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg text-green-400 hover:from-green-500/30 hover:to-emerald-500/30 transition-colors"
                  >
                    <Link className="w-4 h-4" />
                    Mint on Ethereum
                  </button>
                ) : (
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-medium">Minted Successfully</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-400 text-sm">Transaction Hash:</span>
                        <p className="text-cyan-400 font-mono text-sm break-all">{analysis.blockchainHash}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Blockchain Credit:</span>
                        <span className="text-white font-semibold ml-2">
                          {analysis.result.authenticity === 'real' ? Math.floor(analysis.result.confidence * 10) : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Technical Details */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Technical Analysis</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Model Version:</span>
                    <p className="text-white">CNN-v2.1.3</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Processing Time:</span>
                    <p className="text-white">{(analysis.result.processingTime / 1000).toFixed(2)}s</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Data Points:</span>
                    <p className="text-white">{frequencyData.length} frequencies</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <p className={analysis.result.authenticity === 'real' ? 'text-green-400' : 'text-red-400'}>
                      {analysis.result.authenticity === 'real' ? 'AUTHENTIC' : 'COUNTERFEIT'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!analysis.isAnalyzing && !analysis.result && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mb-4" />
              <p>Upload IC data and click analyze to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadIC;