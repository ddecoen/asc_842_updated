'use client';

import { useState } from 'react';
import { leaseSchema, LeaseInput } from '@/lib/validation';
import { PaymentSchedule, PreASC842Payment, Sublease } from '@/lib/types';

interface LeaseFormProps {
  onSubmit: (data: LeaseInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function LeaseForm({ onSubmit, onCancel, loading = false }: LeaseFormProps) {
  const [paymentType, setPaymentType] = useState<'fixed' | 'variable'>('fixed');
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    monthlyPayment: 0,
    discountRate: 0,
    prepaidRent: 0,
    initialCosts: 0,
    incentives: 0,
    asc842AdoptionDate: '',
  });
  
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentSchedule[]>([]);
  const [preASC842Payments, setPreASC842Payments] = useState<PreASC842Payment[]>([]);
  const [subleases, setSubleases] = useState<Sublease[]>([]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Prepare the data based on payment type
    const submitData = {
      ...formData,
      ...(paymentType === 'variable' ? { paymentSchedule } : {}),
      ...(preASC842Payments.length > 0 ? { preASC842Payments } : {}),
      ...(subleases.length > 0 ? { subleases } : {}),
    };

    const result = leaseSchema.safeParse(submitData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await onSubmit(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setErrors({ general: errorMessage });
    }
  };

  const addPaymentSchedule = () => {
    const currentYear = new Date().getFullYear();
    setPaymentSchedule([...paymentSchedule, {
      year: currentYear,
      monthlyPayment: 0,
    }]);
  };

  const updatePaymentSchedule = (index: number, field: keyof PaymentSchedule, value: number | undefined) => {
    const updated = [...paymentSchedule];
    updated[index] = { ...updated[index], [field]: value };
    setPaymentSchedule(updated);
  };

  const removePaymentSchedule = (index: number) => {
    setPaymentSchedule(paymentSchedule.filter((_, i) => i !== index));
  };

  const addPreASC842Payment = () => {
    setPreASC842Payments([...preASC842Payments, {
      date: '',
      amount: 0,
      description: '',
    }]);
  };

  const updatePreASC842Payment = (index: number, field: keyof PreASC842Payment, value: string | number) => {
    const updated = [...preASC842Payments];
    updated[index] = { ...updated[index], [field]: value };
    setPreASC842Payments(updated);
  };

  const removePreASC842Payment = (index: number) => {
    setPreASC842Payments(preASC842Payments.filter((_, i) => i !== index));
  };

  const addSublease = () => {
    setSubleases([...subleases, {
      sublesseeName: '',
      startDate: '',
      endDate: '',
      monthlyIncome: 0,
      description: '',
    }]);
  };

  const updateSublease = (index: number, field: keyof Sublease, value: string | number) => {
    const updated = [...subleases];
    updated[index] = { ...updated[index], [field]: value };
    setSubleases(updated);
  };

  const removeSublease = (index: number) => {
    setSubleases(subleases.filter((_, i) => i !== index));
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Create New Lease</h2>
            <p className="text-gray-600">Enter lease details for ASC 842 calculations</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lease Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Office Building Lease"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.startDate && <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.endDate && <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ASC 842 Adoption Date
                </label>
                <input
                  type="date"
                  value={formData.asc842AdoptionDate}
                  onChange={(e) => handleChange('asc842AdoptionDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">Optional: Date when ASC 842 was adopted for this lease</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Structure *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="fixed"
                      checked={paymentType === 'fixed'}
                      onChange={(e) => setPaymentType(e.target.value as 'fixed' | 'variable')}
                      className="mr-2"
                    />
                    Fixed Monthly Payment
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="variable"
                      checked={paymentType === 'variable'}
                      onChange={(e) => setPaymentType(e.target.value as 'fixed' | 'variable')}
                      className="mr-2"
                    />
                    Variable Payment Schedule
                  </label>
                </div>
              </div>

              {paymentType === 'fixed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Payment ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.monthlyPayment}
                    onChange={(e) => handleChange('monthlyPayment', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="5000.00"
                  />
                  {errors.monthlyPayment && <p className="text-red-600 text-sm mt-1">{errors.monthlyPayment}</p>}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Rate (Annual %) *
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  max="1"
                  value={formData.discountRate}
                  onChange={(e) => handleChange('discountRate', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.05 (for 5%)"
                />
                {errors.discountRate && <p className="text-red-600 text-sm mt-1">{errors.discountRate}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prepaid Rent ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.prepaidRent}
                  onChange={(e) => handleChange('prepaidRent', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Direct Costs ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.initialCosts}
                  onChange={(e) => handleChange('initialCosts', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lease Incentives ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.incentives}
                  onChange={(e) => handleChange('incentives', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Variable Payment Schedule */}
            {paymentType === 'variable' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Payment Schedule</h3>
                  <button
                    type="button"
                    onClick={addPaymentSchedule}
                    className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                  >
                    Add Year
                  </button>
                </div>
                {paymentSchedule.map((schedule, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Year
                        </label>
                        <input
                          type="number"
                          min="2000"
                          max="2100"
                          value={schedule.year}
                          onChange={(e) => updatePaymentSchedule(index, 'year', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Monthly Payment ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={schedule.monthlyPayment}
                          onChange={(e) => updatePaymentSchedule(index, 'monthlyPayment', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Month (Optional)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={schedule.startMonth || ''}
                          onChange={(e) => updatePaymentSchedule(index, 'startMonth', parseInt(e.target.value) || undefined)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="1-12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Month (Optional)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={schedule.endMonth || ''}
                          onChange={(e) => updatePaymentSchedule(index, 'endMonth', parseInt(e.target.value) || undefined)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="1-12"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePaymentSchedule(index)}
                      className="mt-2 text-red-600 text-sm hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {paymentSchedule.length === 0 && (
                  <p className="text-gray-500 text-sm">No payment schedule defined. Click &quot;Add Year&quot; to start.</p>
                )}
              </div>
            )}

            {/* Pre-ASC 842 Payments */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Pre-ASC 842 Payments</h3>
                  <p className="text-sm text-gray-600">Payments made before ASC 842 adoption (optional)</p>
                </div>
                <button
                  type="button"
                  onClick={addPreASC842Payment}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                >
                  Add Payment
                </button>
              </div>
              {preASC842Payments.map((payment, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Date
                      </label>
                      <input
                        type="date"
                        value={payment.date}
                        onChange={(e) => updatePreASC842Payment(index, 'date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={payment.amount}
                        onChange={(e) => updatePreASC842Payment(index, 'amount', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={payment.description || ''}
                        onChange={(e) => updatePreASC842Payment(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Security deposit"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePreASC842Payment(index)}
                    className="mt-2 text-red-600 text-sm hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {preASC842Payments.length === 0 && (
                <p className="text-gray-500 text-sm">No pre-ASC 842 payments recorded.</p>
              )}
            </div>

            {/* Subleases */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Subleases</h3>
                  <p className="text-sm text-gray-600">Track sublease income during the lease term (optional)</p>
                </div>
                <button
                  type="button"
                  onClick={addSublease}
                  className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700"
                >
                  Add Sublease
                </button>
              </div>
              {subleases.map((sublease, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sublessee Name
                      </label>
                      <input
                        type="text"
                        value={sublease.sublesseeName}
                        onChange={(e) => updateSublease(index, 'sublesseeName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Company or individual name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monthly Income ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={sublease.monthlyIncome}
                        onChange={(e) => updateSublease(index, 'monthlyIncome', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sublease Start Date
                      </label>
                      <input
                        type="date"
                        value={sublease.startDate}
                        onChange={(e) => updateSublease(index, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sublease End Date
                      </label>
                      <input
                        type="date"
                        value={sublease.endDate}
                        onChange={(e) => updateSublease(index, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Security Deposit ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={sublease.securityDeposit || ''}
                        onChange={(e) => updateSublease(index, 'securityDeposit', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={sublease.description || ''}
                        onChange={(e) => updateSublease(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Office space sublease"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSublease(index)}
                    className="mt-2 text-red-600 text-sm hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {subleases.length === 0 && (
                <p className="text-gray-500 text-sm">No subleases recorded.</p>
              )}
            </div>
            
            {errors.general && (
              <div className="text-red-600 text-sm text-center">{errors.general}</div>
            )}
            
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Lease'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
