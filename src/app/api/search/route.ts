import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCache, setCache } from '@/lib/redis';
import { searchSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

const getSearchCacheKey = (query: string) => `search_${query}`;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParam = searchParams.get('query') || '';
    
    // Validate Input
    const validated = searchSchema.safeParse({ query: queryParam });
    if (!validated.success) {
      return NextResponse.json({ error: 'Invalid search query' }, { status: 400 });
    }
    
    const query = validated.data.query.toLowerCase();

    if (!query) {
      return NextResponse.json({ news: [], team: [], matches: [] });
    }

    // Try to get from cache
    const cacheKey = getSearchCacheKey(query);
    const cachedResults = await getCache(cacheKey);
    if (cachedResults) return NextResponse.json(cachedResults);

    // Search News
    const news = await prisma.news.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { content: { contains: query } },
          { author: { contains: query } },
          { category: { contains: query } },
        ],
      },
      select: { id: true, title: true, content: true, author: true, category: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 20, // Limit results
    });

    // Search Team Members
    const team = await prisma.teamMember.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { role: { contains: query } },
          { bio: { contains: query } },
        ],
      },
      select: { id: true, name: true, role: true, bio: true, image: true },
      orderBy: { order: 'asc' },
      take: 20,
    });

    // Search Matches
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { homeTeam: { contains: query } },
          { awayTeam: { contains: query } },
          { competition: { contains: query } },
          { description: { contains: query } },
          { status: { contains: query } },
        ],
      },
      select: { id: true, homeTeam: true, awayTeam: true, date: true, competition: true, description: true },
      orderBy: { date: 'desc' },
      take: 20,
    });

    const results = { news, team, matches };
    
    // Set cache (short TTL for search results)
    await setCache(cacheKey, results, 60);

    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}