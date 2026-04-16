"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TeamList({ members }: { members: any[] }) {
  if (!members || members.length === 0) {
    return <p className="text-muted-foreground">No team members found.</p>;
  }

  return (
    <div className="space-y-4 max-w-2xl">
      {members.map((member) => (
        <Card key={member.user_id} className="p-4 flex items-center justify-between bg-card border-border">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={member.user?.avatar_url || ""} />
              <AvatarFallback>{(member.user?.full_name || member.user?.email || "U").slice(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none text-foreground">
                {member.user?.full_name || member.user?.email || `User: ${member.user_id.slice(0, 8)}...`}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Role: <span className="capitalize font-medium">{member.role}</span>
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
