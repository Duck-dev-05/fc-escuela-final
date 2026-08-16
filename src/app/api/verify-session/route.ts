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

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ 
        status: session.status,
        paymentStatus: session.payment_status,
        ok: false 
      });
    }

    const metadata = session.metadata;
    console.log('[VERIFY_SESSION_DEBUG]: Processing session metadata:', JSON.stringify(metadata, null, 2));
    
    if (!metadata) {
      console.error('Session metadata is missing');
      return NextResponse.json({ error: 'Session metadata is missing' }, { status: 400 });
    }

    if (metadata.type === 'ticket') {
      return NextResponse.json({ 
        error: 'Ticket functionality has been removed from this application.',
        message: 'Please contact support for assistance with any existing tickets.'
      }, { status: 400 });
    }
    
    if (metadata.type === 'membership') {
      const { userId, planId } = metadata;
      if (!userId || !planId) {
        return NextResponse.json({ error: 'Missing membership metadata', details: { userId, planId } }, { status: 400 });
      }

      // Check if User exists by ID
      let user = await prisma.user.findUnique({ where: { id: userId } });
      
      // FALLBACK: If ID not found, try to find by Email
      if (!user && session.customer_details?.email) {
        console.log(`User ID '${userId}' not found. Falling back to email lookup for membership: ${session.customer_details.email}`);
        user = await prisma.user.findUnique({ where: { email: session.customer_details.email } });
      }

      if (!user) {
        return NextResponse.json({ 
          error: `Account Mismatch: User not found in database.`, 
          details: `We tried ID '${userId}' and email '${session.customer_details?.email}' for membership upgrade.`,
          missingRecord: 'user', 
          id: userId 
        }, { status: 404 });
      }

      const stableUserId = user.id;
      const membershipType = planId.includes('price_1TGtrg') ? 'pro' : 'elite';
      
      try {
        await prisma.user.update({
          where: { id: stableUserId },
          data: { isMember: true, membershipType, memberSince: new Date() },
        });

        await prisma.membership.upsert({
          where: { id: `mem_${stableUserId}` },
          update: {
            planId,
            status: 'active',
            startDate: new Date(),
            endDate: membershipType === 'pro' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
          create: {
            id: `mem_${stableUserId}`,
            userId: stableUserId,
            planId,
            status: 'active',
            startDate: new Date(),
            endDate: membershipType === 'pro' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
        });

        return NextResponse.json({ ok: true, type: 'membership', membershipType });
      } catch (dbError: any) {
        console.error('DB ERROR:', dbError);
        return NextResponse.json({ error: 'Database membership update failure', details: dbError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      ok: true,
      message: 'Payment verified but no specific action was required for this session type.'
    });

  } catch (error: any) {
    console.error('Error verifying session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
