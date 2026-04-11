/**
 * Admin API Client for fetching data from the football-club-admin service (Port 3001).
 * This client maps the remote admin data to the local website's domain models.
 */

import { Match } from '@/types/match';

const ADMIN_API_URL = process.env.INTERNAL_ADMIN_API_URL || process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001/api/external';

export interface RemoteAdminData {
  matches: any[];
  news: any[];
  players: any[];
}

export const adminClient = {
  /**
   * Fetches all core data from the admin service in a single request.
   */
  async fetchAllData(): Promise<RemoteAdminData | null> {
    try {
      const response = await fetch(ADMIN_API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Admin API Error: ${response.status}`);
      }

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.warn('[ADMIN_CLIENT_FETCH_FAILED]:', error);
      return null;
    }
  },

  /**
   * Maps remote match data from the admin to the Match type used in the website.
   * Handles field differences like 'opponent/venue' vs 'homeTeam/awayTeam'.
   */
  mapRemoteMatches(remoteMatches: any[]): Match[] {
    return remoteMatches.map((m) => {
      const isHome = m.venue === 'Home';
      return {
        id: m.id.toString(),
        homeTeam: isHome ? 'FC Escuela' : m.opponent,
        awayTeam: isHome ? m.opponent : 'FC Escuela',
        date: new Date(m.date),
        time: m.time,
        venue: m.venue || 'Stadium HQ',
        competition: m.type || 'Standard Match',
        status: m.status || (new Date(m.date) < new Date() ? 'Finished' : 'Upcoming'),
        score: m.score || null,
        createdAt: new Date(m.createdAt),
        updatedAt: new Date(m.updatedAt),
      };
    });
  },

  /**
   * Maps remote news data to the website's article structure.
   */
  mapRemoteNews(remoteNews: any[]): any[] {
    return remoteNews.map((n) => ({
      id: n.id.toString(),
      title: n.title,
      author: n.author,
      content: n.content || '',
      date: n.date,
      category: 'Admin News',
      imageUrl: '/images/news-placeholder.jpg',
      createdAt: n.createdAt,
      status: n.status,
    }));
  },

  /**
   * Maps remote player data to the website's team structure.
   */
  mapRemotePlayers(remotePlayers: any[]): any[] {
    return remotePlayers.map((p) => ({
      id: p.id,
      name: p.name,
      role: p.position,
      number: p.number,
      image: '/images/player-placeholder.jpg',
      bio: p.stats || '',
      captain: false,
      status: p.status || 'Active',
      order: 0,
    }));
  },
};
