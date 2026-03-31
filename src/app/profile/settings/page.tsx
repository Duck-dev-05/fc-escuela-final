"use client";
import { useEffect, useState, Suspense } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  FaUserEdit, FaCheckCircle, FaExclamationCircle, 
  FaShieldAlt, FaTrashAlt, FaLock, FaGlobe
} from 'react-icons/fa';
import ProfileImage from "@/components/ProfileImage";
import { motion } from "framer-motion";

function SettingsContent() {
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
        setError('Unable to load account details.');
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
           <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading Identity Vault...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 relative selection:bg-slate-200 selection:text-slate-900">
       <div className="max-w-5xl mx-auto px-6 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 border-b border-slate-200 pb-12 mb-12"
          >
             <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Account <span className="text-slate-400 font-light">Settings</span>
             </h1>
             <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                <span>Manage your security, preferences, and identity parameters.</span>
             </div>
          </motion.div>

          <div className="flex flex-col gap-8">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden"
            >
               {/* Vault Header: Profile Info */}
               <div className="p-10 md:p-14 border-b border-slate-100 bg-slate-900 text-white flex flex-col md:flex-row gap-10 items-center md:items-start relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-800/50 rounded-full blur-[100px] -mt-40 -mr-40 pointer-events-none" />
                  
                  <ProfileImage 
                     src={profile?.image} 
                     name={profile?.name} 
                     size={120} 
                     className="rounded-2xl border-4 border-slate-800 shadow-2xl shrink-0 z-10" 
                  />
                  
                  <div className="flex-1 text-center md:text-left z-10 w-full">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                       <div>
                         <h3 className="text-3xl font-black tracking-tight mb-1">{profile?.name || 'User'}</h3>
                         <p className="text-sm font-medium text-slate-400">{profile?.email}</p>
                       </div>
                       <button 
                         onClick={() => router.push('/profile/edit')}
                         className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-slate-900 rounded-xl text-xs font-black shadow-lg hover:bg-slate-100 transition-colors shrink-0 uppercase tracking-widest"
                       >
                         <FaUserEdit className="text-slate-400" />
                         Manage Profile
                       </button>
                     </div>
                     
                     <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-8">
                        <span className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 border ${profile?.emailVerified ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                           {profile?.emailVerified ? <FaCheckCircle /> : <FaExclamationCircle />}
                           {profile?.emailVerified ? 'Verified Account' : 'Unverified Identity'}
                        </span>
                        <span className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 border border-slate-700">
                           <FaGlobe className="text-slate-500" />
                           {profile?.nationality || 'Global Region'}
                        </span>
                     </div>
                  </div>
               </div>

               {/* Split Data Layout */}
               <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-white">
                   <div className="w-full md:w-1/2 p-10 md:p-14">
                      <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-6">
                         <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                            <FaUserEdit className="text-slate-400" />
                         </div>
                         <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Account Registry</h3>
                      </div>

                      <div className="space-y-6">
                         {[
                           { label: 'Username', value: profile?.username },
                           { label: 'Biography', value: profile?.bio ? 'Configured' : 'Empty Status' },
                           { label: 'Favorite Team', value: profile?.favoriteTeam },
                           { label: 'Membership Level', value: (session?.user?.membershipType as string)?.replace('price_', '') || 'Club Fan' }
                         ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center py-2 hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors">
                               <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{item.label}</span>
                               <span className="text-sm font-black text-slate-900 capitalize text-right">{item.value || '-'}</span>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="w-full md:w-1/2 p-10 md:p-14 bg-slate-50/50">
                      <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-6">
                         <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                            <FaShieldAlt className="text-amber-500" />
                         </div>
                         <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Security Gate</h3>
                      </div>
                      
                      <div className="flex flex-col h-[calc(100%-104px)] justify-between gap-6">
                         <div className="p-6 bg-white border border-slate-200 rounded-2xl flex flex-col gap-3 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                               <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                                 <FaCheckCircle className="text-emerald-500 text-lg" />
                               </div>
                               <h4 className="text-sm font-black text-slate-900">Secure Protocol Active</h4>
                            </div>
                            <p className="text-xs font-medium text-slate-500 leading-relaxed">
                               Your personal data is encrypted. Standard multi-factor authentication modules are offline.
                            </p>
                         </div>
                         
                         <div className="mt-auto">
                            <button 
                              onClick={() => router.push('/auth/change-password')}
                              className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-900 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-md transition-colors"
                            >
                               <FaLock className="text-slate-400" />
                               Modify Credentials
                            </button>
                         </div>
                      </div>
                   </div>
               </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="mt-6 p-10 md:p-12 bg-white border border-red-200 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative"
             >
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -mt-20 -mr-20 pointer-events-none" />
                
                <div className="flex items-center gap-8 relative z-10 w-full md:w-auto">
                   <div className="w-16 h-16 rounded-2xl bg-white border border-red-200 flex items-center justify-center shrink-0 shadow-sm">
                      <FaTrashAlt className="text-red-500 text-2xl" />
                   </div>
                   <div className="flex-1">
                      <h3 className="text-2xl font-black text-red-900 tracking-tight mb-2">Erase Identity</h3>
                      <p className="text-xs font-bold text-red-700/60 max-w-lg leading-relaxed uppercase tracking-wider">
                         Permanently purge your digital footprint, memberships, and support tickets from the master registry.
                      </p>
                   </div>
                </div>
                
                <button 
                   onClick={async () => {
                      if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
                         try {
                            const response = await fetch('/api/users/delete', { method: 'DELETE' });
                            if (response.ok) {
                               await signOut({ redirect: false });
                               router.push('/');
                            } else {
                               const data = await response.json();
                               alert(data.error || 'Account deletion failed.');
                            }
                         } catch (error) {
                            alert('An error occurred during account deletion.');
                         }
                      }
                   }}
                   className="px-8 py-5 bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 rounded-[1.25rem] text-xs font-black uppercase tracking-widest shadow-sm transition-all shrink-0 w-full md:w-auto z-10"
                >
                   Terminate Data
                </button>
             </motion.div>
             
          </div>
       </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 animate-pulse">
           <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
