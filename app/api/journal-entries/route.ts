import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth } from '@/lib/firebase-admin';
import { Lease } from '@/lib/types';
import { generateInitialEntry, generateMonthlyEntries } from '@/lib/calculations';

// Helper to verify authentication
async function getUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  
  try {
    const token = authHeader.split('Bearer ')[1];
    const adminAuth = getAdminAuth();
    return await adminAuth.verifyIdToken(token);
  } catch {
    return null;
  }
}

// GET /api/journal-entries?leaseId=xxx
export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const leaseId = searchParams.get('leaseId');
    
    if (!leaseId) {
      return NextResponse.json({ error: 'leaseId required' }, { status: 400 });
    }
    
    // Verify user owns the lease
    const adminDb = getAdminDb();
    const leaseDoc = await adminDb.collection('leases').doc(leaseId).get();
    if (!leaseDoc.exists) {
      return NextResponse.json({ error: 'Lease not found' }, { status: 404 });
    }
    
    const leaseData = leaseDoc.data() as Lease;
    if (leaseData.userId !== user.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Generate journal entries
    const fullLease = { id: leaseId, ...leaseData };
    const initialEntry = generateInitialEntry(fullLease);
    const monthlyEntries = generateMonthlyEntries(fullLease);
    const allEntries = [initialEntry, ...monthlyEntries];
    
    return NextResponse.json({ entries: allEntries });
  } catch (error) {
    console.error('Error generating journal entries:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
