import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCache, setCache, CACHE_TTL } from '@/lib/redis';

const GALLERY_CACHE_KEY = 'gallery_assets_v1';

export async function GET() {
  try {
    const cachedGallery = await getCache(GALLERY_CACHE_KEY);
    if (cachedGallery) return NextResponse.json(cachedGallery);

    const gallery = await prisma.galleryImage.findMany({
      orderBy: {
        uploadedAt: 'desc'
      }
    });

    // Map Prisma GalleryImage to API GalleryImage
    const mappedGallery = gallery.map(img => ({
      id: img.id,
      url: img.path,
      category: img.category,
      title: img.filename,
      createdAt: img.uploadedAt
    }));

    // If database is empty, return initial mock set to prevent 404/Empty UI
    const defaultGallery = [
      { id: '1', url: '/images/Team.jpg', category: 'general', title: 'Team Photo', createdAt: new Date() },
      { id: '2', url: '/images/After Match/481302045_623994717046718_6367270203417339327_n.jpg', category: 'after-match', title: 'Post-Match Sync', createdAt: new Date() },
    ];

    const response = mappedGallery.length > 0 ? mappedGallery : defaultGallery;
    
    await setCache(GALLERY_CACHE_KEY, response, CACHE_TTL.GALLERY || 3600);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Gallery sync failure:', error);
    return NextResponse.json({ error: 'Failed to retrieve media vault' }, { status: 500 });
  }
}
