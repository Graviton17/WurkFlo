"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateWorkspaceAction } from "@/app/actions/workspace.actions";

export function SettingsForm({ workspace }: { workspace: any }) {
  const [name, setName] = useState(workspace.name || "");
  const [slug, setSlug] = useState(workspace.slug || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const res = await updateWorkspaceAction(workspace.id, { name, slug });
    
    if (res.success) {
      setMessage("Workspace updated successfully.");
    } else {
      setError(res.error || "Failed to update workspace.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 w-full max-w-xl bg-card p-6 rounded-lg border border-border">
      <div className="space-y-2">
        <Label htmlFor="name">Workspace Name</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="e.g. Acme Corp" 
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Workspace Slug</Label>
        <Input 
          id="slug" 
          value={slug} 
          onChange={(e) => setSlug(e.target.value)} 
          placeholder="e.g. acme-corp" 
          required
        />
      </div>
      
      {message && <p className="text-sm font-medium text-green-500">{message}</p>}
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      
      <Button type="submit" disabled={loading} variant="default">
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
