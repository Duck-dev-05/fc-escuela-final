import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getCache, setCache, invalidateCache, CACHE_TTL } from '@/lib/redis';

const TICKETS_CACHE_KEY = 'all_tickets';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true';

    if (isAdmin) {
      const dbTickets = await prisma.ticket.findMany({
        include: {
          match: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              roles: true,
            }
          },
        },
        orderBy: {
          purchaseDate: 'desc',
        },
      });

      // Transform to ensure price is always present
      const tickets = dbTickets.map(t => {
        let price = (t as any).price;
        if (price === undefined || price === null) {
          // Fallback calculation if DB hasn't been migrated yet
          const multipliers: Record<string, number> = { standard: 1, premium: 1.5, vip: 2 };
          price = 30 * (multipliers[t.category.toLowerCase()] || 1);
        }
        return { ...t, price };
      });

      return NextResponse.json(tickets);
    }

    // Try to get from cache for regular users
    const cachedTickets = await getCache(TICKETS_CACHE_KEY);
    if (cachedTickets) return NextResponse.json(cachedTickets);

    // Get all matches without date filtering for debugging
    const matches = await prisma.match.findMany({
      orderBy: {
        date: 'asc',
      },
    });

    // Transform the data for the frontend
    const tickets = matches.map(match => ({
      id: match.id,
      match: `${match.homeTeam} vs ${match.awayTeam}`,
      date: match.date.toISOString().split('T')[0],
      time: match.time,
      venue: match.venue,
      price: 30, // Base price
      status: "Available", // We'll implement dynamic status later
      matchId: match.id,
      availableSeats: match.stadiumCapacity || null,
    }));

    // Set cache
    await setCache(TICKETS_CACHE_KEY, tickets, CACHE_TTL.MATCHES);

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { matchId, quantity, category } = data;

    // Validate the match exists and has capacity
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { tickets: true },
    });

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }

    if (match.stadiumCapacity && match.tickets.length + quantity > match.stadiumCapacity) {
      return NextResponse.json(
        { error: 'Not enough available seats' },
        { status: 400 }
      );
    }

    // Create the ticket
    const ticket = await prisma.ticket.create({
      data: {
        matchId,
        quantity,
        category,
        userId: session.user.id,
      },
    });

    // Invalidate the tickets cache when a new ticket is purchased
    await invalidateCache(TICKETS_CACHE_KEY);

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Failed to create ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}
 