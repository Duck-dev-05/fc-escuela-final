'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FaEye,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaRocket,
  FaArrowRight,
  FaFutbol,
} from 'react-icons/fa'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07 },
  }),
}

const pillars = [
  {
    title: 'Mission',
    icon: FaRocket,
    desc: 'Create an environment where technical excellence and leadership grow together, so every player can push beyond their limits with purpose.',
    accentBg: 'bg-red-500/10',
    accentText: 'text-red-400',
    borderTop: 'border-t-emerald-500/60',
  },
  {
    title: 'Vision',
    icon: FaEye,
    desc: 'Set a high standard for academy football—uniting diverse talent into squads that play with intelligence, discipline, and identity.',
    accentBg: 'bg-sky-500/10',
    accentText: 'text-sky-400',
    borderTop: 'border-t-sky-500/60',
  },
  {
    title: 'Values',
    icon: FaShieldAlt,
    accentBg: 'bg-amber-500/10',
    accentText: 'text-amber-400',
    borderTop: 'border-t-amber-500/60',
    items: [
      'Resilience',
      'Tactical intelligence',
      'Integrity',
      'Continuous improvement',
      'Community',
    ],
  },
] as const

const milestones = [
  {
    year: '2023',
    label: 'Foundation',
    detail: 'FC Escuela launches with a focus on elite technical development and structured pathways.',
  },
  {
    year: '2024',
    label: 'Growth',
    detail: 'Expanded local talent pools and upgraded training infrastructure toward professional standards.',
  },
  {
    year: '2025',
    label: 'Performance tier',
    detail: 'High-performance routes and stronger community networks raise visibility for players and families.',
  },
  {
    year: 'Today',
    label: 'Looking ahead',
    detail: 'Digital tools, memberships, and match experiences bring the academy closer to supporters everywhere.',
  },
] as const

const contacts = [
  {
    label: 'Email',
    value: 'khunhatruongcoma7@gmail.com',
    icon: FaEnvelope,
    href: 'mailto:khunhatruongcoma7@gmail.com',
    accentBg: 'bg-red-500/10',
    accentText: 'text-red-400',
    borderTop: 'border-t-emerald-500/60',
  },
  {
    label: 'Phone',
    value: '+84 086-581-7605',
    icon: FaPhone,
    href: 'tel:+840865817605',
    accentBg: 'bg-sky-500/10',
    accentText: 'text-sky-400',
    borderTop: 'border-t-sky-500/60',
  },
  {
    label: 'Location',
    value: 'UBND XÃ£ LiÃªn Ninh, Hanoi, Vietnam',
    icon: FaMapMarkerAlt,
    href: 'https://maps.google.com/?q=UBND+XÃ£+LiÃªn+Ninh,+Hanoi',
    accentBg: 'bg-amber-500/10',
    accentText: 'text-amber-400',
    borderTop: 'border-t-amber-500/60',
  },
] as const

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-slate-200">

      {/* —— HERO ———————————————————————————————————————————————————————————— */}
      <section className="relative isolate overflow-hidden border-b border-white/5 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/images/Team_final.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-18"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        {/* Club stripe */}
        <div className="club-top-stripe" />
        {/* Glows */}
        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-red-500/10 blur-[100px] -z-10" />
        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-amber-500/6 blur-[80px] -z-10" />

        <div className="container-custom">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                <Image
                  src="/images/logo.jpg"
                  alt="FC Escuela crest"
                  fill
                  className="object-cover"
                  sizes="112px"
                  priority
                />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/8 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-red-400"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              About the academy
              <FaFutbol className="text-[9px] text-emerald-600" />
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-4xl font-black uppercase tracking-tight text-white sm:text-5xl md:text-6xl"
            >
              FC{' '}
              <span className="text-gradient-red">Escuela</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base"
            >
              We are more than a club: a structured academy where coaching, analysis, and match experience come
              together to develop confident, intelligent players.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-red-500 sm:w-auto"
                style={{ boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}
              >
                Join trials <FaArrowRight className="text-[10px]" />
              </Link>
              <Link
                href="/team"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-slate-200 backdrop-blur transition hover:bg-white/10 sm:w-auto"
              >
                Meet the squad
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* —— PILLARS ————————————————————————————————————————————————————————— */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="mb-12 max-w-2xl">
            <p className="label-eyebrow mb-2">What drives us</p>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
              Mission, Vision & Values
            </h2>
            <p className="mt-3 text-sm text-slate-500 md:text-base">
              Clear principles keep training, matches, and player care aligned across every age group.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {pillars.map((item, i) => (
              <motion.article
                key={item.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                className={`flex h-full flex-col glass-card-hover p-6 md:p-8 border-t-2 ${item.borderTop}`}
              >
                <div className={`w-fit rounded-xl p-3 ${item.accentBg} ${item.accentText}`}>
                  <item.icon className="text-lg" />
                </div>
                <h3 className="mt-5 text-xl font-black uppercase tracking-tight text-white">{item.title}</h3>
                {'desc' in item && item.desc ? (
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">{item.desc}</p>
                ) : (
                  <ul className="mt-4 flex flex-1 flex-col gap-2.5">
                    {item.items.map((val) => (
                      <li key={val} className="flex items-center gap-2 text-sm text-slate-400">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        {val}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* —— TIMELINE ———————————————————————————————————————————————————————— */}
      <section className="border-y border-white/5 bg-white/[0.015] py-16 md:py-24">
        <div className="container-custom">
          <div className="mb-12 text-center md:mb-16">
            <p className="label-eyebrow justify-center mb-2">Our Story</p>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
              Club Timeline
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
              Milestones from launch to today—built with players, coaches, and the community around the pitch.
            </p>
          </div>

          <div className="relative mx-auto max-w-2xl">
            {/* Vertical line */}
            <div
              className="absolute left-[15px] top-3 bottom-3 w-px"
              style={{ background: 'linear-gradient(to bottom, rgba(16,185,129,0.8), rgba(16,185,129,0.1))' }}
              aria-hidden
            />
            <ul className="space-y-8">
              {milestones.map((m, i) => (
                <motion.li
                  key={m.year}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-20px' }}
                  variants={fadeUp}
                  className="relative pl-12"
                >
                  <div
                    className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0a0f1e] bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.5)]"
                    aria-hidden
                  >
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </div>
                  <div className="glass-card-hover p-5 md:p-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-400">{m.year}</span>
                    <h3 className="mt-1 text-lg font-black uppercase tracking-tight text-white">{m.label}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-500">{m.detail}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* —— CONTACT ————————————————————————————————————————————————————————— */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label-eyebrow mb-2">Get in touch</p>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">Contact</h2>
            </div>
            <p className="max-w-md text-sm text-slate-500">
              Reach us for trials, partnerships, or general questions—we reply as soon as we can.
            </p>
          </div>

          {/* Green divider */}
          <div className="divider-red mb-10" />

          <div className="grid gap-4 md:grid-cols-3">
            {contacts.map((c, i) => (
              <motion.a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className={`group flex gap-4 glass-card-hover p-6 border-t-2 ${c.borderTop}`}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${c.accentBg} ${c.accentText} transition-all`}>
                  <c.icon className="text-lg" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">{c.label}</p>
                  <p className={`mt-1 break-words text-sm font-semibold text-slate-300 transition group-hover:${c.accentText}`}>
                    {c.value}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* —— CTA ————————————————————————————————————————————————————————————— */}
      <section className="pb-20 md:pb-28">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a1a12] via-[#0a0f1e] to-[#0a0f1e] px-6 py-14 text-center shadow-2xl md:px-12 md:py-16"
          >
            {/* Green glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-40 bg-red-500/10 blur-3xl rounded-full" />
            {/* Football icon */}
            <div className="absolute right-8 bottom-8 text-red-500/5">
              <FaFutbol className="text-[120px]" />
            </div>
            <div className="relative z-10">
              <p className="label-eyebrow justify-center mb-4">Join the Academy</p>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white md:text-4xl">
                Ready to train with us?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm text-slate-400">
                Start with registration or explore tickets and news from the academy hub.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-red-500 sm:w-auto"
                  style={{ boxShadow: '0 0 24px rgba(16,185,129,0.3)' }}
                >
                  Register <FaArrowRight className="text-[10px]" />
                </Link>
                <Link
                  href="/matches"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-slate-200 backdrop-blur transition hover:bg-white/10 sm:w-auto"
                >
                  View Matches
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

