import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { invalidateCache } from '@/lib/redis';

const TICKETS_CACHE_KEY = 'all_tickets';

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ 
        status: session.status,
        paymentStatus: session.payment_status,
        ok: false 
      });
    }

    const metadata = session.metadata;
    console.log('[VERIFY_SESSION_DEBUG]: Processing session metadata:', JSON.stringify(metadata, null, 2));
    
    if (!metadata) {
      console.error('Session metadata is missing');
      return NextResponse.json({ error: 'Session metadata is missing' }, { status: 400 });
    }

    if (metadata.type === 'ticket') {
      const { userId, matchId, quantity, category } = metadata;
      
      if (!userId || !matchId || !quantity || !category) {
        return NextResponse.json({ error: 'Missing ticket metadata', details: { userId, matchId, quantity } }, { status: 400 });
      }

      // 1. Check if User exists by ID
      let user = await prisma.user.findUnique({ where: { id: userId } });
      
      // FALLBACK: If ID not found, try to find by Email (Crucial for Google/Social log-in consistency)
      if (!user && session.customer_details?.email) {
        console.log(`User ID '${userId}' not found. Falling back to email lookup: ${session.customer_details.email}`);
        user = await prisma.user.findUnique({ where: { email: session.customer_details.email } });
      }

      if (!user) {
        return NextResponse.json({ 
          error: `Account Mismatch: User not found in database.`, 
          details: `We tried ID '${userId}' and email '${session.customer_details?.email}'. Please ensure you are logged in with the same account used for payment.`,
          missingRecord: 'user', 
          id: userId 
        }, { status: 404 });
      }

      // 2. Check if Match exists
      const match = await prisma.match.findUnique({ where: { id: matchId } });
      if (!match) {
        return NextResponse.json({ error: `Match ID '${matchId}' not found in database.`, missingRecord: 'match', id: matchId }, { status: 404 });
      }

      const stableUserId = user.id; // Use the actual DB ID found
      const stableTicketId = `tkt_${session.id}`.substring(0, 191);

      try {
        console.log(`[VERIFY_SESSION]: Checking for existing ticket ${stableTicketId}`);
        const existingTicket = await prisma.ticket.findUnique({ where: { id: stableTicketId } });
        if (!existingTicket) {
          console.log(`[VERIFY_SESSION]: Creating ticket for user ${stableUserId}, match ${matchId}`);
          
          // Calculate unit price from total paid
          const totalPaid = session.amount_total ? session.amount_total / 100 : 0;
          const qty = parseInt(quantity) || 1;
          const unitPrice = totalPaid / qty;

          await prisma.ticket.create({
            data: {
              id: stableTicketId,
              userId: stableUserId,
              matchId,
              quantity: qty,
              price: unitPrice || 30, // Fallback to 30 if amount_total is missing
              category,
            },
          });
          console.log(`[VERIFY_SESSION]: Ticket ${stableTicketId} created successfully at $${unitPrice}/ea`);

          // 3. Sync to footballclubadmin
          const ADMIN_API_URL = process.env.INTERNAL_ADMIN_API_URL || process.env.NEXT_PUBLIC_ADMIN_API_URL;
          console.log(`[VERIFY_SESSION_DEBUG]: Using sync URL: ${ADMIN_API_URL}`);
          
          if (ADMIN_API_URL) {
            try {
              const payload = {
                id: stableTicketId,
                matchId,
                matchName: `${match.homeTeam} vs ${match.awayTeam}`,
                userId: stableUserId,
                userName: user.name,
                userEmail: user.email,
                quantity: qty,
                price: unitPrice || 30,
                category,
                purchaseDate: new Date().toISOString(),
              };
              console.log(`[VERIFY_SESSION_DEBUG]: Pushing to admin at ${ADMIN_API_URL}`, JSON.stringify(payload, null, 2));

              const adminRes = await fetch(ADMIN_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              });
              
              if (!adminRes.ok) {
                const errorText = await adminRes.text();
                console.error(`[VERIFY_SESSION_SYNC_ERROR]: Status ${adminRes.status}, Body: ${errorText}`);
              } else {
                const result = await adminRes.json();
                console.log(`[VERIFY_SESSION_SYNC_SUCCESS]: Admin responded with`, result);
              }
            } catch (syncError) {
              console.error(`[VERIFY_SESSION_SYNC_EXCEPTION]:`, syncError);
            }
          } else {
            console.warn('[VERIFY_SESSION_DEBUG]: NEXT_PUBLIC_ADMIN_API_URL is not defined');
          }
        } else {
          console.log(`[VERIFY_SESSION]: Ticket ${stableTicketId} already exists, skipping creation`);
        }
        
        // Clear cache so the new ticket appears in the UI
        await invalidateCache(TICKETS_CACHE_KEY);
        console.log(`[VERIFY_SESSION]: Cache invalidated for ${TICKETS_CACHE_KEY}`);

        return NextResponse.json({ ok: true, type: 'ticket', id: stableTicketId });
      } catch (dbError: any) {
        console.error('[VERIFY_SESSION_DB_ERROR]:', dbError);
        return NextResponse.json({ error: 'Database creation failure', details: dbError.message }, { status: 500 });
      }
    } 
    
    if (metadata.type === 'membership') {
      const { userId, planId } = metadata;
      if (!userId || !planId) {
        return NextResponse.json({ error: 'Missing membership metadata', details: { userId, planId } }, { status: 400 });
      }

      // Check if User exists by ID
      let user = await prisma.user.findUnique({ where: { id: userId } });
      
      // FALLBACK: If ID not found, try to find by Email
      if (!user && session.customer_details?.email) {
        console.log(`User ID '${userId}' not found. Falling back to email lookup for membership: ${session.customer_details.email}`);
        user = await prisma.user.findUnique({ where: { email: session.customer_details.email } });
      }

      if (!user) {
        return NextResponse.json({ 
          error: `Account Mismatch: User not found in database.`, 
          details: `We tried ID '${userId}' and email '${session.customer_details?.email}' for membership upgrade.`,
          missingRecord: 'user', 
          id: userId 
        }, { status: 404 });
      }

      const stableUserId = user.id;
      const membershipType = planId.includes('price_1TGtrg') ? 'pro' : 'elite';
      
      try {
        await prisma.user.update({
          where: { id: stableUserId },
          data: { isMember: true, membershipType, memberSince: new Date() },
        });

        await prisma.membership.upsert({
          where: { id: `mem_${stableUserId}` },
          update: {
            planId,
            status: 'active',
            startDate: new Date(),
            endDate: membershipType === 'pro' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
          create: {
            id: `mem_${stableUserId}`,
            userId: stableUserId,
            planId,
            status: 'active',
            startDate: new Date(),
            endDate: membershipType === 'pro' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
        });

        return NextResponse.json({ ok: true, type: 'membership', membershipType });
      } catch (dbError: any) {
        console.error('DB ERROR:', dbError);
        return NextResponse.json({ error: 'Database membership update failure', details: dbError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      ok: true,
      message: 'Payment verified but no specific action was required for this session type.'
    });

  } catch (error: any) {
    console.error('Error verifying session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
