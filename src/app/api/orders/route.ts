import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient, Ticket, Match } from '@prisma/client';

const prisma = new PrismaClient();

interface Order {
  type: 'ticket' | 'membership';
  id: string;
  date: Date;
  details: {
    match?: {
      id: string;
      name: string;
      date: string;
      time: string;
      venue: string;
    };
    quantity?: number;
    category?: string;
    planId?: string;
    status?: string;
    endDate?: Date;
  };
}

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch tickets for the user, including match info and purchaseDate
    const tickets = await prisma.ticket.findMany({
      where: { userId: session.user.id },
      include: {
        match: true,
      },
      orderBy: { purchaseDate: 'desc' },
    });

    // Map to Order format
    const orders = tickets.map(ticket => ({
      type: 'ticket',
      id: ticket.id,
      date: ticket.purchaseDate,
      details: {
        match: ticket.match
          ? {
              id: ticket.match.id,
              name: `${ticket.match.homeTeam} vs ${ticket.match.awayTeam}`,
              date: ticket.match.date.toISOString().slice(0, 10),
              time: ticket.match.time,
              venue: ticket.match.venue,
            }
          : undefined,
        quantity: ticket.quantity,
        category: ticket.category,
      },
    }));

    // Fetch memberships for the user
    const memberships = await prisma.membership.findMany({
      where: { userId: session.user.id },
      orderBy: { startDate: 'desc' },
    });

    const now = new Date();

    // Map memberships to Order format with expiry detection
    const membershipOrders: any[] = memberships.map(m => {
      const isExpired = m.endDate && new Date(m.endDate) < now;
      return {
        type: 'membership',
        id: m.id,
        date: m.startDate,
        details: {
          planId: m.planId,
          status: isExpired ? 'expired' : m.status,
          endDate: m.endDate,
        },
      };
    });

    // Combine and sort by date desc
    const allOrders = [...orders, ...membershipOrders].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({ orders: allOrders });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
} 