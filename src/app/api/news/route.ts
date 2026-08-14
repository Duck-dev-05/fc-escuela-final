export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCache, setCache, invalidateCache, CACHE_TTL } from '@/lib/redis';

const NEWS_CACHE_KEY = 'all_news_articles';

export async function GET() {
  try {
    // Try to get from cache
    const cachedArticles = await getCache(NEWS_CACHE_KEY);
    if (cachedArticles) return NextResponse.json(cachedArticles);

    // Fetch from database
    const articles = await prisma.news.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Set cache
    await setCache(NEWS_CACHE_KEY, articles, CACHE_TTL.NEWS);

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news articles' },
      { status: 500 }
    );
  }
}

// Add POST handler for creating news
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const article = await prisma.news.create({
      data: {
        title: body.title,
        content: body.content,
        imageUrl: body.imageUrl,
        author: body.author,
        category: body.category,
      },
    });

    // Invalidate the cache
    await invalidateCache(NEWS_CACHE_KEY);

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Failed to create news:', error);
    return NextResponse.json(
      { error: 'Failed to create news article' },
      { status: 500 }
    );
  }
} 