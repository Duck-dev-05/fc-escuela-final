import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
}

export interface Ticket {
  id: number;
  matchId: number;
  userId: number;
  quantity: number;
  category: string;
  purchaseDate: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

// Match API calls (no caching)
export const matchApi = {
  getAll: async () => {
    const response = await api.get<Match[]>('/matches');
    return response;
  },
  getById: async (id: number) => {
    const response = await api.get<Match>(`/matches/${id}`);
    return response;
  },
  create: async (match: Omit<Match, 'id'>) => {
    const response = await api.post<Match>('/matches', match);
    return response;
  },
  update: async (id: number, match: Match) => {
    const response = await api.put(`/matches/${id}`, match);
    return response;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/matches/${id}`);
    return response;
  },
};

// Ticket API calls (no caching)
export const ticketApi = {
  getAll: async () => {
    const response = await api.get<Ticket[]>('/tickets');
    return response;
  },
  getById: async (id: number) => {
    const response = await api.get<Ticket>(`/tickets/${id}`);
    return response;
  },
  create: async (ticket: Omit<Ticket, 'id'>) => {
    const response = await api.post<Ticket>('/tickets', ticket);
    return response;
  },
  update: async (id: number, ticket: Ticket) => {
    const response = await api.put(`/tickets/${id}`, ticket);
    return response;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/tickets/${id}`);
    return response;
  },
};

// User API calls (no caching)
export const userApi = {
  login: async (email: string, password: string) => {
    const response = await api.post<{ token: string; user: User }>('/users/login', { email, password });
    return response;
  },
  register: async (userData: { username: string; email: string; password: string }) => {
    const response = await api.post<User>('/users/register', userData);
    return response;
  },
  getProfile: async () => {
    const response = await api.get<User>('/users/profile');
    return response;
  },
};

export default api; 