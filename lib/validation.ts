import { z } from 'zod';

export const leaseSchema = z.object({
  name: z.string().min(1, 'Lease name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  monthlyPayment: z.number().positive('Monthly payment must be positive'),
  discountRate: z.number().min(0).max(1, 'Discount rate must be between 0 and 1'),
  prepaidRent: z.number().min(0).optional(),
  initialCosts: z.number().min(0).optional(),
  incentives: z.number().min(0).optional(),
}).refine((data) => {
  return new Date(data.endDate) > new Date(data.startDate);
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export type LeaseInput = z.infer<typeof leaseSchema>;
