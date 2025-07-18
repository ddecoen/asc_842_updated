'use client';

import { useState, useEffect, useCallback } from 'react';
import { Lease, JournalEntry } from '@/lib/types';
import { LeaseInput } from '@/lib/validation';
import LeaseForm from './LeaseForm';

export default function Dashboard() {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [selectedLease, setSelectedLease] = useState<Lease | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLeases = useCallback(async () => {
    try {
      const response = await fetch('/api/leases');

      if (response.ok) {
        const data = await response.json();
        setLeases(data.leases);
      }
    } catch {
      setError('Failed to fetch leases');
    }
  }, []);

  useEffect(() => {
    fetchLeases();
  }, [fetchLeases]);

  const fetchJournalEntries = async (leaseId: string) => {
    try {
      const response = await fetch(`/api/journal-entries?leaseId=${leaseId}`);

      if (response.ok) {
        const data = await response.json();
        setJournalEntries(data.entries);
      }
    } catch {
      setError('Failed to fetch journal entries');
    }
  };

  const handleCreateLease = async (leaseData: LeaseInput) => {
    setLoading(true);
    try {
      const response = await fetch('/api/leases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leaseData),
      });

      if (response.ok) {
        await fetchLeases();
        setShowForm(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create lease');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleViewEntries = async (lease: Lease) => {
    setSelectedLease(lease);
    await fetchJournalEntries(lease.id!);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (showForm) {
    return (
      <LeaseForm
        onSubmit={handleCreateLease}
        onCancel={() => setShowForm(false)}
        loading={loading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ASC 842 Lease Accounting</h1>
            <p className="text-gray-600">Welcome to ASC 842 Lease Accounting</p>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              New Lease
            </button>

          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button onClick={() => setError('')} className="float-right">×</button>
          </div>
        )}

        {/* Leases Table */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Your Leases</h2>
          </div>
          <div className="p-6">
            {leases.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No leases found. Create your first lease to get started.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create Lease
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Structure</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leases.map((lease) => (
                      <tr key={lease.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lease.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lease.startDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lease.endDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lease.paymentSchedule && lease.paymentSchedule.length > 0 ? (
                            <div>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Variable</span>
                              <div className="text-xs text-gray-500 mt-1">
                                {lease.paymentSchedule.length} year{lease.paymentSchedule.length > 1 ? 's' : ''} defined
                              </div>
                            </div>
                          ) : lease.monthlyPayment ? (
                            <div>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Fixed</span>
                              <div className="text-xs text-gray-500 mt-1">
                                {formatCurrency(lease.monthlyPayment)}/month
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">Not defined</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleViewEntries(lease)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Journal Entries
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Lease Details */}
        {selectedLease && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Lease Details - {selectedLease.name}</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Payment Schedule */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Schedule</h3>
                {selectedLease.paymentSchedule && selectedLease.paymentSchedule.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Payment</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedLease.paymentSchedule.map((schedule, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{schedule.year}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(schedule.monthlyPayment)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {schedule.startMonth && schedule.endMonth 
                                ? `Months ${schedule.startMonth}-${schedule.endMonth}`
                                : schedule.startMonth 
                                ? `From month ${schedule.startMonth}`
                                : schedule.endMonth 
                                ? `Until month ${schedule.endMonth}`
                                : 'Full year'
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : selectedLease.monthlyPayment ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Fixed monthly payment: <span className="font-semibold">{formatCurrency(selectedLease.monthlyPayment)}</span></p>
                  </div>
                ) : (
                  <p className="text-gray-500">No payment schedule defined.</p>
                )}
              </div>

              {/* Pre-ASC 842 Payments */}
              {selectedLease.preASC842Payments && selectedLease.preASC842Payments.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Pre-ASC 842 Payments</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedLease.preASC842Payments.map((payment, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(payment.amount)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.description || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Total Pre-ASC 842 Payments:</strong> {formatCurrency(
                        selectedLease.preASC842Payments.reduce((sum, payment) => sum + payment.amount, 0)
                      )}
                    </p>
                    {selectedLease.asc842AdoptionDate && (
                      <p className="text-sm text-blue-600 mt-1">
                        ASC 842 Adoption Date: {selectedLease.asc842AdoptionDate}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Journal Entries */}
        {selectedLease && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Journal Entries - {selectedLease.name}</h2>
            </div>
            <div className="p-6">
              {journalEntries.length === 0 ? (
                <p className="text-gray-500">No journal entries found.</p>
              ) : (
                <div className="space-y-4">
                  {journalEntries.map((entry, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{entry.description}</h4>
                        <span className="text-sm text-gray-500">{entry.date}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-sm mb-2">Debits</h5>
                          {entry.debits.map((debit, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{debit.account}</span>
                              <span>{formatCurrency(debit.amount)}</span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2">Credits</h5>
                          {entry.credits.map((credit, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{credit.account}</span>
                              <span>{formatCurrency(credit.amount)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
