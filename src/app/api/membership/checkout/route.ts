import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

const PLAN_MAP: Record<string, { name: string; amount: number; interval: 'month' | 'year' }> = {
  'price_1TGtrg09wIpZTJdbzNoTXoIE': { name: 'Pro Member', amount: 1900, interval: 'month' },
  'price_1TGtrh09wIpZTJdbswMvJici': { name: 'Elite VIP', amount: 19900, interval: 'year' },
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await req.json();

    if (!planId || !PLAN_MAP[planId]) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    const { name, amount, interval } = PLAN_MAP[planId];

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: name,
              description: `FC Escuela ${name} Membership`,
            },
            unit_amount: amount,
            recurring: {
              interval: interval,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile/orders?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile/membership`,
      customer_email: session.user.email,
      metadata: {
        type: 'membership',
        userId: session.user.id as string,
        planId,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error('Error creating membership checkout session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
