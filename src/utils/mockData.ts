import { ICRecord, User } from '../types';

export const mockUsers: User[] = [
  {
    id: '0x1234567890123456789012345678901234567890',
    address: '0x1234567890123456789012345678901234567890',
    name: 'Admin User',
    role: 'admin',
    company: 'IC Trust Platform'
  },
  {
    id: '0x2345678901234567890123456789012345678901',
    address: '0x2345678901234567890123456789012345678901',
    name: 'John Smith',
    role: 'manufacturer',
    company: 'Intel Corp'
  },
  {
    id: '0x3456789012345678901234567890123456789012',
    address: '0x3456789012345678901234567890123456789012',
    name: 'Dr. Sarah Chen',
    role: 'verification_body',
    company: 'NCCR Labs'
  },
  {
    id: '0x4567890123456789012345678901234567890123',
    address: '0x4567890123456789012345678901234567890123',
    name: 'Mike Johnson',
    role: 'supplier',
    company: 'TechSupply Inc'
  }
];

export const mockICRecords: ICRecord[] = [
  {
    id: 'IC-2024-001',
    name: 'Intel Core i7-13700K',
    manufacturer: 'Intel Corp',
    frequencySignature: [2.5, 3.1, 3.4, 2.8, 3.2, 2.9, 3.3, 2.7],
    authenticity: 'real',
    confidence: 98.5,
    verifiedBy: 'NCCR Labs',
    blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    uploadedAt: new Date('2024-01-15'),
    uploadedBy: 'John Smith',
    status: 'verified',
    blockchainCredit: 950
  },
  {
    id: 'IC-2024-002',
    name: 'AMD Ryzen 9 7900X',
    manufacturer: 'AMD Inc',
    frequencySignature: [3.0, 3.7, 4.2, 3.5, 3.9, 3.3, 4.0, 3.1],
    authenticity: 'real',
    confidence: 96.2,
    verifiedBy: 'NCCR Labs',
    blockchainHash: '0x9876543210fedcba0987654321fedcba09876543',
    uploadedAt: new Date('2024-01-14'),
    uploadedBy: 'Jane Doe',
    status: 'verified',
    blockchainCredit: 940
  },
  {
    id: 'IC-2024-003',
    name: 'Fake Intel i9-12900K',
    manufacturer: 'Unknown',
    frequencySignature: [2.1, 2.4, 2.8, 2.0, 2.3, 2.5, 2.7, 1.9],
    authenticity: 'fake',
    confidence: 92.8,
    verifiedBy: 'NCCR Labs',
    uploadedAt: new Date('2024-01-13'),
    uploadedBy: 'Security Team',
    status: 'verified',
    blockchainCredit: 0
  },
  {
    id: 'IC-2024-004',
    name: 'NVIDIA RTX 4090',
    manufacturer: 'NVIDIA Corp',
    frequencySignature: [1.8, 2.2, 2.5, 2.0, 2.3, 1.9, 2.4, 2.1],
    authenticity: 'real',
    confidence: 99.1,
    verifiedBy: 'NCCR Labs',
    blockchainHash: '0xabcdef1234567890fedcba0987654321abcdef12',
    uploadedAt: new Date('2024-01-12'),
    uploadedBy: 'Tech Verifier',
    status: 'verified',
    blockchainCredit: 980
  },
  {
    id: 'IC-2024-005',
    name: 'Apple M2 Pro',
    manufacturer: 'Apple Inc',
    frequencySignature: [3.2, 3.6, 3.9, 3.4, 3.7, 3.1, 3.8, 3.3],
    authenticity: 'real',
    confidence: 97.3,
    verifiedBy: 'Independent Lab',
    uploadedAt: new Date('2024-01-11'),
    uploadedBy: 'Apple Team',
    status: 'pending',
    blockchainCredit: 0
  }
];

export const generateMockFrequencyData = (): number[] => {
  const baseFreq = 2.0 + Math.random() * 2.0;
  return Array.from({ length: 8 }, () => 
    baseFreq + (Math.random() - 0.5) * 0.8
  );
};

export const simulateAIAnalysis = (frequencyData: number[]): Promise<{
  authenticity: 'real' | 'fake';
  confidence: number;
  processingTime: number;
}> => {
  return new Promise((resolve) => {
    const processingTime = 2000 + Math.random() * 3000;
    
    setTimeout(() => {
      const avgFreq = frequencyData.reduce((a, b) => a + b, 0) / frequencyData.length;
      const variance = frequencyData.reduce((sum, freq) => sum + Math.pow(freq - avgFreq, 2), 0) / frequencyData.length;
      
      // Simple heuristic: real ICs tend to have higher frequencies and more consistent patterns
      const isReal = avgFreq > 2.5 && variance < 0.3 && Math.random() > 0.2;
      const confidence = 85 + Math.random() * 14;
      
      resolve({
        authenticity: isReal ? 'real' : 'fake',
        confidence: Math.round(confidence * 10) / 10,
        processingTime: Math.round(processingTime)
      });
    }, processingTime);
  });
};

export const generateMockBlockchainHash = (): string => {
  return '0x' + Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};