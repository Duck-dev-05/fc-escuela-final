'use client'

import { Match } from '@/types/match'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaUsers, 
  FaBroadcastTower, 
  FaShieldAlt, 
  FaInfoCircle,
  FaCheckCircle
} from 'react-icons/fa'
import { cn } from '@/lib/utils'

interface SquadFormationProps {
  match: Match
}

const MOCK_OPPONENT_PLAYERS = [
  { name: 'M. Sterling', position: 'GK' },
  { name: 'A. Becker', position: 'LD' },
  { name: 'J. Stones', position: 'RD' },
  { name: 'Rodri', position: 'CM' },
  { name: 'J. Grealish', position: 'LM' },
  { name: 'B. Silva', position: 'RM' },
  { name: 'E. Haaland', position: 'ST' },
];

const MOCK_OPPONENT_BENCH = [
  { name: 'S. Ortega', position: 'GK' },
  { name: 'N. Ake', position: 'DF' },
  { name: 'K. Phillips', position: 'MF' },
  { name: 'J. Alvarez', position: 'FW' },
];

const POSITION_LABELS: Record<string, string> = {
  'GK': 'Goalkeeper',
  'CB': 'Center Back',
  'RD': 'Right Defender',
  'LD': 'Left Defender',
  'RB': 'Right Back',
  'LB': 'Left Back',
  'CDM': 'Defensive Mid',
  'CM': 'Central Mid',
  'AMF': 'Attacking Mid',
  'LM': 'Left Midfield',
  'RM': 'Right Midfield',
  'LW': 'Left Winger',
  'RW': 'Right Winger',
  'CF': 'Center Forward',
  'ST': 'Striker',
};

export default function SquadFormation({ match }: SquadFormationProps) {
  const isFceHome = match.homeTeam?.toLowerCase().includes('escuela');
  
  const opponentName = isFceHome ? match.awayTeam : match.homeTeam;
  const fceLineup = (isFceHome ? match.homeLineup : match.awayLineup) || [];
  const fceBench = (isFceHome ? match.homeBench : match.awayBench) || [];
  
  const oppLineup = (isFceHome ? match.awayLineup : match.homeLineup) || [];
  const oppBench = (isFceHome ? match.awayBench : match.homeBench) || [];

  const hasFceLineup = Array.isArray(fceLineup) && fceLineup.length > 0;

  return (
    <div className="space-y-10 py-4 md:space-y-12">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-900 shadow-sm">
            <FaUsers className="text-lg text-amber-400" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Squads</p>
            <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">Lineups</h3>
            <p className="mt-1 text-sm text-slate-600">Starting players and substitutes when published.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* --- FC ESCUELA COLUMN --- */}
        <div className="space-y-8">
          <TeamHeader name="FC Escuela" isOfficial={hasFceLineup} />
          
          <AnimatePresence mode="wait">
            {!hasFceLineup ? (
              <EmbargoPlaceholder key="fce-embargo" />
            ) : (
              <TeamListView 
                key="fce-tactical"
                lineup={fceLineup || []}
                bench={fceBench || []}
                isFce={true}
              />
            )}
          </AnimatePresence>
        </div>

        {/* --- OPPONENT COLUMN --- */}
        <div className="space-y-8 lg:mt-0 xl:mt-0">
          <TeamHeader 
            name={opponentName || 'Opponent'} 
            isOfficial={!!oppLineup && oppLineup.length > 0} 
            isMock={!oppLineup || oppLineup.length === 0}
          />
          
          <TeamListView 
            lineup={oppLineup && oppLineup.length > 0 ? oppLineup : MOCK_OPPONENT_PLAYERS}
            bench={oppBench && oppBench.length > 0 ? oppBench : MOCK_OPPONENT_BENCH}
            isFce={false}
            teamName={opponentName}
          />
        </div>
      </div>
    </div>
  )
}

function TeamHeader({ name, isOfficial, isMock }: { name: string; isOfficial: boolean; isMock?: boolean }) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-3">
        <div className={cn(
          "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
          isMock ? "bg-slate-100 text-slate-400 border border-slate-200" : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
        )}>
          {name}
        </div>
        {isMock && (
          <span className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">
            <FaInfoCircle className="text-[9px]" /> Illustrative
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isOfficial ? "bg-emerald-500" : "bg-yellow-500")} />
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          {isOfficial ? 'Validated' : 'Pending'}
        </span>
      </div>
    </div>
  )
}

function TeamListView({ lineup, bench, isFce, teamName }: any) {
  // Defensive parsing in case API serves raw strings
  const parsePersonnel = (data: any) => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try { return JSON.parse(data); } catch { return []; }
    }
    return [];
  };

  const safeLineup = parsePersonnel(lineup);
  const safeBench = parsePersonnel(bench);
  return (
    <div className="space-y-12">
      {/* Starting XI Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-2 px-2">
           <div className="w-1.5 h-6 bg-yellow-500 rounded-full" />
           <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Starting lineup</h4>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {safeLineup.map((player: any, idx: number) => (
            <motion.div 
              initial={{ opacity: 0, x: isFce ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={idx} 
              className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-yellow-500/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all",
                  isFce ? "bg-slate-900 border-slate-800 text-yellow-500" : "bg-white border-slate-100 text-slate-400 group-hover:border-yellow-500 group-hover:text-slate-950"
                )}>
                  <span className="text-[10px] font-black">{player.position}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-950 uppercase tracking-tight">{player.name}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">
                    {POSITION_LABELS[player.position] || 'Active Personnel'}
                  </span>
                </div>
              </div>
              <FaCheckCircle className={cn(
                "text-xs transition-colors",
                isFce ? "text-emerald-500" : "text-slate-100 group-hover:text-emerald-500"
              )} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bench Personnel Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-2 px-2">
           <div className="w-1.5 h-6 bg-slate-300 rounded-full" />
           <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Substitutes</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {safeBench.map((player: any, idx: number) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-yellow-500/20 transition-all">
              <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center border border-slate-100">
                <span className="text-[8px] font-black text-slate-400">{idx + 1}</span>
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[9px] font-black text-slate-950 uppercase tracking-tighter truncate">{player.name}</span>
                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">{player.position}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Intelligence Brief */}
      <div className={cn(
        "p-6 rounded-[2rem] relative overflow-hidden transition-all duration-500",
        isFce ? "bg-slate-950 text-white" : "bg-white border border-slate-200 text-slate-900"
      )}>
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <FaInfoCircle className="text-3xl" />
        </div>
        <div className="relative z-10 flex flex-col gap-2">
           <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">
              {isFce ? 'Official lineup' : 'Opponent note'}
           </span>
           <p className={cn(
             'text-xs leading-relaxed',
             isFce ? 'text-slate-300' : 'text-slate-600'
           )}>
              {isFce
                ? 'Published by coaching staff. Changes may apply up to kickoff.'
                : `Placeholder lineup for ${teamName || 'opponent'} when real data is not available.`}
           </p>
        </div>
      </div>
    </div>
  )
}

function EmbargoPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex flex-col items-center gap-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 px-8 py-12 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <FaBroadcastTower className="text-xl text-amber-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 md:text-2xl">Lineup not published</h2>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-slate-600">
          Starting eleven and bench usually appear closer to kickoff. Check back later or contact the club if you need
          confirmation.
        </p>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold text-slate-500">
        <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
        Pending release
      </div>
    </motion.div>
  )
}
