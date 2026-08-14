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

      if (metadata?.type === 'ticket') {
        const { userId, matchId, quantity, category } = metadata;
        
        // Use session ID as a stable prefix for the ticket ID to prevent double creation
        const stableTicketId = `tkt_${session.id}`;

        const existingTicket = await prisma.ticket.findUnique({
          where: { id: stableTicketId }
        });

        if (!existingTicket) {
          await prisma.ticket.create({
            data: {
              id: stableTicketId,
              userId,
              matchId,
              quantity: parseInt(quantity),
              category,
            },
          });
          console.log(`Ticket ${stableTicketId} created successfully via verification flow.`);
        }
        
        return NextResponse.json({ 
          status: session.status,
          paymentStatus: session.payment_status,
          ok: true,
          ticketId: stableTicketId
        });
      }
    }

    return NextResponse.json({ 
      status: session.status,
      paymentStatus: session.payment_status,
      ok: session.payment_status === 'paid'
    });
  } catch (error: any) {
    console.error('Error verifying ticket session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
