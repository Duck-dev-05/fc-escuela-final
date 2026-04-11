import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const metadata = session.metadata;

      if (metadata?.type === 'membership') {
        const { userId, planId } = metadata;
        const membershipType = planId.includes('price_1TGtrg') ? 'pro' : 'elite';
        
        // Update user status
        await prisma.user.update({
          where: { id: userId },
          data: {
            isMember: true,
            membershipType: membershipType,
            memberSince: new Date(),
          },
        });

        // Upsert membership record
        await prisma.membership.upsert({
          where: { id: `mem_${userId}` },
          update: {
            planId,
            status: 'active',
            startDate: new Date(),
            endDate: membershipType === 'pro' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
          create: {
            id: `mem_${userId}`,
            userId,
            planId,
            status: 'active',
            startDate: new Date(),
            endDate: membershipType === 'pro' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
        });
        
        return NextResponse.json({ 
          status: session.status,
          paymentStatus: session.payment_status,
          ok: true,
          membershipType
        });
      }
    }

    return NextResponse.json({ 
      status: session.status,
      paymentStatus: session.payment_status,
      ok: session.payment_status === 'paid'
    });
  } catch (error: any) {
    console.error('Error verifying membership session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
