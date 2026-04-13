"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { User, LogOut, Settings } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const productFeatures = [
  {
    title: "Agile Planning",
    href: "/products/agile-planning",
    description: "Sprint planning and backlog management.",
  },
  {
    title: "Issue Tracking",
    href: "/products/issue-tracking",
    description: "Capture, organize, and resolve bugs quickly.",
  },
  {
    title: "DevOps Integrations",
    href: "/products/devops",
    description: "Seamlessly connect your code to deployment.",
  },
];

const solutions = [
  {
    title: "For Engineering Teams",
    href: "/solutions/engineering",
    description: "Ship faster with technical alignment.",
  },
  {
    title: "For Product Managers",
    href: "/solutions/product",
    description: "Guide your product roadmap with precision.",
  },
];

const resources = [
  {
    title: "Documentation",
    href: "/docs",
    description: "Learn how to maximize your workflow.",
  },
  {
    title: "Templates",
    href: "/templates",
    description: "Jumpstart your projects with best practices.",
  },
  {
    title: "Blog",
    href: "/blog",
    description: "Read our latest thoughts and updates.",
  },
];

export const Navbar = ({ initialUser }: { initialUser?: any }) => {
  const [user, setUser] = useState<any>(initialUser || null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-transparent/80 border-b border-white/5">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left Side: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/favicon.ico"
            alt="WurkFlo Logo"
            width={32}
            height={32}
            className="rounded"
          />
          <span className="font-semibold text-lg tracking-tight">WurkFlo</span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center">
          <NavigationMenu>
            <NavigationMenuList className="space-x-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-white/5 text-white/70 hover:text-white">
                  Product
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-black/90 border border-white/10 backdrop-blur-xl rounded-xl">
                    {productFeatures.map((component) => (
                      <li key={component.title}>
                        <NavigationMenuLink
                          render={<Link href={component.href} />}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="text-sm font-medium leading-none text-white">
                            {component.title}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-white/50">
                            {component.description}
                          </p>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-white/5 text-white/70 hover:text-white">
                  Solutions
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4 bg-black/90 border border-white/10 backdrop-blur-xl rounded-xl">
                    {solutions.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink
                          render={<Link href={item.href} />}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="text-sm font-medium leading-none text-white">
                            {item.title}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-white/50">
                            {item.description}
                          </p>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-white/5 text-white/70 hover:text-white">
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4 bg-black/90 border border-white/10 backdrop-blur-xl rounded-xl">
                    {resources.map((res) => (
                      <li key={res.title}>
                        <NavigationMenuLink
                          render={<Link href={res.href} />}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="text-sm font-medium leading-none text-white">
                            {res.title}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-white/50">
                            {res.description}
                          </p>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<Link href="/" />}
                  className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-white/5 text-white/70 hover:text-white`}
                >
                  Company
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10 focus:outline-none"
                >
                  <User size={20} className="text-white/70" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/90 border border-white/10 backdrop-blur-xl rounded-xl shadow-xl overflow-hidden py-1 z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-medium text-white truncate">
                        {user.email || "User"}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          router.push("/onboarding");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                      >
                        <Settings size={16} />
                        Dashboard
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-white/10 transition-colors flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#ff1f1f] hover:bg-[#ff1f1f]/90 text-white rounded-full px-6 font-medium border-0">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
        </div>
      </div>
    </nav>
  );
};
