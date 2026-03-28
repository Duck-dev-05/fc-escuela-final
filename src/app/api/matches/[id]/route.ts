export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCache, setCache, invalidateCache, CACHE_TTL } from '@/lib/redis'

const MATCHES_CACHE_KEY = 'all_matches';
const getMatchCacheKey = (id: string) => `match_${id}`;

// GET /api/matches/[id] - Get a specific match
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cacheKey = getMatchCacheKey(id);
    const cachedMatch = await getCache(cacheKey);
    if (cachedMatch) return NextResponse.json(cachedMatch);

    const match = await prisma.match.findUnique({
      where: {
        id: id,
      },
    })

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // Process match status
    const matchDate = new Date(match.date);
    const now = new Date();
    
    if (match.score) {
      match.status = 'Finished';
    } else if (matchDate < now) {
      match.status = 'Finished';
    } else {
      match.status = 'Scheduled';
    }

    // Set cache
    const processedMatch = {
      ...match,
      homeLineup: match.homeLineup ? JSON.parse(match.homeLineup) : [],
      awayLineup: match.awayLineup ? JSON.parse(match.awayLineup) : []
    };
    await setCache(cacheKey, processedMatch, CACHE_TTL.MATCHES);

    return NextResponse.json(processedMatch)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch match' },
      { status: 500 }
    )
  }
}

// PUT /api/matches/[id] - Update a match
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json()
    
    // Determine status based on score and date
    let status = body.status;
    if (body.score) {
      status = 'Finished';
    } else if (new Date(body.date) < new Date()) {
      status = 'Finished';
    } else {
      status = 'Scheduled';
    }

    const match = await prisma.match.update({
      where: {
        id: id,
      },
      data: {
        homeTeam: body.homeTeam,
        awayTeam: body.awayTeam,
        date: body.date ? new Date(body.date) : undefined,
        time: body.time,
        venue: body.venue,
        competition: body.competition,
        score: body.score,
        status: status,
      },
    })

    // Invalidate the matches cache
    await invalidateCache(MATCHES_CACHE_KEY);
    await invalidateCache(getMatchCacheKey(id));

    const processedMatch = {
      ...match,
      homeLineup: match.homeLineup ? JSON.parse(match.homeLineup) : [],
      awayLineup: match.awayLineup ? JSON.parse(match.awayLineup) : []
    };

    return NextResponse.json(processedMatch)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update match' },
      { status: 500 }
    )
  }
}

// DELETE /api/matches/[id] - Delete a match
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.match.delete({
      where: {
        id: id,
      },
    })

    // Invalidate the matches cache

    return NextResponse.json({ message: 'Match deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete match' },
      { status: 500 }
    )
  }
}

// PATCH /api/matches/[id] - Partial update (lineups/power)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json()
    
    const match = await prisma.match.update({
      where: { id: id },
      data: {
        homeLineup: body.homeLineup,
        awayLineup: body.awayLineup,
        homePower: body.homePower,
        awayPower: body.awayPower,
        score: body.score,
        status: body.status,
      },
    })

    // Invalidate the matches cache
    await invalidateCache(MATCHES_CACHE_KEY);
    await invalidateCache(getMatchCacheKey(id));

    return NextResponse.json(match)
  } catch (error) {
    console.error('MATCH_PATCH_FAILED:', error);
    return NextResponse.json(
      { error: 'Failed to patch match' },
      { status: 500 }
    )
  }
}