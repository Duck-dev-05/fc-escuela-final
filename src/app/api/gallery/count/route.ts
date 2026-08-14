import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCache, setCache, CACHE_TTL } from "@/lib/redis";

const getGalleryCountCacheKey = (userId: string) => `gallery_count_${userId}`;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const cacheKey = getGalleryCountCacheKey(userId);
    const cachedCount = await getCache<{ count: number }>(cacheKey);
    if (cachedCount) return NextResponse.json(cachedCount);

    const count = await prisma.galleryImage.count({
      where: {
        userId: userId,
      },
    });

    // Set cache
    await setCache(cacheKey, { count }, CACHE_TTL.GALLERY);

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error getting upload count:", error);
    return NextResponse.json({ error: "Failed to get upload count" }, { status: 500 });
  }
} 