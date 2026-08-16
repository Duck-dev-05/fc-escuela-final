import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { matchId, quantity, category } = await req.json();

    if (!matchId || !quantity || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch match data to verify existence and get base price (using hardcoded 30 as per current tickets API)
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    const basePrice = 30; // Using same base price as /api/tickets
    const multiplier = {
      standard: 1,
      premium: 1.5,
      vip: 2,
    }[category as 'standard' | 'premium' | 'vip'] || 1;

    const unitAmount = Math.round(basePrice * multiplier * 100); // Amount in cents

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${match.homeTeam} vs ${match.awayTeam}`,
              description: `Category: ${category.toUpperCase()} | Quantity: ${quantity}`,
            },
            unit_amount: unitAmount,
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile/orders?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/tickets?canceled=true`,
      customer_email: session.user.email,
      metadata: {
        type: 'ticket',
        userId: session.user.id as string,
        matchId,
        quantity: quantity.toString(),
        category,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
