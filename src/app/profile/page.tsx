"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaLock, FaUserCircle, FaStar, FaPhone, FaEnvelope,
  FaUser, FaIdCard, FaMapMarkerAlt, FaCalendarAlt,
  FaUsers, FaEdit, FaShieldAlt,
  FaExclamationTriangle, FaTrophy, FaMedal, FaQuoteLeft
} from 'react-icons/fa';
import { useState, useEffect } from "react";
import { format } from 'date-fns';
import { Tab } from '@headlessui/react';
import ProfileImage from "@/components/ProfileImage";

interface Profile {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  phone?: string;
  dob?: string;
  address?: string;
  gender?: string;
  nationality?: string;
  language?: string;
  bio?: string;
  website?: string;
  occupation?: string;
  favoriteTeam?: string;
  username?: string;
  emailVerified?: boolean;
  memberSince?: string;
  role?: string;
  accounts?: any[];
  isMember?: boolean;
  membershipType?: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tabs = ['Account', 'Membership', 'Settings'];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data.user);
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    }
    if (session) fetchProfile();
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-white/10 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#020617]">
        <div className="max-w-md w-full glass-card p-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-slate-600">
            <FaLock className="text-2xl" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mb-2">Access Restricted</h2>
          <p className="text-slate-500 text-sm mb-8">Please sign in to view your profile.</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-colors"
            style={{ boxShadow: '0 0 20px rgba(245,158,11,0.25)' }}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const profileCompletionFallback = profile ? Math.round([
    profile.name, profile.username, profile.email, profile.phone,
    profile.dob, profile.address, profile.gender, profile.nationality,
    profile.language, profile.bio, profile.website, profile.occupation,
    profile.favoriteTeam,
  ].filter(Boolean).length / 13 * 100) : 0;

  const now = new Date();
  const displayName = session?.user?.name || profile?.name || 'Guest User';
  const displayEmail = session?.user?.email || profile?.email || '';
  const displayImage = session?.user?.image || profile?.image || null;

  return (
    <div className="min-h-screen py-24 px-6 md:px-12 bg-[#020617]">
      <div className="max-w-6xl mx-auto z-10 relative">

        {/* Page header */}
        <div className="mb-12">
          <p className="label-eyebrow mb-2">My Account</p>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-3">
            Profile <span className="font-light text-slate-600">Hub</span>
          </h1>
          <p className="text-slate-500">Manage your personal information and account settings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ── Main content ── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Profile card */}
            <div className="glass-card p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="shrink-0 relative">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_32px_rgba(245,158,11,0.1)] flex items-center justify-center bg-white/5">
                  <ProfileImage
                    src={displayImage}
                    name={displayName}
                    size={144}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Online dot */}
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-slate-950 bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
                  {displayName}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-slate-600 text-xs" />
                    <span>{displayEmail}</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-700" />
                  <div className="flex items-center gap-2">
                    <FaIdCard className="text-slate-600 text-xs" />
                    <span className="font-semibold text-slate-400">Member</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tab.Group>
              <Tab.List className="flex gap-1.5 p-1.5 glass-card overflow-x-auto">
                {tabs.map((tab) => (
                  <Tab
                    key={tab}
                    className={({ selected }) =>
                      classNames(
                        'flex-1 min-w-[110px] py-2.5 text-xs font-bold rounded-xl transition-all uppercase tracking-wide',
                        selected
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                      )
                    }
                  >
                    {tab}
                  </Tab>
                ))}
              </Tab.List>

              <Tab.Panels className="focus:outline-none">
                {/* ── Account Tab ── */}
                <Tab.Panel className="space-y-5 outline-none animate-fade-in pt-2">
                  {/* Info grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { label: 'Full Name',    value: profile?.name,        icon: FaUser },
                      { label: 'Username',     value: profile?.username,     icon: FaIdCard },
                      { label: 'Phone',        value: profile?.phone,        icon: FaPhone },
                      { label: 'Date of Birth',value: profile?.dob,          icon: FaCalendarAlt },
                      { label: 'Location',     value: profile?.address,      icon: FaMapMarkerAlt },
                      { label: 'Gender',       value: profile?.gender,       icon: FaUsers },
                      { label: 'Nationality',  value: profile?.nationality,  icon: FaIdCard },
                      { label: 'Language',     value: profile?.language,     icon: FaEnvelope },
                    ].map((item, idx) => (
                      <div key={idx} className="glass-card-hover p-5 flex items-start gap-4">
                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
                          <item.icon className="text-slate-600 text-sm" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">{item.label}</p>
                          <p className="text-slate-300 font-medium truncate text-sm">
                            {item.value || <span className="text-slate-700 italic">Not set</span>}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bio */}
                  <div className="glass-card p-6">
                    <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-3">Biography</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      {profile?.bio || <span className="text-slate-700 italic">No biography provided.</span>}
                    </p>
                  </div>
                </Tab.Panel>

                {/* ── Membership Tab ── */}
                <Tab.Panel className="outline-none animate-fade-in pt-2">
                    <div className="glass-card p-10 text-center relative overflow-hidden">
                      {profile?.isMember ? (() => {
                        const latestMembership = (profile as any).memberships?.[0];
                        const isExpired = latestMembership?.endDate && new Date(latestMembership.endDate) < now;
                        return (
                          <div className="relative z-10 w-full max-w-lg mx-auto">
                            <div className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-6 border ${isExpired ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}
                              style={isExpired ? {} : { boxShadow: '0 0 24px rgba(245,158,11,0.2)' }}>
                              {isExpired ? <FaExclamationTriangle className="text-3xl" /> : <FaStar className="text-3xl" />}
                            </div>
                            <h3 className={`text-3xl font-black tracking-tight mb-2 ${isExpired ? 'text-rose-400' : 'text-white'}`}>
                              {isExpired ? 'Membership Expired' : 'Elite Member'}
                            </h3>
                            <p className="text-slate-500 mb-8 text-sm">
                              {isExpired ? 'Your membership has lapsed. Renew to regain access.' : 'You have an active club membership.'}
                            </p>
                            <div className="flex justify-center gap-4 text-left">
                              <div className="bg-white/[0.03] border border-white/8 p-5 rounded-2xl flex-1">
                                <span className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">Member Since</span>
                                <span className="text-slate-300 font-semibold text-sm">{profile.memberSince ? format(new Date(profile.memberSince), 'MMM d, yyyy') : 'N/A'}</span>
                              </div>
                              <div className="bg-white/[0.03] border border-white/8 p-5 rounded-2xl flex-1">
                                <span className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">Plan</span>
                                <span className="text-slate-300 font-semibold text-sm">{profile.membershipType || 'Standard'}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })() : (
                        <div className="relative z-10 w-full max-w-lg mx-auto py-8">
                          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mx-auto mb-6">
                            <FaUserCircle className="text-4xl text-slate-600" />
                          </div>
                          <h3 className="text-3xl font-black text-white tracking-tight mb-3">Standard Account</h3>
                          <p className="text-slate-500 mb-10 text-sm">Upgrade to an elite membership to unlock priority access, exclusive content, and premium support.</p>
                          <button
                            onClick={() => router.push('/membership')}
                            className="py-3 px-8 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-colors"
                            style={{ boxShadow: '0 0 20px rgba(245,158,11,0.25)' }}
                          >
                            Upgrade Membership
                          </button>
                        </div>
                      )}
                    </div>
                </Tab.Panel>

                {/* ── Settings Tab ── */}
                <Tab.Panel className="space-y-5 outline-none animate-fade-in pt-2">
                  <div className="glass-card p-8">
                    <h3 className="text-base font-black text-white tracking-tight mb-6 flex items-center gap-3">
                      <FaShieldAlt className="text-amber-500/60" />
                      Security &amp; Access
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Two-Factor Authentication', status: 'Disabled', action: 'Enable', danger: true, icon: FaLock },
                        { label: 'Active Sessions', status: '1 Current Instance', action: 'Manage', danger: false, icon: FaUsers },
                        { label: 'Primary Location', status: 'Unknown', action: 'Update', danger: false, icon: FaMapMarkerAlt },
                      ].map((sec, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-white/[0.03] border border-white/8 rounded-2xl">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/5 border border-white/8 rounded-xl flex items-center justify-center text-slate-500">
                              <sec.icon className="text-sm" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-300 text-sm">{sec.label}</p>
                              <p className={`text-xs ${sec.danger ? 'text-rose-400' : 'text-slate-600'}`}>{sec.status}</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 text-xs font-bold rounded-xl transition-colors border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200">
                            {sec.action}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => router.push('/auth/change-password')}
                      className="flex-1 py-4 glass-card-hover text-slate-300 font-bold rounded-2xl text-sm transition-all"
                    >
                      Change Password
                    </button>
                    <button className="flex-1 py-4 border border-rose-500/20 bg-rose-500/5 text-rose-400 font-bold rounded-2xl text-sm hover:bg-rose-500/10 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1 space-y-5">
            {/* Profile completion ring */}
            <div className="glass-card p-6 text-center">
              <h3 className="text-xs font-bold text-slate-500 mb-5 tracking-wider uppercase">Profile Completion</h3>
              <div className="relative h-32 flex items-center justify-center mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-white/5" />
                  <circle
                    cx="64" cy="64" r="56"
                    stroke="currentColor"
                    strokeWidth="5"
                    fill="transparent"
                    strokeDasharray="351.85"
                    strokeDashoffset={351.85 * (1 - profileCompletionFallback / 100)}
                    className="text-amber-500 transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-white tracking-tighter">{profileCompletionFallback}%</span>
                </div>
              </div>
              <p className="text-xs text-slate-600">Complete your profile to unlock all features.</p>
            </div>

            {/* Edit profile button */}
            <button
              onClick={() => router.push('/profile/edit')}
              className="w-full glass-card-hover p-5 flex items-center justify-between group transition-all"
              style={{ boxShadow: 'none' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500">
                  <FaEdit />
                </div>
                <span className="font-bold tracking-wide text-slate-300 text-sm">Edit Profile</span>
              </div>
            </button>

            {/* Quick links */}
            <div className="glass-card p-5 space-y-2">
              <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-3">Quick Links</h3>
              {[
                { label: 'Order History', href: '/profile/orders' },
                { label: 'Membership', href: '/profile/membership' },
                { label: 'Support', href: '/support' },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between py-2 px-3 rounded-xl text-xs font-medium text-slate-500 hover:text-amber-400 hover:bg-white/5 transition-colors"
                >
                  {link.label}
                  <span className="text-slate-700">→</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}