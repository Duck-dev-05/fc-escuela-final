import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const sessionCookie = await getServerSession(authOptions);

    if (!sessionCookie || !sessionCookie.user || !sessionCookie.user.email) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // If the session wasn't paid or complete, reject
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const userId = session.metadata?.userId || (sessionCookie.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId metadata' }, { status: 400 });
    }

    // Check if the membership was already processed by a webhook to avoid duplicates
    const existingMembership = await prisma.membership.findFirst({
      where: {
        stripeSubscriptionId: session.subscription as string || session.id
      }
    });

    if (existingMembership) {
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    // Determine plan setup
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    const priceId = lineItems.data[0].price?.id;
    
    let membershipType = 'free';
    if (priceId === 'price_1TGtrg09wIpZTJdbzNoTXoIE') membershipType = 'pro';
    if (priceId === 'price_1TGtrh09wIpZTJdbswMvJici') membershipType = 'elite';

    // Update User Registry
    await prisma.user.update({
      where: { id: userId },
      data: {
        membershipType: membershipType,
        isMember: true,
      },
    });

    // Create Active Membership Record
    await prisma.membership.create({
      data: {
        userId: userId,
        planId: priceId || 'unknown',
        status: 'active',
        stripeCustomerId: session.customer as string || 'manual_sync',
        stripeSubscriptionId: session.subscription as string || session.id, // Fallback to session.id for one-time payments
        startDate: new Date(),
      },
    });

    return NextResponse.json({ success: true, membershipType });
  } catch (error: any) {
    console.error('Manual Verification Error:', error);
    return NextResponse.json({ error: 'Failed to verify transaction manually' }, { status: 500 });
  }
}
