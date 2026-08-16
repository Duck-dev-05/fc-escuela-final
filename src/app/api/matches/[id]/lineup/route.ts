import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { invalidateCache } from '@/lib/redis'

const MATCHES_CACHE_KEY = 'all_matches';
const getMatchCacheKey = (id: string) => `match_${id}`;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'http://localhost:3001',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const match = await prisma.match.findUnique({
      where: { id: id },
      select: { 
        homeLineup: true, 
        awayLineup: true, 
        homeBench: true,
        awayBench: true,
        homeTeam: true, 
        awayTeam: true 
      }
    })

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404, headers: CORS_HEADERS })
    }

    return NextResponse.json({
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeLineup: match.homeLineup ? JSON.parse(match.homeLineup) : [],
      awayLineup: match.awayLineup ? JSON.parse(match.awayLineup) : [],
      homeBench: match.homeBench ? JSON.parse(match.homeBench) : [],
      awayBench: match.awayBench ? JSON.parse(match.awayBench) : []
    }, { headers: CORS_HEADERS })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: CORS_HEADERS })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { homeLineup, awayLineup, homeBench, awayBench } = await req.json()

    const updatedMatch = await prisma.match.update({
      where: { id: id },
      data: {
        homeLineup: homeLineup ? JSON.stringify(homeLineup) : undefined,
        awayLineup: awayLineup ? JSON.stringify(awayLineup) : undefined,
        homeBench: homeBench ? JSON.stringify(homeBench) : undefined,
        awayBench: awayBench ? JSON.stringify(awayBench) : undefined,
      }
    })

    // Invalidate caches
    await invalidateCache(MATCHES_CACHE_KEY);
    await invalidateCache(getMatchCacheKey(id));

    return NextResponse.json({
      success: true,
      homeLineup: updatedMatch.homeLineup ? JSON.parse(updatedMatch.homeLineup) : [],
      awayLineup: updatedMatch.awayLineup ? JSON.parse(updatedMatch.awayLineup) : [],
      homeBench: updatedMatch.homeBench ? JSON.parse(updatedMatch.homeBench) : [],
      awayBench: updatedMatch.awayBench ? JSON.parse(updatedMatch.awayBench) : []
    }, { headers: CORS_HEADERS })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: CORS_HEADERS })
  }
}
