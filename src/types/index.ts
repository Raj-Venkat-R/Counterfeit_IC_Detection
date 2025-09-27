export interface User {
  id: string;
  address: string;
  name: string;
  role: UserRole;
  company?: string;
  avatar?: string;
  ensName?: string;
}

export type UserRole = 'manufacturer' | 'supplier' | 'ngo' | 'community' | 'verification_body' | 'company' | 'admin';

export interface ICRecord {
  id: string;
  name: string;
  manufacturer: string;
  frequencySignature: number[];
  authenticity: 'real' | 'fake';
  confidence: number;
  verifiedBy: string;
  blockchainHash?: string;
  uploadedAt: Date;
  uploadedBy: string;
  status: 'pending' | 'verified' | 'rejected';
  blockchainCredit?: number;
}

export interface AnalysisResult {
  authenticity: 'real' | 'fake';
  confidence: number;
  processingTime: number;
  modelVersion: string;
}

export interface BlockchainRecord {
  hash: string;
  timestamp: Date;
  authenticity: 'real' | 'fake';
  confidence: number;
  verifier: string;
}