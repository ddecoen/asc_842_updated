import { NextRequest, NextResponse } from 'next/server';
import { leaseSchema } from '@/lib/validation';
import { Lease } from '@/lib/types';

// Simple in-memory storage for demo purposes
const leases: Lease[] = [];
let nextId = 1;

// GET /api/leases - Get all leases
export async function GET() {
  try {
    return NextResponse.json({ leases });
  } catch (error) {
    console.error('Error fetching leases:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
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
    
    const leaseData: Lease = {
      id: nextId.toString(),
      ...result.data,
      createdAt: new Date().toISOString(),
    };
    
    leases.push(leaseData);
    nextId++;
    
    return NextResponse.json({ lease: leaseData }, { status: 201 });
  } catch (error) {
    console.error('Error creating lease:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
