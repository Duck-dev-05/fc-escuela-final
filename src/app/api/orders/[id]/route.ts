import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Fetch the ticket and its related match
    const ticket = await prisma.ticket.findFirst({
      where: { 
        id,
        userId: session.user.id 
      },
      include: {
        match: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Map to a clean response format
    const orderDetail = {
      type: 'ticket',
      id: ticket.id,
      date: ticket.purchaseDate,
      quantity: ticket.quantity,
      category: ticket.category,
      match: ticket.match ? {
        id: ticket.match.id,
        name: `${ticket.match.homeTeam} vs ${ticket.match.awayTeam}`,
        homeTeam: ticket.match.homeTeam,
        awayTeam: ticket.match.awayTeam,
        date: ticket.match.date,
        time: ticket.match.time,
        venue: ticket.match.venue,
        competition: ticket.match.competition,
      } : null,
    };

    return NextResponse.json({ order: orderDetail });
  } catch (error) {
    console.error('Failed to fetch order detail:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
