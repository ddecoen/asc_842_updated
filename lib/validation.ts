import { z } from 'zod';

const paymentScheduleSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  monthlyPayment: z.number().positive('Monthly payment must be positive'),
  startMonth: z.number().int().min(1).max(12).optional(),
  endMonth: z.number().int().min(1).max(12).optional(),
});

const preASC842PaymentSchema = z.object({
  date: z.string().min(1, 'Payment date is required'),
  amount: z.number().positive('Payment amount must be positive'),
  description: z.string().optional(),
});

export const leaseSchema = z.object({
  name: z.string().min(1, 'Lease name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  // Legacy field for backward compatibility
  monthlyPayment: z.number().positive('Monthly payment must be positive').optional(),
  // New variable payment structure
  paymentSchedule: z.array(paymentScheduleSchema).optional(),
  discountRate: z.number().min(0).max(1, 'Discount rate must be between 0 and 1'),
  prepaidRent: z.number().min(0).optional(),
  initialCosts: z.number().min(0).optional(),
  incentives: z.number().min(0).optional(),
  // Pre-ASC 842 payments
  preASC842Payments: z.array(preASC842PaymentSchema).optional(),
  asc842AdoptionDate: z.string().optional(),
}).refine((data) => {
  return new Date(data.endDate) > new Date(data.startDate);
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
}).refine((data) => {
  // Either monthlyPayment or paymentSchedule must be provided
  return data.monthlyPayment || (data.paymentSchedule && data.paymentSchedule.length > 0);
}, {
  message: 'Either monthly payment or payment schedule must be provided',
  path: ['monthlyPayment'],
});

export type LeaseInput = z.infer<typeof leaseSchema>;
