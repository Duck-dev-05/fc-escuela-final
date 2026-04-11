import { prisma } from './prisma';

export interface AdminPlayer {
  id: number;
  name: string;
  position: string;
  number: number;
  form: string;
  goals: number;
  matches: number;
  image: string | null;
  bio: string | null;
  captain: boolean;
  status: string;
  order: number;
}

export interface AdminArticle {
  id: string; // Changed to string to match Prisma CUID
  title: string;
  author: string;
  date: string;
  status: string;
  views: string;
  content: string;
  imageUrl: string | null;
  category: string;
  createdAt: Date;
}

export interface AdminMatch {
  id: string; // Changed to string to match Prisma CUID
  match: string;
  competition: string;
  date: string;
  stadium: string;
  capacity: number | null;
  allocation: number | null;
  sold: number;
  price: string;
  status: string;
  score: string | null;
}

export interface AdminGalleryImage {
  id: string;
  url: string;
  category: string;
  title: string | null;
  createdAt: Date;
}

export const adminService = {
  getPlayers: async (): Promise<AdminPlayer[]> => {
    const players = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' }
    });
    
    return players.map(p => ({
      id: p.id,
      name: p.name,
      position: p.role,
      number: p.id, // Fallback to ID
      form: 'A',
      goals: 0,
      matches: 0,
      image: p.image || null,
      bio: p.bio,
      captain: p.captain,
      status: 'available',
      order: p.order
    }));
  },

  getArticles: async (): Promise<AdminArticle[]> => {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return news.map(n => ({
      id: n.id,
      title: n.title,
      author: n.author,
      date: n.createdAt.toLocaleDateString(),
      status: 'published',
      views: '0',
      content: n.content,
      imageUrl: n.imageUrl,
      category: n.category,
      createdAt: n.createdAt
    }));
  },

  getMatches: async (): Promise<AdminMatch[]> => {
    const matches = await prisma.match.findMany({
      orderBy: { date: 'asc' }
    });
    
    return matches.map(m => ({
      id: m.id,
      match: `${m.homeTeam} vs ${m.awayTeam}`,
      competition: m.competition,
      date: m.date.toISOString(),
      stadium: m.venue,
      capacity: m.stadiumCapacity,
      allocation: m.stadiumCapacity,
      sold: 0,
      price: 'Free',
      status: m.status || 'scheduled',
      score: m.score
    }));
  },

  getGallery: async (): Promise<AdminGalleryImage[]> => {
    const images = await prisma.galleryImage.findMany({
      orderBy: { uploadedAt: 'desc' }
    });
    
    return images.map(img => ({
      id: img.id,
      url: img.path,
      category: img.category,
      title: img.filename,
      createdAt: img.uploadedAt
    }));
  },
};
