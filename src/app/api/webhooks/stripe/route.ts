import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = headers();
  const signature = (await headerPayload).get('Stripe-Signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const session = event.data.object as any;

  // Handle successful checkout session completion
  if (event.type === 'checkout.session.completed') {
    const userId = session.metadata?.userId;

    if (!userId) {
      console.error('Missing userId in session metadata');
      return NextResponse.json({ error: 'Missing userId metadata' }, { status: 400 });
    }

    try {
      // Determine membership type based on priceId or metadata
      // For simplicity, we'll extract it from the plan ID if we pass it, 
      // or check the line items.
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const priceId = lineItems.data[0].price?.id;
      
      // Map specific Price IDs to status types
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
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          startDate: new Date(),
        },
      });

      console.log(`Membership status updated for user ${userId} to ${membershipType}`);
    } catch (dbError) {
      console.error('Database update failed:', dbError);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
