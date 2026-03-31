"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaUserEdit, FaCamera, FaSave, FaTimes, FaLock, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import ProfileImage from "@/components/ProfileImage";
import DatePicker from "@/components/DatePicker";

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

  // Allow all users to edit their profile fields
  const isSocialLogin = false;

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
      setError("Failed to save profile changes. Please try again.");
    }
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 border-t-2 border-slate-900 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium tracking-wide text-sm">Loading editor...</p>
        </div>
      </div>
    );
  }

  const lockedFields = {
    email: session?.user?.email || '',
  };

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-6 md:px-12 relative">
      {/* Notifications */}
      <div className="fixed top-24 right-6 z-50 space-y-4">
        {success && (
          <div className="bg-white border border-green-200 shadow-lg px-6 py-4 flex items-center gap-3 rounded-2xl animate-fade-in">
            <FaCheckCircle className="text-green-600 text-xl" />
            <span className="text-sm font-semibold text-slate-900">Profile Updated</span>
          </div>
        )}
        {error && (
          <div className="bg-white border border-red-200 shadow-lg px-6 py-4 flex items-center gap-3 rounded-2xl animate-fade-in">
            <FaExclamationTriangle className="text-red-500 text-xl" />
            <span className="text-sm font-semibold text-red-500">{error}</span>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto z-10 relative">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white rounded-2xl mb-6 flex items-center justify-center shadow-sm border border-slate-200">
            <FaUserEdit className="text-2xl text-slate-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
            Edit <span className="font-light text-slate-400">Profile</span>
          </h1>
          <p className="text-slate-500 text-lg">Update your personal details and account settings.</p>
        </div>

        <div className="bg-white border border-slate-200 p-8 md:p-12 rounded-3xl shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Image Upload Area */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group w-32 h-32 md:w-40 md:h-40">
                <div className="w-full h-full rounded-full overflow-hidden border border-slate-200 shadow-sm bg-slate-50 flex items-center justify-center">
                  <ProfileImage 
                    src={imagePreview || profile?.image} 
                    name={profile?.name} 
                    size={160} 
                    className="w-full h-full object-cover" 
                    glow={false}
                  />
                  <label className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white rounded-full">
                    <FaCamera className="text-3xl" />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>
              <p className="text-sm text-slate-500 font-medium">Click image to upload a new avatar</p>
            </div>

            <hr className="border-slate-100" />

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: 'Full Name', name: 'name', type: 'text', locked: false },
                { label: 'Username', name: 'username', type: 'text', locked: false },
                { label: 'Email Address', name: 'email', type: 'email', locked: true },
                { label: 'Phone Number', name: 'phone', type: 'text' },
                { label: 'Date of Birth', name: 'dob', type: 'date' },
                { label: 'Language', name: 'language', type: 'text' },
                { label: 'Occupation', name: 'occupation', type: 'text' },
                { label: 'Favorite Team', name: 'favoriteTeam', type: 'text' },
              ].map((field) => (
                <div key={field.name} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{field.label}</label>
                    {field.locked && <FaLock className="text-xs text-slate-400" title="Managed by OAuth provider" />}
                  </div>
                  {field.type === 'date' ? (
                    <DatePicker 
                      value={profile[field.name] || ''} 
                      onChange={(date) => setProfile({ ...profile, [field.name]: date })} 
                      placeholder={`Select ${field.label.toLowerCase()}...`}
                    />
                  ) : (
                    <input
                      name={field.name}
                      type={field.type}
                      value={field.locked ? lockedFields[field.name as keyof typeof lockedFields] : (profile[field.name] || '')}
                      onChange={handleChange}
                      readOnly={field.locked}
                      className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-sm ${field.locked ? 'opacity-60 cursor-not-allowed bg-slate-100' : 'hover:border-slate-300'}`}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  )}
                </div>
              ))}
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nationality</label>
                <select 
                  name="nationality" 
                  value={profile.nationality || ""} 
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-sm appearance-none"
                >
                  <option value="">Select country...</option>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gender</label>
                <select 
                  name="gender" 
                  value={profile.gender || ""} 
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-sm appearance-none"
                >
                  <option value="">Select gender...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-sm resize-y"
                  placeholder="Tell us a bit about yourself..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-100">
               <button
                 type="button"
                 onClick={() => router.push('/profile')}
                 className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-center gap-2 shadow-sm"
               >
                 <FaTimes />
                 Cancel
               </button>
               <button
                 type="submit"
                 disabled={saving}
                 className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
               >
                 {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-200 border-t-white"></div>
                      Saving Changes...
                    </>
                 ) : (
                    <>
                      <FaSave />
                      Save Changes
                    </>
                 )}
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}