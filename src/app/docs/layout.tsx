import { ReactNode } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

import { docSections } from '@/lib/docs-config';
import { generateSidebar } from '@/lib/docs-utils';
import { DocsSidebar } from './components/docs-sidebar';

import './docs.css';

export const metadata: Metadata = {
  title: 'LinAI Documentation',
  description: 'LinAI official documentation - Your Personal AI Agent Platform'
};

// Generate sidebar sections from the config
const sidebarSections = generateSidebar(docSections);

interface DocsLayoutProps {
  children: ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      {/* 背景装饰 */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none"></div>
      <div className="fixed top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

      {/* Mobile header */}
      <header className="md:hidden flex h-16 items-center gap-4 border-b border-border/30 bg-background/80 backdrop-blur-xl px-4 sticky top-0 z-50 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>

        <Link
          href={{ pathname: '/docs' }}
          className="flex items-center gap-3 font-bold text-base relative z-10"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary"></div>
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            LinAI Docs
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2 relative z-10">
          <label
            htmlFor="sidebar-mobile-toggle"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border/50 text-sm font-medium cursor-pointer hover:bg-gradient-to-r hover:from-accent/10 hover:to-accent/5 hover:border-primary/50 transition-all duration-300 shadow-lg"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </label>
        </div>
      </header>

      {/* Container for sidebar and main content */}
      <div className="docs-layout relative">
        {/* Mobile sidebar toggle */}
        <input
          type="checkbox"
          id="sidebar-mobile-toggle"
          className="docs-sidebar-toggle hidden"
        />

        {/* Backdrop overlay for mobile - appears when sidebar is open */}
        <label
          htmlFor="sidebar-mobile-toggle"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm hidden docs-sidebar-backdrop md:hidden"
          aria-hidden="true"
        />

        {/* Sidebar - fixed position on mobile, sticky on desktop */}
        <aside className="docs-sidebar fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-80 max-w-[85%] border-r border-border/30 bg-background/95 backdrop-blur-xl -translate-x-full md:z-30 md:w-72 md:translate-x-0 transition-transform duration-300 shadow-2xl md:shadow-none relative">
          {/* 侧边栏装饰 */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>

          <div className="flex md:hidden items-center justify-end p-4 border-b border-border/30 relative z-10">
            <label
              htmlFor="sidebar-mobile-toggle"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border/50 text-sm cursor-pointer hover:bg-gradient-to-r hover:from-accent/10 hover:to-accent/5 hover:border-primary/50 transition-all duration-300"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close Menu</span>
            </label>
          </div>
          <DocsSidebar sidebarSections={sidebarSections} />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden relative">
          <div className="container py-12 px-4 md:px-8 max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
