'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { SidebarSection } from '@/lib/docs-utils';
import { DocSearch } from './doc-search';
import { closeMobileSidebar } from './mobile-sidebar-utils';

interface DocsSidebarProps {
  sidebarSections: SidebarSection[];
}

export function DocsSidebar({ sidebarSections }: DocsSidebarProps) {
  const pathname = usePathname();
  const isMainDocsPage = pathname === '/docs' || pathname === '/docs/';
  const initialized = useRef(false);

  // Check if a link should be considered active
  const isLinkActive = useCallback(
    (linkHref: string): boolean => {
      // Special case for the Introduction link which maps to the main docs page
      if (isMainDocsPage && linkHref === '/docs/') {
        return true;
      }

      // Normalize paths for comparison
      const normalizedHref = linkHref.endsWith('/')
        ? linkHref.slice(0, -1)
        : linkHref;
      const normalizedPathname = pathname?.endsWith('/')
        ? pathname?.slice(0, -1)
        : pathname;

      return normalizedPathname === normalizedHref;
    },
    [isMainDocsPage, pathname]
  );

  // Calculate which section contains the active link
  const activeSectionTitle = useMemo(() => {
    if (isMainDocsPage) return 'Overview';

    for (const section of sidebarSections) {
      if (section.items.some((item) => isLinkActive(item.href))) {
        return section.title;
      }
    }

    return null;
  }, [sidebarSections, isMainDocsPage, isLinkActive]);

  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});

  // Initialize expanded state ONLY ONCE on mount
  useEffect(() => {
    if (!initialized.current) {
      const initialState: { [key: string]: boolean } = {};

      // Always expand Overview section
      initialState['Overview'] = true;

      // Expand the section containing the active page
      if (activeSectionTitle && activeSectionTitle !== 'Overview') {
        initialState[activeSectionTitle] = true;
      }

      setExpandedSections(initialState);
      initialized.current = true;
    }
  }, [activeSectionTitle]);

  // Toggle section expansion
  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  // Handle link click
  const handleLinkClick = () => {
    // Only close on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      closeMobileSidebar();
    }
  };

  return (
    <div className="py-8 w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
      <div className="px-6 space-y-6">
        {/* 标题区域 */}
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent rounded-2xl blur-xl opacity-50"></div>
          <div className="relative">
            <h2 className="text-2xl font-black tracking-tight mb-1">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                文档中心
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-gradient-to-r from-primary/50 to-transparent"></div>
              <p className="text-xs text-muted-foreground/80 font-medium">
                LinAI 核心
              </p>
            </div>
          </div>
        </div>

        {/* 搜索框 */}
        <div className="mb-4">
          <DocSearch />
        </div>

        {/* 分隔线 */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent"></div>

        {/* 导航区域 */}
        <nav className="space-y-4">
          {sidebarSections.map((section) => (
            <div
              key={section.title}
              className="space-y-2"
            >
              {/* 分类标题按钮 */}
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full py-2 px-3 text-left rounded-xl transition-all duration-300 group hover:bg-gradient-to-r hover:from-accent/10 hover:to-accent/5 border border-transparent hover:border-accent/20 relative overflow-hidden"
                aria-expanded={expandedSections[section.title]}
              >
                {/* 悬停光效 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>

                <span className="font-bold text-[11px] uppercase tracking-widest bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent relative z-10">
                  {section.title}
                </span>
                <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-muted/50 group-hover:bg-accent/20 transition-all duration-300 relative z-10">
                  {expandedSections[section.title] ? (
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
                  )}
                </span>
              </button>

              {/* 子项列表 */}
              {expandedSections[section.title] && (
                <div className="mt-2 space-y-1 pl-3 border-l-2 border-primary/20">
                  {section.items.map((item) => {
                    // For the Introduction link, check if we're on the main docs page
                    const isActive =
                      item.title === 'Introduction' && isMainDocsPage
                        ? true
                        : isLinkActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href as any}
                        onClick={handleLinkClick}
                        className={`block text-sm py-2.5 px-4 rounded-xl transition-all duration-300 relative overflow-hidden group/link ${
                          isActive
                            ? 'bg-gradient-to-r from-primary/15 to-primary/10 text-primary font-bold shadow-lg shadow-primary/20 border border-primary/30'
                            : 'text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-accent/10 hover:to-accent/5 border border-transparent hover:border-accent/20 font-medium'
                        }`}
                      >
                        {/* 悬停光效 */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover/link:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover/link:translate-x-[100%]"></div>

                        <span className="relative z-10">{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
