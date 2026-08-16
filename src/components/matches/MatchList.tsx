'use client'

import { Match } from '@/types/match'
import MatchCard from './MatchCard'
import { motion, Variants } from 'framer-motion'

interface MatchListProps {
  matches: Match[]
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
}

export default function MatchList({ matches }: MatchListProps) {
  if (matches.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 py-16 text-center">
        <p className="text-sm font-medium text-slate-500">No matches in this list.</p>
      </div>
    )
  }

  const uniqueMatches = matches.filter(
    (match, idx, arr) =>
      arr.findIndex(
        (m) =>
          m.homeTeam === match.homeTeam &&
          m.awayTeam === match.awayTeam &&
          m.date === match.date &&
          m.time === match.time &&
          m.competition === match.competition &&
          m.score === match.score
      ) === idx
  )

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      {uniqueMatches.map((match) => (
        <motion.div key={match.id} variants={item}>
          <MatchCard match={match} />
        </motion.div>
      ))}
    </motion.div>
  )
}
