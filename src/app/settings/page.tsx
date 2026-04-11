"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  FaLock, FaUserCircle, FaCheckCircle, FaExclamationCircle, 
  FaShieldAlt, FaTrashAlt, FaCog
} from 'react-icons/fa';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
   const [profile, setProfile] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

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
           <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
           <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Settings...</span>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') router.push('/login');

  return (
    <div className="min-h-screen py-16 px-6 lg:px-12 bg-slate-50 selection:bg-amber-500/30">
       <div className="max-w-[1200px] mx-auto pt-10">
          
          {/* Professional Header */}
          <div className="flex flex-col lg:flex-row items-start justify-between mb-16 gap-8 animate-slide-up">
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-[10px] text-amber-600 font-bold uppercase tracking-widest">
                    <FaCog className="text-xs" />
                    Security & Account
                 </div>
                 <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">
                    Account <span className="text-amber-500">Settings</span>
                 </h1>
                 <p className="text-slate-500 text-sm max-w-md font-medium">
                    Manage your personal information, security preferences, and account status.
                 </p>
              </div>

              <div className="flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                 <div className="flex flex-col text-right">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Status</span>
                    <span className="text-sm font-bold text-emerald-600">Secure Connection</span>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <FaShieldAlt />
                 </div>
              </div>
          </div>

        <div className="grid grid-cols-1 gap-10">
          {/* Profile Overview Card */}
          <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
             <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative">
                   {profile?.image ? (
                     <img src={profile.image} alt="Avatar" className="h-24 w-24 rounded-2xl object-cover border-2 border-slate-100" />
                   ) : (
                     <div className="h-24 w-24 rounded-2xl bg-slate-50 flex items-center justify-center border-2 border-slate-100">
                        <FaUserCircle className="h-12 w-12 text-slate-300" />
                     </div>
                   )}
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-3">
                   <div>
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{profile?.name || 'User'}</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{profile?.email}</p>
                   </div>
                   <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest">
                         {profile?.emailVerified ? (
                           <> <FaCheckCircle className="text-emerald-500" /> <span className="text-emerald-600">Verified Email</span> </>
                         ) : (
                           <> <FaExclamationCircle className="text-rose-500" /> <span className="text-rose-600">Unverified</span> </>
                         )}
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500">
                         Nationality: {profile?.nationality || 'Not Specified'}
                      </div>
                   </div>
                </div>
                
                <button 
                   onClick={() => router.push('/profile/edit')}
                   className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                >
                   Edit Profile
                </button>
             </div>
          </section>

          {/* Settings Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Account Details */}
             <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                   <div className="w-1.5 h-3 bg-amber-500 rounded-full" />
                   Account Details
                </h3>
                <div className="space-y-4">
                   {[
                     { label: 'Username', value: profile?.username },
                     { label: 'Bio', value: profile?.bio ? 'Personalized' : 'None' },
                     { label: 'Favorite Club', value: profile?.favoriteTeam },
                     { label: 'Membership', value: profile?.membershipType || 'Standard' }
                   ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                         <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.label}</span>
                         <span className="text-xs text-slate-900 font-bold">{item.value || '-'}</span>
                      </div>
                   ))}
                </div>
             </div>

             {/* Security Overview */}
             <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                   <div className="w-1.5 h-3 bg-slate-900 rounded-full" />
                   Security Status
                </h3>
                <div className="space-y-4">
                   <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-emerald-700 font-black uppercase tracking-widest">Active Protection</span>
                      </div>
                   </div>
                   <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                       Your account uses high-level encryption for data safety. Password transitions always require secondary confirmation.
                   </p>
                   <button 
                     onClick={() => router.push('/auth/change-password')}
                     className="w-full py-3 bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all mt-4 rounded-xl"
                   >
                     Change Password
                   </button>
                </div>
             </div>
          </div>

          {/* Danger Zone */}
          <section className="bg-rose-50 border border-rose-100 rounded-3xl p-8 relative overflow-hidden group">
             <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center border border-rose-100 shadow-sm">
                   <FaTrashAlt className="text-rose-500 text-2xl" />
                </div>
                <div className="flex-1 text-center md:text-left">
                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-1">Delete Account</h3>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-widest max-w-lg leading-relaxed">
                       This will permanently remove your data and subscription history.
                   </p>
                </div>
                <button 
                  onClick={async () => {
                    if (window.confirm('Confirm permanent deletion of your account?')) {
                      try {
                        const response = await fetch('/api/users/delete', { method: 'DELETE' });
                        if (response.ok) {
                          await signOut({ redirect: false });
                          router.push('/');
                        } else {
                          const data = await response.json();
                          alert(data.error || 'Deletion Failed');
                        }
                      } catch (error) {
                         alert('An error occurred.');
                      }
                    }
                  }}
                  className="px-8 py-3 bg-rose-600 text-white font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-all"
                >
                  Delete My Account
                </button>
             </div>
          </section>
        </div>
       </div>
    </div>
  );
}