import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-transparent/80 border-b border-white/5">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 bg-white text-black rounded font-bold flex items-center justify-center">
            W
          </div>
          <span className="font-semibold text-lg tracking-tight">WurkFlo</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <Link href="#about" className="hover:text-white transition-colors">About Us</Link>
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#contact" className="hover:text-white transition-colors">Contact Us</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/signin" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
            Sign In
          </Link>
          <Button variant="default" className="bg-[#ff1f1f] hover:bg-[#ff1f1f]/90 text-white rounded-full px-6">
            Join Waitlist
          </Button>
        </div>
      </div>
    </nav>
  );
};
