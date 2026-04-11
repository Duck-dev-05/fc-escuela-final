import { PrismaClient } from '@prisma/client';
import path from 'path';

// Inside Docker, we should use the linked service names if DATABASE_URL is provided in env
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// We use the internal or public URL depending on environment
const ADMIN_API_URL = process.env.INTERNAL_ADMIN_API_URL || process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001/api/external';

async function sync() {
  console.log('--- STARTING CATCH-UP SYNC ---');
  console.log(`Target Admin URL: ${ADMIN_API_URL}`);

  try {
    console.log('Fetching tickets from PostgreSQL...');
    const tickets = await prisma.ticket.findMany({
      include: {
        match: true,
        user: true,
      },
      orderBy: { purchaseDate: 'desc' }
    });

    console.log(`Found ${tickets.length} tickets in database.`);

    let successCount = 0;
    let failCount = 0;

    for (const ticket of tickets) {
      try {
        const payload = {
          id: ticket.id,
          matchId: ticket.matchId,
          matchName: ticket.match ? `${ticket.match.homeTeam} vs ${ticket.match.awayTeam}` : 'Unknown Match',
          userId: ticket.userId,
          userName: ticket.user?.name || 'Anonymous',
          userEmail: ticket.user?.email || 'N/A',
          quantity: ticket.quantity,
          price: ticket.price,
          category: ticket.category,
          purchaseDate: ticket.purchaseDate.toISOString(),
        };

        const res = await fetch(ADMIN_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          console.log(`[OK] Synced ticket ${ticket.id}`);
          successCount++;
        } else {
          const text = await res.text();
          console.error(`[FAIL] Ticket ${ticket.id}: Status ${res.status} - ${text}`);
          failCount++;
        }
      } catch (err: any) {
        console.error(`[ERROR] Ticket ${ticket.id}: ${err.message}`);
        failCount++;
      }
    }

    console.log('\n--- SYNC SUMMARY ---');
    console.log(`Total: ${tickets.length}`);
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failCount}`);

  } catch (error: any) {
    console.error('CRITICAL SYNC ERROR:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

sync();
