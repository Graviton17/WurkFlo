import { InteractiveSandbox } from '../sandbox/InteractiveSandbox';
import { Zap, Command, Layout } from 'lucide-react';

export function InteractiveSandboxSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#0c0c0d]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(79,70,229,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.05),transparent_50%)] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col gap-16 lg:gap-12 items-center max-w-[1280px] mx-auto w-full">

          <div className="text-center max-w-3xl mx-auto space-y-6 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-semibold w-fit border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)] mb-2">
              <Zap className="w-4 h-4" />
              <span className="tracking-wide">Experience Interactive UI</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Don't just read about it. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 animate-gradient-x">
                Feel it.
              </span>
            </h2>

            <p className="text-lg md:text-xl text-zinc-400 leading-relaxed font-medium mt-2 max-w-2xl mx-auto">
              Play around with our interactive components right here. Discover the blazing fast workflow that developers love.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto z-20">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-indigo-500/30 transition-colors group text-left">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-[#161618] flex items-center justify-center border border-zinc-700/50 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/5 transition-all shadow-sm">
                <Layout className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-base text-zinc-200 font-bold">1. Drag a card</p>
                <p className="text-sm text-zinc-500 leading-relaxed">Pick up a sprint card and move it across columns to see the satisfying, physics-based interactions.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-indigo-500/30 transition-colors group text-left">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-[#161618] flex items-center justify-center border border-zinc-700/50 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/5 transition-all shadow-sm">
                <Command className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-base text-zinc-200 font-bold flex items-center gap-2">
                  2. Press <kbd className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md text-sm font-mono border border-zinc-700 shadow-sm">Cmd+K</kbd>
                </p>
                <p className="text-sm text-zinc-500 leading-relaxed">Trigger the global command palette from anywhere. It's the fastest way to navigate and take action.</p>
              </div>
            </div>
          </div>

          <div className="h-[600px] md:h-[550px] w-full mt-4 lg:mt-0 flex items-center justify-center order-first lg:order-last">
            <InteractiveSandbox />
          </div>

        </div>
      </div>
    </section>
  );
}
