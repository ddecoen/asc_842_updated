// Simplified types for ASC 842 lease accounting

export interface PaymentSchedule {
  year: number;
  monthlyPayment: number;
  startMonth?: number; // Month within the year (1-12)
  endMonth?: number;   // Month within the year (1-12)
}

export interface PreASC842Payment {
  date: string;
  amount: number;
  description?: string;
}

export interface Sublease {
  id?: string;
  sublesseeName: string;
  startDate: string;
  endDate: string;
  monthlyIncome?: number;
  // For variable sublease income
  incomeSchedule?: PaymentSchedule[];
  securityDeposit?: number;
  description?: string;
  createdAt?: string;
}

export interface Lease {
  id?: string;
  userId?: string;
  name: string;
  startDate: string;
  endDate: string;
  // Legacy field for backward compatibility
  monthlyPayment?: number;
  // New variable payment structure
  paymentSchedule?: PaymentSchedule[];
  discountRate: number;
  prepaidRent?: number;
  initialCosts?: number;
  incentives?: number;
  // Pre-ASC 842 payments
  preASC842Payments?: PreASC842Payment[];
  asc842AdoptionDate?: string;
  // Sublease information
  subleases?: Sublease[];
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
