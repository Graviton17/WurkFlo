import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Linkedin, Github } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#0c0c0d] pt-20 pb-10">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image src="/favicon.ico" alt="WurkFlo Logo" width={32} height={32} className="rounded" />
              <span className="font-semibold text-lg tracking-tight text-white">WurkFlo</span>
            </Link>
            <p className="text-white/50 max-w-sm leading-relaxed mb-8">
              The modern platform for project documentation, issue tracking, and seamless team collaboration.
            </p>
            <div className="flex items-center gap-4 text-white/40">
              <Link href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#integrations" className="hover:text-white transition-colors">Integrations</Link></li>
              <li><Link href="#changelog" className="hover:text-white transition-colors">Changelog</Link></li>
              <li><Link href="#roadmap" className="hover:text-white transition-colors">Roadmap</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><Link href="#about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><Link href="#privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#security" className="hover:text-white transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-sm text-white/40">
          <p>© 2025 WurkFlo Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>Designed exactly like the template.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
