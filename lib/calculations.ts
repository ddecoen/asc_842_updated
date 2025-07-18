import { Lease, LeaseCalculation, JournalEntry } from './types';

// Get payment amount for a specific month in the lease
export function getPaymentForMonth(lease: Lease, monthIndex: number): number {
  // If using legacy monthlyPayment field
  if (lease.monthlyPayment && !lease.paymentSchedule) {
    return lease.monthlyPayment;
  }
  
  if (!lease.paymentSchedule || lease.paymentSchedule.length === 0) {
    return lease.monthlyPayment || 0;
  }
  
  const startDate = new Date(lease.startDate);
  const currentDate = new Date(startDate);
  currentDate.setMonth(currentDate.getMonth() + monthIndex);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  
  // Find the payment schedule for this year
  const yearSchedule = lease.paymentSchedule.find(schedule => schedule.year === currentYear);
  if (!yearSchedule) {
    // If no schedule for this year, use the last available schedule
    const sortedSchedules = lease.paymentSchedule.sort((a, b) => a.year - b.year);
    const lastSchedule = sortedSchedules[sortedSchedules.length - 1];
    return lastSchedule?.monthlyPayment || 0;
  }
  
  // Check if current month is within the specified range (if any)
  if (yearSchedule.startMonth && currentMonth < yearSchedule.startMonth) {
    return 0;
  }
  if (yearSchedule.endMonth && currentMonth > yearSchedule.endMonth) {
    return 0;
  }
  
  return yearSchedule.monthlyPayment;
}

// Calculate present value of variable lease payments
export function calculateVariablePresentValue(lease: Lease): number {
  const leaseTerm = calculateLeaseTerm(lease.startDate, lease.endDate);
  const monthlyRate = lease.discountRate / 12;
  let presentValue = 0;
  
  for (let month = 0; month < leaseTerm; month++) {
    const payment = getPaymentForMonth(lease, month);
    if (monthlyRate === 0) {
      presentValue += payment;
    } else {
      presentValue += payment / Math.pow(1 + monthlyRate, month + 1);
    }
  }
  
  return Math.round(presentValue * 100) / 100;
}

// Calculate present value of lease payments (legacy function for backward compatibility)
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
  
  // Use variable payment calculation if payment schedule exists, otherwise use legacy calculation
  let presentValue: number;
  if (lease.paymentSchedule && lease.paymentSchedule.length > 0) {
    presentValue = calculateVariablePresentValue(lease);
  } else if (lease.monthlyPayment) {
    presentValue = calculatePresentValue(lease.monthlyPayment, lease.discountRate, leaseTerm);
  } else {
    throw new Error('No payment information provided');
  }
  
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
    
    // Get the actual payment for this month (handles variable payments)
    const monthlyPayment = getPaymentForMonth(lease, month - 1);
    
    if (monthlyPayment > 0) {
      const interest = liability * (lease.discountRate / 12);
      const principal = monthlyPayment - interest;
      liability -= principal;
      
      // Interest and payment entry
      entries.push({
        leaseId: lease.id || '',
        date: date.toISOString().split('T')[0],
        type: 'monthly',
        description: `Month ${month} - Payment and interest (${formatCurrency(monthlyPayment)})`,
        debits: [
          { account: 'Interest Expense', amount: Math.round(interest * 100) / 100 },
          { account: 'Lease Liability', amount: Math.round(principal * 100) / 100 },
        ],
        credits: [{ account: 'Cash', amount: monthlyPayment }],
      });
    }
    
    // Amortization entry (always occurs regardless of payment)
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

// Helper function to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
