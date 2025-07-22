import { NextRequest, NextResponse } from 'next/server';
import { leaseSchema } from '@/lib/validation';
import { createLease, getLeases, getLease, updateLease, deleteLease } from '@/lib/firestore';

// GET /api/leases - Get all leases
export async function GET() {
  try {
    const leases = await getLeases();
    return NextResponse.json({ leases });
  } catch (error) {
    console.error('Error fetching leases:', error);
    return NextResponse.json({ error: 'Failed to fetch leases' }, { status: 500 });
  }
}

// POST /api/leases - Create new lease
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = leaseSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.issues },
        { status: 400 }
      );
    }
    
    const leaseId = await createLease(result.data);
    const lease = await getLease(leaseId);
    
    return NextResponse.json({ lease }, { status: 201 });
  } catch (error) {
    console.error('Error creating lease:', error);
    return NextResponse.json({ error: 'Failed to create lease' }, { status: 500 });
  }
}

// PUT /api/leases - Update lease
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Lease ID required' }, { status: 400 });
    }
    
    await updateLease(id, updates);
    const lease = await getLease(id);
    
    return NextResponse.json({ lease });
  } catch (error) {
    console.error('Error updating lease:', error);
    return NextResponse.json({ error: 'Failed to update lease' }, { status: 500 });
  }
}

// DELETE /api/leases - Delete lease
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Lease ID required' }, { status: 400 });
    }
    
    await deleteLease(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lease:', error);
    return NextResponse.json({ error: 'Failed to delete lease' }, { status: 500 });
  }
}
