"use client";

import { useState, useRef } from "react";
import { type User as UserType } from "@/types/index";
import { Camera, Loader2, Save, CheckCircle2, User as UserIcon } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function ProfileSettings({ initialData }: { initialData: UserType }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialData.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatar_url || "");
  
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setStatus({ type: null, message: "" });
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        setStatus({ type: 'error', message: "Image must be less than 5MB" });
        return;
      }

      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${initialData.id}-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (error) {
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setAvatarUrl(urlData.publicUrl);
      
      // Auto-save when avatar changes
      await saveProfile(urlData.publicUrl, fullName);

    } catch (err: any) {
      console.error("Upload error:", err);
      // Friendly message if bucket doesn't exist
      if (err.message?.includes("Bucket not found") || err.name === "StorageApiError") {
         setStatus({ type: 'error', message: "Storage is not fully configured (missing 'avatars' bucket). Please contact support." });
      } else {
         setStatus({ type: 'error', message: err.message || "Failed to upload image." });
      }
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const saveProfile = async (newAvatarUrl: string, newFullName: string) => {
    setSaving(true);
    setStatus({ type: null, message: "" });
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: newFullName,
          avatar_url: newAvatarUrl
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save profile");

      setStatus({ type: 'success', message: "Profile updated successfully." });
      router.refresh(); // Refresh outer server layout to sync any parent state
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProfile(avatarUrl, fullName);
  };

  // derived state for avatar initials
  const initials = fullName ? fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : initialData.email.substring(0,2).toUpperCase();

  return (
    <div className="w-full rounded-[18px] bg-white/[0.02] border border-white/[0.05] p-8 backdrop-blur-md shadow-xl flex flex-col gap-8">
      
      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-white/[0.05]">
        <div className="relative group">
           <div className="w-24 h-24 rounded-full overflow-hidden bg-white/[0.05] border-2 border-white/10 flex items-center justify-center relative">
              {avatarUrl ? (
                 <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                 <span className="text-2xl font-semibold text-white/50">{initials}</span>
              )}
              
              {uploading && (
                 <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                 </div>
              )}
              
              {!uploading && (
                <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm">
                  <Camera className="w-5 h-5 text-white mb-1" />
                  <span className="text-[10px] font-medium text-white uppercase tracking-wider">Change</span>
                </div>
              )}
           </div>
           
           <input 
             type="file" 
             ref={fileInputRef} 
             className="hidden" 
             accept="image/png, image/jpeg, image/gif, image/webp" 
             onChange={handleFileChange}
             disabled={uploading || saving}
           />
        </div>
        
        <div className="flex flex-col gap-1.5 text-center sm:text-left">
           <h3 className="text-lg font-medium text-white">Profile Picture</h3>
           <p className="text-sm text-white/40 max-w-sm">
             We support high-res static and animated images. Max limit 5MB.
           </p>
           <button 
             type="button"
             onClick={() => fileInputRef.current?.click()}
             disabled={uploading || saving}
             className="text-xs font-medium text-emerald-400 hover:text-emerald-300 w-fit mx-auto sm:mx-0 mt-1 transition-colors disabled:opacity-50"
           >
             Upload new picture
           </button>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        <div className="flex flex-col gap-2">
          <label htmlFor="fullName" className="text-sm font-medium text-white/70">
            Display Name
          </label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <UserIcon className="h-4 w-4 text-white/30" />
             </div>
             <input
               id="fullName"
               type="text"
               value={fullName}
               onChange={(e) => setFullName(e.target.value)}
               placeholder="Enter your full name"
               className="h-[46px] w-full border border-white/10 rounded-[12px] bg-white/[0.03] hover:bg-white/[0.05] text-white pl-10 pr-4 outline-none transition-all duration-300 placeholder:text-white/30 focus:border-[#ff1f1f]/50 focus:ring-2 focus:ring-[#ff1f1f]/20 focus:bg-white/[0.04] shadow-inner"
             />
          </div>
          <p className="text-xs text-white/40 mt-1">
             This is how other users will see you in projects and comments.
          </p>
        </div>

        {status.message && (
           <div className={`p-4 rounded-[12px] flex items-center gap-3 text-sm font-medium border ${
             status.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
           }`}>
              {status.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
              {status.message}
           </div>
        )}

        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving || uploading || (fullName === (initialData.full_name || "") && avatarUrl === (initialData.avatar_url || ""))}
            className="h-[42px] px-6 rounded-[12px] bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin text-black/60" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
        
      </form>

    </div>
  );
}
