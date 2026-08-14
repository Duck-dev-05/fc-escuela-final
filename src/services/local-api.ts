/**
 * Local API service using native fetch to eliminate axios dependency.
 * Points to the application's own /api routes.
 */

export interface AdminPlayer {
  id: number;
  name: string;
  role: string;
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
  id: string;
  title: string;
  author: string;
  date: string;
  status: string;
  views: string;
  content: string;
  imageUrl: string;
  category: string;
  createdAt: string;
}

export interface AdminMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  score: string | null;
  status: string | null;
  stadiumCapacity: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminGalleryImage {
  id: string;
  url: string;
  category: string;
  title: string | null;
  createdAt: Date;
}

export const localApi = {
  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Ensure fresh data for these dynamic modules
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json();
  },

  post: async <T>(url: string, data: any): Promise<T> => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json();
  },
};

export const adminService = {
  getPlayers: () => localApi.get<AdminPlayer[]>('/api/team'),
  getArticles: () => localApi.get<AdminArticle[]>('/api/news'),
  getMatches: () => localApi.get<AdminMatch[]>('/api/matches'),
  getGallery: () => localApi.get<AdminGalleryImage[]>('/api/gallery'),
};
