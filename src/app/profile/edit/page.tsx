"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaUserEdit, FaCamera, FaSave, FaTimes, FaLock, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import ProfileImage from "@/components/ProfileImage";
import NeuralBackdrop from "@/components/NeuralBackdrop";

interface Profile {
  name: string;
  email: string;
  username: string;
  image?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  nationality?: string;
  language?: string;
  occupation?: string;
  favoriteTeam?: string;
  address?: string;
  website?: string;
  bio?: string;
  [key: string]: string | undefined;
}

const countries = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bangladesh", "Belarus", "Belgium", "Bolivia", "Bosnia", "Brazil", "Bulgaria",
  "Cambodia", "Cameroon", "Canada", "Chile", "China", "Colombia", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia",
  "Denmark", "Dominican Republic", "Ecuador", "Egypt", "Finland", "France", "Germany", "Greece",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Japan", "Jordan",
  "Kuwait", "Malaysia", "Mexico", "Netherlands", "New Zealand", "Norway", "Pakistan", "Peru", "Philippines",
  "Poland", "Portugal", "Qatar", "Russia", "Saudi Arabia", "Singapore", "South Africa", "South Korea", "Spain",
  "Sweden", "Switzerland", "Thailand", "Turkey", "UAE", "UK", "USA", "Vietnam"
];

export default function EditProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isSocialLogin = Boolean(session?.user?.email && session?.user?.name && session?.user?.image);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data.user);
      } catch (err) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    if (!profile) return;
    if (isSocialLogin && ["name", "email", "username"].includes(e.target.name)) return;
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const submitProfile = { ...profile };
      if (isSocialLogin) {
        submitProfile.name = session?.user?.name || '';
        submitProfile.email = session?.user?.email || '';
        submitProfile.username = session?.user?.email?.split("@")[0] || '';
      }

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (!uploadRes.ok) throw new Error('Failed to upload image');
        const { url } = await uploadRes.json();
        submitProfile.image = url;
      }

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitProfile),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      
      await update();
      setSaving(false);
      setSuccess(true);
      setTimeout(() => router.push("/profile"), 1500);
    } catch (err) {
      setSaving(false);
      setError("Synchronization Failure: Write request rejected.");
    }
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-6 animate-pulse">
           <div className="w-16 h-16 border-t-2 border-l-2 border-yellow-500 hud-border rounded-full animate-spin"></div>
           <p className="text-yellow-500 font-bold uppercase tracking-[0.3em] text-xs">Accessing Profile Core...</p>
        </div>
      </div>
    );
  }

  const lockedFields = isSocialLogin ? {
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    username: session?.user?.email?.split("@")[0] || '',
  } : {};

  return (
    <div className="min-h-screen bg-transparent py-20 px-4 relative overflow-hidden">
      <NeuralBackdrop ghostText="REG_DELTA" />

      {/* Notifications */}
      <div className="fixed top-24 right-6 z-50 space-y-4">
        {success && (
          <div className="glass-card border-green-500/50 bg-green-500/10 px-6 py-4 flex items-center gap-3 animate-slide-up">
            <FaCheckCircle className="text-green-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Registry Updated</span>
          </div>
        )}
        {error && (
          <div className="glass-card border-red-500/50 bg-red-500/10 px-6 py-4 flex items-center gap-3 animate-slide-up">
            <FaExclamationTriangle className="text-red-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">{error}</span>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto glass-card hud-border p-10 animate-slide-up relative z-10">
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                 <FaUserEdit className="text-yellow-500 text-xl" />
              </div>
              <div>
                 <h1 className="text-2xl font-black text-white uppercase tracking-widest">Protocol Delta</h1>
                 <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mt-1">Registry Modification Interface</p>
              </div>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Image Upload Area */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-yellow-500/50 transition-all">
                <ProfileImage 
                   src={imagePreview || profile?.image} 
                   name={profile?.name} 
                   size={128} 
                   className="rounded-2xl" 
                />
                <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <FaCamera className="text-2xl mb-1" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Upload Key</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Visual Identifier Synthesis</p>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {[
              { label: 'Operator Name', name: 'name', type: 'text', locked: isSocialLogin },
              { label: 'Transmission Code', name: 'username', type: 'text', locked: isSocialLogin },
              { label: 'Primary Terminal', name: 'email', type: 'email', locked: isSocialLogin },
              { label: 'Communications', name: 'phone', type: 'text' },
              { label: 'Origin Chronology', name: 'dob', type: 'date' },
              { label: 'Language Class', name: 'language', type: 'text' },
              { label: 'Primary Occupation', name: 'occupation', type: 'text' },
              { label: 'Liaison Unit', name: 'favoriteTeam', type: 'text' },
            ].map((field) => (
              <div key={field.name} className="relative group">
                <div className="flex justify-between items-center mb-1.5 px-1">
                  <label className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{field.label}</label>
                  {field.locked && <FaLock className="text-[9px] text-yellow-500" title="System Locked" />}
                </div>
                <div className="relative group">
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-[2px] h-0 bg-yellow-500 group-focus-within:h-full transition-all duration-500" />
                  <input
                    name={field.name}
                    type={field.type}
                    value={field.locked ? lockedFields[field.name as keyof typeof lockedFields] : profile[field.name]}
                    onChange={handleChange}
                    readOnly={field.locked}
                    className={`w-full bg-slate-950/40 border border-white/5 rounded-0 px-4 py-4 text-xs font-bold text-white focus:outline-none focus:border-yellow-500/50 transition-all ${field.locked ? 'opacity-30 cursor-not-allowed bg-transparent' : 'hover:border-white/20'} placeholder-white/5`}
                    placeholder={`Assign ${field.label}...`}
                  />
                </div>
              </div>
            ))}
            
            <div className="relative group">
               <label className="block text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5 px-1">Geo-Location Nationality</label>
               <select 
                 name="nationality" 
                 value={profile.nationality || ""} 
                 onChange={handleChange}
                 className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all appearance-none"
               >
                 <option value="" className="bg-slate-900">Select Geo-Origin</option>
                 {countries.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
               </select>
            </div>

            <div className="relative group">
               <label className="block text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5 px-1">Gender Classification</label>
               <select 
                 name="gender" 
                 value={profile.gender || ""} 
                 onChange={handleChange}
                 className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all appearance-none"
               >
                 <option value="" className="bg-slate-900">Classification</option>
                 <option value="Male" className="bg-slate-900">Male</option>
                 <option value="Female" className="bg-slate-900">Female</option>
                 <option value="Other" className="bg-slate-900">Other</option>
               </select>
            </div>

            <div className="md:col-span-2 relative group">
              <label className="block text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5 px-1">Operational Bio / Notes</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all placeholder-white/10"
                placeholder="Operational brief..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-white/5">
             <button
               type="button"
               onClick={() => router.push('/profile')}
               className="flex-1 px-8 py-4 glass-card hud-border text-slate-400 hover:text-white hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3"
             >
               <FaTimes />
               Abort Changes
             </button>
             <button
               type="submit"
               disabled={saving}
               className="btn-primary flex-1 py-4 text-[10px] flex items-center justify-center gap-3"
             >
               {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-slate-950"></div>
                    Sychronizing Registry...
                  </>
               ) : (
                  <>
                    <FaSave />
                    Commit Core Protocol
                  </>
               )}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}