import axios from "axios";

const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3001/api/external";

const adminApi = axios.create({
  baseURL: ADMIN_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
  id: number;
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
  id: number;
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
  id: number;
  url: string;
  category: string;
  title: string | null;
  createdAt: string;
}

export const adminService = {
  getPlayers: async (): Promise<AdminPlayer[]> => {
    const response = await adminApi.get("/players");
    return response.data;
  },

  getArticles: async (): Promise<AdminArticle[]> => {
    const response = await adminApi.get("/articles");
    return response.data;
  },

  getMatches: async (): Promise<AdminMatch[]> => {
    const response = await adminApi.get("/matches");
    return response.data;
  },

  getGallery: async (): Promise<AdminGalleryImage[]> => {
    const response = await adminApi.get("/gallery");
    return response.data;
  },
};

export default adminService;
