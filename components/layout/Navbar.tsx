'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

const productFeatures = [
  { title: 'Agile Planning', href: '/products/agile-planning', description: 'Sprint planning and backlog management.' },
  { title: 'Issue Tracking', href: '/products/issue-tracking', description: 'Capture, organize, and resolve bugs quickly.' },
  { title: 'DevOps Integrations', href: '/products/devops', description: 'Seamlessly connect your code to deployment.' },
];

const solutions = [
  { title: 'For Engineering Teams', href: '/solutions/engineering', description: 'Ship faster with technical alignment.' },
  { title: 'For Product Managers', href: '/solutions/product', description: 'Guide your product roadmap with precision.' },
];

const resources = [
  { title: 'Documentation', href: '/docs', description: 'Learn how to maximize your workflow.' },
  { title: 'Templates', href: '/templates', description: 'Jumpstart your projects with best practices.' },
  { title: 'Blog', href: '/blog', description: 'Read our latest thoughts and updates.' },
];

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-transparent/80 border-b border-white/5">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">

        {/* Left Side: Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white text-black rounded font-bold flex items-center justify-center">
            W
          </div>
          <span className="font-semibold text-lg tracking-tight">WurkFlo</span>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center">
          <NavigationMenu>
            <NavigationMenuList className="space-x-2">

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-white/5 text-white/70 hover:text-white">Product</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-black/90 border border-white/10 backdrop-blur-xl rounded-xl">
                    {productFeatures.map((component) => (
                      <li key={component.title}>
                        <NavigationMenuLink 
                          render={<Link href={component.href} />}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="text-sm font-medium leading-none text-white">{component.title}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-white/50">{component.description}</p>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-white/5 text-white/70 hover:text-white">Solutions</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4 bg-black/90 border border-white/10 backdrop-blur-xl rounded-xl">
                    {solutions.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink 
                          render={<Link href={item.href} />}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="text-sm font-medium leading-none text-white">{item.title}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-white/50">{item.description}</p>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-white/5 text-white/70 hover:text-white">Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4 bg-black/90 border border-white/10 backdrop-blur-xl rounded-xl">
                    {resources.map((res) => (
                      <li key={res.title}>
                        <NavigationMenuLink 
                          render={<Link href={res.href} />}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                        >
                          <div className="text-sm font-medium leading-none text-white">{res.title}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-white/50">{res.description}</p>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink 
                  render={<Link href="/company" />} 
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
          <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
            Log In
          </Link>
          <Link href="/signup">
            <Button className="bg-[#ff1f1f] hover:bg-[#ff1f1f]/90 text-white rounded-full px-6 font-medium border-0">
              Get Started
            </Button>
          </Link>
        </div>

      </div>
    </nav>
  );
};
