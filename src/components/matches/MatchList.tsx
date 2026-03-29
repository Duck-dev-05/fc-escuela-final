'use client'

import { Match } from '@/types/match'
import MatchCard from './MatchCard'

interface MatchListProps {
  matches: Match[]
}

export default function MatchList({ matches }: MatchListProps) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-20 bg-white/50 rounded-2xl border border-slate-100 shadow-sm animate-slide-up">
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No matches scheduled at the moment.</p>
      </div>
    )
  }

  // Remove duplicates based on homeTeam, awayTeam, date, time, competition, and score
  const uniqueMatches = matches.filter((match, idx, arr) =>
    arr.findIndex(m =>
      m.homeTeam === match.homeTeam &&
      m.awayTeam === match.awayTeam &&
      m.date === match.date &&
      m.time === match.time &&
      m.competition === match.competition &&
      m.score === match.score
    ) === idx
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {uniqueMatches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  )
} 