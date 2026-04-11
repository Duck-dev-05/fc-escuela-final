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
  roles?: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tabs = profile?.roles === 'admin' 
    ? ['Overview', 'Directory', 'Settings'] 
    : ['Account', 'Membership', 'Settings'];

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 border-t-2 border-slate-900 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium tracking-wide text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
        <div className="max-w-md w-full bg-white border border-slate-200 p-10 text-center rounded-2xl shadow-sm">
          <FaLock className="mx-auto h-10 w-10 text-slate-300 mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Access Restricted</h2>
          <p className="text-slate-500 text-sm mb-8">Please sign in to view your profile.</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors"
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
    <div className="min-h-screen py-24 px-6 md:px-12 bg-slate-50 selection:bg-slate-200 selection:text-slate-900">
      <div className="max-w-6xl mx-auto z-10 relative">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
            Profile <span className="font-light text-slate-400">Hub</span>
          </h1>
          <p className="text-slate-500 text-lg">Manage your personal information and account settings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white border border-slate-200 p-8 md:p-12 rounded-3xl shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="shrink-0 relative">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center">
                  <ProfileImage 
                    src={displayImage} 
                    name={displayName} 
                    size={160} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">Active</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                  {displayName}
                </h2>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-6 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-slate-400" />
                    <span>{displayEmail}</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />
                  <div className="flex items-center gap-2">
                    <FaIdCard className="text-slate-400" />
                    <span className="font-medium text-slate-900">{profile?.roles === 'admin' ? 'Head Coach' : 'Member'}</span>
                  </div>
                </div>
              </div>
            </div>

            <Tab.Group>
              <Tab.List className="flex gap-2 p-1 bg-slate-100/80 border border-slate-200/60 rounded-xl overflow-x-auto">
                {tabs.map((tab) => (
                  <Tab
                    key={tab}
                    className={({ selected }) =>
                      classNames(
                        'flex-1 min-w-[120px] py-3 text-sm font-semibold rounded-lg transition-all',
                        selected
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                      )
                    }
                  >
                    {tab}
                  </Tab>
                ))}
              </Tab.List>
              
              <Tab.Panels className="focus:outline-none">
                <Tab.Panel className="space-y-8 outline-none animate-fade-in">
                  {profile?.roles === 'admin' && (
                    <div className="space-y-8">
                      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm relative overflow-hidden">
                         <div className="absolute top-8 right-8 text-slate-100">
                            <FaQuoteLeft className="text-6xl" />
                         </div>
                         <div className="relative z-10">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Tactical Philosophy</h3>
                            <p className="text-2xl font-bold text-slate-800 tracking-tight leading-tight mb-8 max-w-2xl">
                               "Aggression is the primary directive. We dominate the pitch through high-frequency transitions and relentless spatial control."
                            </p>
                            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-100 text-sm">
                               <div>
                                  <span className="block text-slate-400 font-medium mb-1">System</span>
                                  <span className="font-bold text-slate-900">4-3-3 Attacking</span>
                                </div>
                               <div>
                                  <span className="block text-slate-400 font-medium mb-1">Tempo</span>
                                  <span className="font-bold text-slate-900">High</span>
                                </div>
                               <div>
                                  <span className="block text-slate-400 font-medium mb-1">Focus</span>
                                  <span className="font-bold text-slate-900">Verticality</span>
                                </div>
                            </div>
                         </div>
                      </div>

                      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
                         <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recent Honors</h3>
                            <span className="text-lg font-bold text-slate-900">4 Titles</span>
                         </div>
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                               { title: 'Divisional Shield', year: '2025', icon: FaMedal },
                               { title: 'Operational Cup', year: '2024', icon: FaTrophy },
                               { title: 'Vanguard Series', year: '2024', icon: FaStar },
                               { title: 'Regional Master', year: '2023', icon: FaShieldAlt }
                            ].map((medal, i) => (
                               <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                                  <medal.icon className="text-3xl text-slate-400 mb-4" />
                                  <h4 className="text-sm font-bold text-slate-900 tracking-tight mb-1">{medal.title}</h4>
                                  <span className="text-xs text-slate-500 font-medium">{medal.year}</span>
                               </div>
                            ))}
                         </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Full Name', value: profile?.name, icon: FaUser },
                      { label: 'Username', value: profile?.username, icon: FaIdCard },
                      { label: 'Phone', value: profile?.phone, icon: FaPhone },
                      { label: 'Date of Birth', value: profile?.dob, icon: FaCalendarAlt },
                      { label: 'Location', value: profile?.address, icon: FaMapMarkerAlt },
                      { label: 'Gender', value: profile?.gender, icon: FaUsers },
                      { label: 'Nationality', value: profile?.nationality, icon: FaIdCard },
                      { label: 'Language', value: profile?.language, icon: FaEnvelope },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl flex items-start gap-4 shadow-sm hover:border-slate-300 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                          <item.icon className="text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                          <p className="text-slate-900 font-medium truncate">
                            {item.value || <span className="text-slate-300 italic">Not set</span>}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Biography</h3>
                    <p className="text-slate-700 leading-relaxed">
                      {profile?.bio || <span className="text-slate-400 italic">No biography provided.</span>}
                    </p>
                  </div>
                </Tab.Panel>

                <Tab.Panel className="outline-none animate-fade-in">
                  {profile?.roles === 'admin' ? (
                    <div className="bg-white border border-slate-200 p-10 rounded-3xl shadow-sm text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaUsers className="text-3xl text-slate-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Team Directory</h3>
                      <p className="text-slate-500 mb-8 max-w-lg mx-auto">
                        Manage and view all registered personnel within your organization. 
                        Ensure all members are correctly assigned and documented.
                      </p>
                      <div className="flex justify-center gap-6 mb-10">
                        <div className="bg-slate-50 border border-slate-100 px-8 py-4 rounded-2xl text-center">
                          <span className="block text-2xl font-bold text-slate-900">12</span>
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1 block">Active Members</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 px-8 py-4 rounded-2xl text-center">
                          <span className="block text-2xl font-bold text-slate-900">All</span>
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1 block">Verified</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => router.push('/coaching/squad')} 
                        className="py-3 px-8 bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors"
                      >
                        Manage Directory
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 p-10 rounded-3xl shadow-sm text-center relative overflow-hidden">
                      {profile?.isMember ? (() => {
                        const latestMembership = (profile as any).memberships?.[0];
                        const isExpired = latestMembership?.endDate && new Date(latestMembership.endDate) < now;
                        return (
                          <div className="relative z-10 w-full max-w-lg mx-auto">
                            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 shadow-sm border ${isExpired ? 'bg-red-50 text-red-500 border-red-100' : 'bg-slate-950 text-white border-slate-800'}`}>
                              {isExpired ? <FaExclamationTriangle className="text-3xl" /> : <FaStar className="text-3xl" />}
                            </div>
                            <h3 className={`text-3xl font-bold tracking-tight mb-2 ${isExpired ? 'text-red-600' : 'text-slate-900'}`}>
                              {isExpired ? 'Membership Expired' : 'Elite Member'}
                            </h3>
                            <p className="text-slate-500 mb-8">
                              {isExpired ? 'Your membership has lapsed. Renew to regain access.' : 'You have an active club membership.'}
                            </p>
                            
                            <div className="flex justify-center gap-4 text-left">
                              <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex-1">
                                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Member Since</span>
                                <span className="text-slate-900 font-medium">{profile.memberSince ? format(new Date(profile.memberSince), 'MMM d, yyyy') : 'N/A'}</span>
                              </div>
                              <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex-1">
                                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Plan</span>
                                <span className="text-slate-900 font-medium">{profile.membershipType || 'Standard'}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })() : (
                        <div className="relative z-10 w-full max-w-lg mx-auto py-8">
                          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <FaUserCircle className="text-4xl" />
                          </div>
                          <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">Standard Account</h3>
                          <p className="text-slate-500 mb-10">Upgrade to an elite membership to unlock priority access, exclusive content, and premium support.</p>
                          <button
                            onClick={() => router.push('/membership')}
                            className="py-3 px-8 bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors"
                          >
                            Upgrade Membership
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </Tab.Panel>

                <Tab.Panel className="space-y-6 outline-none animate-fade-in">
                  <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-6 flex items-center gap-3">
                      <FaShieldAlt className="text-slate-400" />
                      Security & Access
                    </h3>
                    
                    <div className="space-y-4">
                      {[
                        { label: 'Two-Factor Authentication', status: 'Disabled', action: 'Enable', danger: true, icon: FaLock },
                        { label: 'Active Sessions', status: '1 Current Instance', action: 'Manage', danger: false, icon: FaUsers },
                        { label: 'Primary Location', status: 'Unknown', action: 'Update', danger: false, icon: FaMapMarkerAlt },
                      ].map((sec, i) => (
                        <div key={i} className="flex justify-between items-center p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400">
                              <sec.icon />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{sec.label}</p>
                              <p className={`text-sm ${sec.danger ? 'text-red-500' : 'text-slate-500'}`}>{sec.status}</p>
                            </div>
                          </div>
                          <button className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors border ${sec.danger ? 'border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'}`}>
                            {sec.action}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={() => router.push('/auth/change-password')}
                      className="flex-1 py-4 bg-white border border-slate-200 text-slate-900 font-semibold rounded-2xl shadow-sm hover:border-slate-300 transition-colors"
                    >
                      Change Password
                    </button>
                    <button
                      className="flex-1 py-4 bg-white border border-red-100 text-red-600 font-semibold rounded-2xl shadow-sm hover:bg-red-50 transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-6 tracking-tight">Profile Completion</h3>
              <div className="relative h-32 flex items-center justify-center mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                  <circle 
                    cx="64" cy="64" r="56" 
                    stroke="currentColor" 
                    strokeWidth="6" 
                    fill="transparent" 
                    strokeDasharray="351.85" 
                    strokeDashoffset={351.85 * (1 - profileCompletionFallback / 100)} 
                    className="text-slate-950 transition-all duration-1000" 
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-950 tracking-tighter">{profileCompletionFallback}%</span>
                </div>
              </div>
              <p className="text-center text-sm text-slate-500">
                Complete your profile to unlock all features.
              </p>
            </div>

            <button 
              onClick={() => router.push('/profile/edit')}
              className="w-full bg-slate-950 text-white p-6 rounded-3xl shadow-sm hover:bg-slate-800 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white">
                  <FaEdit />
                </div>
                <span className="font-semibold tracking-wide">Edit Profile</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}