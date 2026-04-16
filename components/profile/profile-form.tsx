"use client";

import React from "react";
import { User } from "@/types/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Loader2, Save } from "lucide-react";
import { useProfileForm } from "@/hooks/use-profile-form";

export function ProfileForm({ user }: { user: User }) {
  const {
    fullName,
    setFullName,
    avatarUrl,
    fileInputRef,
    isPending,
    status,
    hasChanges,
    handleAvatarClick,
    handleFileChange,
    handleSave,
  } = useProfileForm(user);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Kinetic Monolith Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#e7e4ec]">
          Personal Profile
        </h1>
        <p className="mt-2 text-sm text-[#acaab1]">
          Manage your personal details and account preferences.
        </p>
      </div>

      <div className="bg-[#1f1f24] rounded-2xl border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div 
              className="relative group w-24 h-24 rounded-full bg-[#131316] border border-white/10 overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-white/30 transition-all"
              onClick={handleAvatarClick}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-[#e7e4ec]">
                  {(fullName || user.email).charAt(0).toUpperCase()}
                </span>
              )}
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
            <span className="text-xs text-[#acaab1]">Click to change</span>
          </div>

          {/* Form Section */}
          <div className="flex-1 space-y-5 w-full">
            <div className="space-y-2">
              <Label className="text-[#acaab1] text-xs uppercase tracking-wider">Email Address</Label>
              <div className="flex items-center h-10 w-full rounded-md border border-white/5 bg-[#0e0e10]/50 px-3 text-sm text-[#75757c] cursor-not-allowed">
                {user.email}
              </div>
              <p className="text-[10px] text-[#565457]">Email cannot be changed directly.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-[#acaab1] text-xs uppercase tracking-wider">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="bg-[#0e0e10] border-white/10 text-[#e7e4ec] placeholder:text-[#565457] focus-visible:ring-[#c6c6c7]/50"
              />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="text-sm">
            {status.text && (
              <span className={status.type === "error" ? "text-[#ec7c8a]" : status.type === "success" ? "text-green-500" : "text-[#acaab1]"}>
                {status.text}
              </span>
            )}
          </div>
          
          <Button 
            onClick={handleSave} 
            disabled={isPending || !hasChanges}
            className="bg-[#c6c6c7] hover:bg-[#e2e2e2] text-[#3f4041] transition-all duration-200 shadow-[0_0_15px_rgba(198,198,199,0.3)] disabled:opacity-50 disabled:shadow-none"
          >
            {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
