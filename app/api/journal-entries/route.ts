import { NextRequest, NextResponse } from 'next/server';
import { Lease } from '@/lib/types';
import { generateInitialEntry, generateMonthlyEntries } from '@/lib/calculations';

// Import the leases array from the leases route (in a real app, you'd use a shared data store)

// GET /api/journal-entries?leaseId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leaseId = searchParams.get('leaseId');
    
    if (!leaseId) {
      return NextResponse.json({ error: 'leaseId required' }, { status: 400 });
    }
    
    // For demo purposes, we'll fetch the lease from the leases API
    const leasesResponse = await fetch(`${request.nextUrl.origin}/api/leases`);
    const leasesData = await leasesResponse.json();
    const lease = leasesData.leases.find((l: Lease) => l.id === leaseId);
    
    if (!lease) {
      return NextResponse.json({ error: 'Lease not found' }, { status: 404 });
    }
    
    // Generate journal entries
    const initialEntry = generateInitialEntry(lease);
    const monthlyEntries = generateMonthlyEntries(lease);
    const allEntries = [initialEntry, ...monthlyEntries];
    
    return NextResponse.json({ entries: allEntries });
  } catch (error) {
    console.error('Error generating journal entries:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
