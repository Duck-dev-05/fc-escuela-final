import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { createCheckoutSession } from '@/lib/stripe';

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized access protocol' }, { status: 401 });
    }

    const body = await req.json();
    const { priceId } = body;

    if (!priceId) {
      return NextResponse.json({ error: 'Missing price registry ID' }, { status: 400 });
    }

    // Determine secure success and cancel URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const successUrl = `${baseUrl}/profile/membership/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/profile/membership?canceled=true`;

    const stripeSession = await createCheckoutSession({
      userId: (session.user as any).id,
      userEmail: session.user.email,
      priceId: priceId,
      successUrl,
      cancelUrl,
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to initialize secure financial gate' }, { status: 500 });
  }
}
