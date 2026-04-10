import { GetStartedChecklist } from "@/components/dashboard/GetStartedChecklist";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Lightbulb } from "lucide-react";

export default async function GetStartedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto w-full">
      <PageHeader 
        icon={<Lightbulb size={16} />} 
        title="Get started" 
      />
      <div className="px-8 py-4 lg:px-12 lg:py-6 max-w-5xl w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-white">
          Hey there, welcome aboard! 👋
        </h1>
        <p className="text-[#888] text-sm md:text-base mb-10 tracking-tight">
          Here's everything you need to kickstart your journey with WurkFlo.
        </p>


        {/* Checklist Section */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white mb-1 tracking-tight">Get started</h2>
          <p className="text-[0.85rem] text-[#888]">Begin your setup and see your ideas come to life faster.</p>
        </div>
        
        <GetStartedChecklist />

        {/* Invite Team Section */}
        <div className="mt-16 mb-4">
          <h2 className="text-lg font-semibold text-white mb-1 tracking-tight">Get your team on board</h2>
          <p className="text-[0.85rem] text-[#888]">Invite your colleagues to collaborate and build together.</p>
        </div>
        
        {/* User Card */}
        <div className="bg-[#101012] border border-white/5 rounded-xl p-5 mb-12 flex flex-col justify-center max-w-sm">
           <div className="flex flex-col gap-3">
             <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-medium">
               H
             </div>
             <div>
               <p className="text-[0.9rem] text-white font-medium">harshi.r.jain2005</p>
               <p className="text-[0.8rem] text-[#888] truncate">harshi.r.jain2005@gmail.com</p>
             </div>
           </div>
        </div>

        {/* Middle Section: Power Up & Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Power up your workspace */}
          <div className="md:col-span-2 bg-[#101012] border border-white/5 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Power up your workspace</h3>
            <div className="flex flex-wrap gap-3 mb-6">
              <button className="flex items-center gap-2 bg-[#0d0d0f] border border-white/10 hover:bg-white/5 px-3 py-1.5 rounded-md transition-colors text-[0.8rem] text-[#f0f0f0]">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                Connect GitHub
              </button>
              <button className="flex items-center gap-2 bg-[#0d0d0f] border border-white/10 hover:bg-white/5 px-3 py-1.5 rounded-md transition-colors text-[0.8rem] text-[#f0f0f0]">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FCA326" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 13.29-3.33-10a.42.42 0 0 0-.14-.18.38.38 0 0 0-.22-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18l-2.26 6.67H8.32L6.1 3.26a.42.42 0 0 0-.1-.18.38.38 0 0 0-.26-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18L2 13.29a.74.74 0 0 0 .27.83L12 21l9.69-6.88a.71.71 0 0 0 .31-.83Z"></path></svg>
                Connect GitLab
              </button>
              <button className="flex items-center gap-2 bg-[#0d0d0f] border border-white/10 hover:bg-white/5 px-3 py-1.5 rounded-md transition-colors text-[0.8rem] text-[#f0f0f0]">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E01E5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2s.9-2 2-2h2v4H4z"></path><path d="M16 4c0-1.1.9-2 2-2s2 .9 2 2v2h-4V4z"></path></svg>
                Connect Slack
              </button>
              <button className="flex items-center gap-2 bg-[#0d0d0f] border border-white/10 hover:bg-white/5 px-3 py-1.5 rounded-md transition-colors text-[0.8rem] text-[#f0f0f0]">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E15A46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 13.29-3.33-10a.42.42 0 0 0-.14-.18.38.38 0 0 0-.22-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18l-2.26 6.67H8.32L6.1 3.26a.42.42 0 0 0-.1-.18.38.38 0 0 0-.26-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18L2 13.29a.74.74 0 0 0 .27.83L12 21l9.69-6.88a.71.71 0 0 0 .31-.83Z"></path></svg>
                Connect Sentry
              </button>
              <button className="flex items-center gap-2 bg-[#0d0d0f] border border-white/10 hover:bg-white/5 px-3 py-1.5 rounded-md transition-colors text-[0.8rem] text-[#f0f0f0]">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5353" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>
                Connect Raycast
              </button>
              <button className="flex items-center gap-2 bg-[#0d0d0f] border border-white/10 hover:bg-white/5 px-3 py-1.5 rounded-md transition-colors text-[0.8rem] text-[#f0f0f0]">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0052CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 15 3-3"></path><path d="m15 9 3 3"></path><path d="M9 15h0"></path><path d="M9 9h0"></path><path d="M6 15h0"></path><path d="M6 9h0"></path></svg>
                Connect Jira
              </button>
            </div>
            
            <button className="text-[0.85rem] text-white hover:text-white/80 transition-colors flex items-center gap-1">
              Browse more integrations
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
            </button>
          </div>

          {/* Quick Links menu */}
          <div className="bg-[#101012] border border-white/5 rounded-xl p-3 flex flex-col justify-center space-y-1">
            <button className="flex items-center gap-3 text-left w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-[0.85rem] text-[#f0f0f0]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#888]"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
              Documentation
            </button>
            <button className="flex items-center gap-3 text-left w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-[0.85rem] text-[#f0f0f0]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#888]"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Contact Sales
            </button>
            <button className="flex items-center gap-3 text-left w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-[0.85rem] text-[#f0f0f0]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#888]"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              Message Support
            </button>
            <button className="flex items-center gap-3 text-left w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-[0.85rem] text-[#f0f0f0]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#888]"><path d="M22 6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6z"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M10 12h.01"/><path d="M14 12h.01"/><path d="M18 12h.01"/><path d="M6 8h.01"/><path d="M6 12h.01"/><path d="M10 16h4"/></svg>
              Keyboard Shortcuts
            </button>
            <button className="flex items-center gap-3 text-left w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-[0.85rem] text-[#f0f0f0]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#888]"><path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/><path d="M19 6.1v0a2 2 0 0 1 2 2v4.2"/></svg>
              Join Forum community
            </button>
          </div>
        </div>

        {/* Discover why teams switch to WurkFlo */}
        <div className="mb-4 mt-8">
          <h2 className="text-lg font-semibold text-white mb-1 tracking-tight">Discover why teams switch to WurkFlo</h2>
          <p className="text-[0.85rem] text-[#888]">Compare WurkFlo with the tools you use today and see the difference.</p>
        </div>
        
        <div className="bg-[#101012] border border-white/5 rounded-xl p-6 mb-24">
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 bg-[#0d0d0f] border border-white/10 hover:bg-white/5 px-4 py-2 rounded-md transition-colors text-[0.85rem] text-[#f0f0f0]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5E6AD2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
              Compare with Linear
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#888] ml-1"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
            </button>
            <button className="flex items-center gap-2 bg-[#0d0d0f] border border-white/10 hover:bg-white/5 px-4 py-2 rounded-md transition-colors text-[0.85rem] text-[#f0f0f0]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0052CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 15 3-3"/><path d="m15 9 3 3"/><path d="M9 15h0"/><path d="M9 9h0"/><path d="M6 15h0"/><path d="M6 9h0"/></svg>
              Compare with Jira
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#888] ml-1"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
            </button>
            <button className="flex items-center gap-2 bg-[#0d0d0f] border border-white/10 hover:bg-white/5 px-4 py-2 rounded-md transition-colors text-[0.85rem] text-[#f0f0f0]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F06A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/></svg>
              Compare with Asana
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#888] ml-1"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
            </button>
            <button className="flex items-center gap-2 bg-[#0d0d0f] border border-white/10 hover:bg-white/5 px-4 py-2 rounded-md transition-colors text-[0.85rem] text-[#f0f0f0]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF3D57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
              Compare with Monday
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#888] ml-1"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
            </button>
            <button className="flex items-center gap-2 bg-[#0d0d0f] border border-white/10 hover:bg-white/5 px-4 py-2 rounded-md transition-colors text-[0.85rem] text-[#f0f0f0]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7B68EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              Compare with Clickup
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#888] ml-1"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button (mock) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-12 h-12 bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur border border-white/[0.08] rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </button>
      </div>
    </div>
    </div>
  );
}
