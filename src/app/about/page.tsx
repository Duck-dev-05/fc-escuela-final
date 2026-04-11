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
} from 'react-icons/fa'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.06 },
  }),
}

const pillars = [
  {
    title: 'Mission',
    icon: FaRocket,
    desc: 'Create an environment where technical excellence and leadership grow together, so every player can push beyond their limits with purpose.',
    accent: 'bg-amber-500/10 text-amber-800',
  },
  {
    title: 'Vision',
    icon: FaEye,
    desc: 'Set a high standard for academy football—uniting diverse talent into squads that play with intelligence, discipline, and identity.',
    accent: 'bg-sky-500/10 text-sky-800',
  },
  {
    title: 'Values',
    icon: FaShieldAlt,
    accent: 'bg-emerald-500/10 text-emerald-800',
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
  },
  {
    label: 'Phone',
    value: '+84 086-581-7605',
    icon: FaPhone,
    href: 'tel:+840865817605',
  },
  {
    label: 'Location',
    value: 'UBND Xã Liên Ninh, Hanoi, Vietnam',
    icon: FaMapMarkerAlt,
    href: 'https://maps.google.com/?q=UBND+Xã+Liên+Ninh,+Hanoi',
  },
] as const

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-slate-200/80 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/images/Team_final.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-slate-50/95 to-slate-50" />
        </div>
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl -z-10" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl -z-10" />

        <div className="container-custom">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
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
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-800"
            >
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              About the academy
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-black uppercase tracking-tight text-slate-900 sm:text-5xl md:text-6xl"
            >
              FC{' '}
              <span className="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 bg-clip-text text-transparent">
                Escuela
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base"
            >
              We are more than a club: a structured academy where coaching, analysis, and match experience come
              together to develop confident, intelligent players.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-amber-500 sm:w-auto"
              >
                Join trials <FaArrowRight className="text-[10px]" />
              </Link>
              <Link
                href="/team"
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-800 transition hover:border-slate-400 hover:bg-slate-100 sm:w-auto"
              >
                Meet the squad
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="mb-12 max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">What drives us</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-slate-900 md:text-4xl">
              Mission, vision & values
            </h2>
            <p className="mt-3 text-sm text-slate-600 md:text-base">
              Clear principles keep training, matches, and player care aligned across every age group.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((item, i) => (
              <motion.article
                key={item.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:p-8"
              >
                <div className={`w-fit rounded-xl p-3 ${item.accent}`}>
                  <item.icon className="text-lg" />
                </div>
                <h3 className="mt-5 text-xl font-black uppercase tracking-tight text-slate-900">{item.title}</h3>
                {'desc' in item && item.desc ? (
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                ) : (
                  <ul className="mt-4 flex flex-1 flex-col gap-2.5">
                    {item.items.map((val) => (
                      <li key={val} className="flex items-center gap-2 text-sm text-slate-700">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
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

      {/* Timeline */}
      <section className="border-y border-slate-200 bg-slate-100/80 py-16 md:py-24">
        <div className="container-custom">
          <div className="mb-12 text-center md:mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Our story</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-slate-900 md:text-4xl">
              Club timeline
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">
              Milestones from launch to today—built with players, coaches, and the community around the pitch.
            </p>
          </div>

          <div className="relative mx-auto max-w-2xl">
            <div className="absolute left-[15px] top-3 bottom-3 w-px bg-slate-300" aria-hidden />
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
                    className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-amber-500 shadow-sm"
                    aria-hidden
                  >
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700">{m.year}</span>
                    <h3 className="mt-1 text-lg font-black uppercase tracking-tight text-slate-900">{m.label}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{m.detail}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Get in touch</p>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-slate-900 md:text-4xl">Contact</h2>
            </div>
            <p className="max-w-md text-sm text-slate-600">
              Reach us for trials, partnerships, or general questions—we reply as soon as we can.
            </p>
          </div>

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
                className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-amber-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-amber-500/15 group-hover:text-amber-800">
                  <c.icon className="text-lg" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">{c.label}</p>
                  <p className="mt-1 break-words text-sm font-semibold text-slate-900 transition group-hover:text-amber-800">
                    {c.value}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 md:pb-28">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 px-6 py-12 text-center shadow-xl md:px-12 md:py-14"
          >
            <h2 className="text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
              Ready to train with us?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-slate-300">
              Start with registration or explore tickets and news from the academy hub.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-amber-400 sm:w-auto"
              >
                Register <FaArrowRight className="text-[10px]" />
              </Link>
              <Link
                href="/ticketing"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur transition hover:bg-white/10 sm:w-auto"
              >
                View ticketing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
