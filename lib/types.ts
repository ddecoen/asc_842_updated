// Simplified types for ASC 842 lease accounting

export interface Lease {
  id?: string;
  userId?: string;
  name: string;
  startDate: string;
  endDate: string;
  monthlyPayment: number;
  discountRate: number;
  prepaidRent?: number;
  initialCosts?: number;
  incentives?: number;
  createdAt?: string;
}

export interface JournalEntry {
  id?: string;
  leaseId: string;
  date: string;
  type: 'initial' | 'monthly';
  description: string;
  debits: { account: string; amount: number }[];
  credits: { account: string; amount: number }[];
}

export interface LeaseCalculation {
  leaseTerm: number;
  presentValue: number;
  initialAsset: number;
  initialLiability: number;
  monthlyAmortization: number;
}
