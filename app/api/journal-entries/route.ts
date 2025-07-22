import { NextRequest, NextResponse } from 'next/server';
import { generateInitialEntry, generateMonthlyEntries } from '@/lib/calculations';
import { getLease } from '@/lib/firestore';

// GET /api/journal-entries?leaseId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leaseId = searchParams.get('leaseId');
    
    if (!leaseId) {
      return NextResponse.json({ error: 'leaseId required' }, { status: 400 });
    }
    
    // Fetch the lease from Firestore
    const lease = await getLease(leaseId);
    
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
    return NextResponse.json({ error: 'Failed to generate journal entries' }, { status: 500 });
  }
}
