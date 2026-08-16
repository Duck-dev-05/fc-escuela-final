import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return NextResponse.json({ 
    error: 'Payment functionality has been removed from this application.',
    message: 'Please contact support for assistance with any existing memberships or payments.'
  }, { status: 400 });
}
