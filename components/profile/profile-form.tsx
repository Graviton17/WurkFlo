"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateUserAction, uploadAvatarAction } from "@/app/actions/user.actions";

export function ProfileForm({ user }: { user: any }) {
  const [fullName, setFullName] = useState(user.full_name || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const res = await updateUserAction({ fullName });
    
    if (res.success) {
      setMessage("Profile updated successfully.");
    } else {
      setError(res.error || "Failed to update profile.");
    }
    setLoading(false);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadAvatarAction(formData);
    
    if (res.success && res.data) {
      setAvatarUrl(res.data);
      setMessage("Avatar uploaded successfully.");
    } else {
      setError(res.error || "Failed to upload avatar.");
    }
    setUploading(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <div className="space-y-8 w-full max-w-xl bg-card p-6 rounded-lg border border-border">
      <div className="flex items-center space-x-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="text-2xl">{(user.full_name || user.email || "U").slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <Label htmlFor="avatar-upload" className="mb-2 block">Profile Picture</Label>
          <input 
            type="file" 
            id="avatar-upload" 
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <div className="flex space-x-3 items-center">
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              type="button"
            >
              {uploading ? "Uploading..." : "Change Avatar"}
            </Button>
            {uploading && <p className="text-sm text-muted-foreground">Uploading file...</p>}
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            value={user.email || ""} 
            disabled
            className="bg-muted text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground">Your email address is managed by your authentication provider.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input 
            id="fullName" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)} 
            placeholder="e.g. Jane Doe" 
          />
        </div>
        
        {message && <p className="text-sm font-medium text-green-500">{message}</p>}
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        
        <Button type="submit" disabled={loading || uploading} variant="default">
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}
