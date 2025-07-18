import { Lease, LeaseCalculation, JournalEntry } from './types';

// Calculate present value of lease payments
export function calculatePresentValue(
  monthlyPayment: number,
  annualRate: number,
  months: number
): number {
  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) return monthlyPayment * months;
  
  const pv = monthlyPayment * ((1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate);
  return Math.round(pv * 100) / 100;
}

// Calculate lease term in months
export function calculateLeaseTerm(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}

// Main ASC 842 calculation
export function calculateLease(lease: Lease): LeaseCalculation {
  const leaseTerm = calculateLeaseTerm(lease.startDate, lease.endDate);
  const presentValue = calculatePresentValue(lease.monthlyPayment, lease.discountRate, leaseTerm);
  
  const initialLiability = presentValue;
  const initialAsset = presentValue + (lease.initialCosts || 0) + (lease.prepaidRent || 0) - (lease.incentives || 0);
  const monthlyAmortization = initialAsset / leaseTerm;
  
  return {
    leaseTerm,
    presentValue: Math.round(presentValue * 100) / 100,
    initialAsset: Math.round(initialAsset * 100) / 100,
    initialLiability: Math.round(initialLiability * 100) / 100,
    monthlyAmortization: Math.round(monthlyAmortization * 100) / 100,
  };
}

// Generate initial recognition journal entry
export function generateInitialEntry(lease: Lease): JournalEntry {
  const calc = calculateLease(lease);
  
  return {
    leaseId: lease.id || '',
    date: lease.startDate,
    type: 'initial',
    description: `Initial recognition: ${lease.name}`,
    debits: [{ account: 'Right-of-Use Asset', amount: calc.initialAsset }],
    credits: [{ account: 'Lease Liability', amount: calc.initialLiability }],
  };
}

// Generate monthly journal entries
export function generateMonthlyEntries(lease: Lease): JournalEntry[] {
  const calc = calculateLease(lease);
  const entries: JournalEntry[] = [];
  let liability = calc.initialLiability;
  
  for (let month = 1; month <= calc.leaseTerm; month++) {
    const date = new Date(lease.startDate);
    date.setMonth(date.getMonth() + month - 1);
    
    const interest = liability * (lease.discountRate / 12);
    const principal = lease.monthlyPayment - interest;
    liability -= principal;
    
    // Interest and payment entry
    entries.push({
      leaseId: lease.id || '',
      date: date.toISOString().split('T')[0],
      type: 'monthly',
      description: `Month ${month} - Payment and interest`,
      debits: [
        { account: 'Interest Expense', amount: Math.round(interest * 100) / 100 },
        { account: 'Lease Liability', amount: Math.round(principal * 100) / 100 },
      ],
      credits: [{ account: 'Cash', amount: lease.monthlyPayment }],
    });
    
    // Amortization entry
    entries.push({
      leaseId: lease.id || '',
      date: date.toISOString().split('T')[0],
      type: 'monthly',
      description: `Month ${month} - Asset amortization`,
      debits: [{ account: 'Amortization Expense', amount: calc.monthlyAmortization }],
      credits: [{ account: 'Accumulated Amortization', amount: calc.monthlyAmortization }],
    });
  }
  
  return entries;
}
