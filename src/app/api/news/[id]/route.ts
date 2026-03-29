import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { getCache, setCache, CACHE_TTL } from '@/lib/redis';

const getNewsCacheKey = (id: string) => `news_${id}`;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cacheKey = getNewsCacheKey(id);
    const cachedArticle = await getCache(cacheKey);
    if (cachedArticle) return NextResponse.json(cachedArticle);

    const article = await prisma.news.findUnique({
      where: { id: id },
    });
    if (!article) {
      return NextResponse.json({ error: 'News article not found' }, { status: 404 });
    }

    // Set cache
    await setCache(cacheKey, article, CACHE_TTL.NEWS);

    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news article' }, { status: 500 });
  }
} 