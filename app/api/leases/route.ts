import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth } from '@/lib/firebase-admin';
import { leaseSchema } from '@/lib/validation';
import { Lease } from '@/lib/types';

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

// GET /api/leases - Get user's leases
export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const adminDb = getAdminDb();
    const snapshot = await adminDb
      .collection('leases')
      .where('userId', '==', user.uid)
      .get();
    
    const leases: Lease[] = [];
    snapshot.forEach((doc) => {
      leases.push({ id: doc.id, ...doc.data() } as Lease);
    });
    
    return NextResponse.json({ leases });
  } catch (error) {
    console.error('Error fetching leases:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// POST /api/leases - Create new lease
export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const result = leaseSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.issues },
        { status: 400 }
      );
    }
    
    const leaseData: Omit<Lease, 'id'> = {
      ...result.data,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };
    
    const adminDb = getAdminDb();
    const docRef = await adminDb.collection('leases').add(leaseData);
    const lease = { id: docRef.id, ...leaseData };
    
    return NextResponse.json({ lease }, { status: 201 });
  } catch (error) {
    console.error('Error creating lease:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
