'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  ChevronDown,
  ChevronRight,
  FileText,
  GitCompare,
  History,
  Home,
  Image,
  LucideIcon,
  Settings
} from 'lucide-react';

import { useLanguage } from '@/components/providers/language-provider';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { AGENT_TAGS } from '@/config/agent-tags';
import { cn } from '@/lib/utils';
import { useSidebar } from './sidebar-context';

interface NavigationItemData {
  name: string;
  href: string;
  icon?: LucideIcon;
  children?: NavigationItemData[];
  autoCollapse?: boolean;
}

// Core navigation items (main platform features)
const coreNavigationItems: NavigationItemData[] = [
  {
    name: 'Home',
    href: '/',
    icon: Home
  },
  {
    name: 'Agents',
    href: '/agents',
    icon: Bot,
    children: [
      {
        name: '精选',
        href: '/agents'
      },
      {
        name: '全部智能体',
        href: '/agents/all'
      }
      // Main categories will be added here
    ]
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings
  },
  {
    name: 'Docs',
    href: '/docs',
    icon: FileText,
    autoCollapse: true
  }
];

// Populate only the main categories (from AGENT_TAGS)
AGENT_TAGS.sort((a, b) => a.order - b.order)
  .filter((tag) => tag.id !== 'featured') // Skip featured since we added it manually
  .forEach((tag) => {
    if (coreNavigationItems[1].children) {
      coreNavigationItems[1].children.push({
        // Use the tag id as the internal name so we can map it through i18n,
        // instead of hard-coding the display language here.
        name: tag.id,
        href: `/agents/${tag.id}`
      });
    }
  });

// Additional platform features
const additionalNavigationItems: NavigationItemData[] = [
  {
    name: 'Image Generation',
    href: '/image-generation',
    icon: Image
  },
  {
    name: 'AI Compare',
    href: '/compare',
    icon: GitCompare
  },
  {
    name: 'History',
    href: '/history',
    icon: History
  }
];

interface SiteSidebarProps {
  isCollapsed: boolean;
}

export function SiteSidebar({ isCollapsed }: SiteSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Agents']);
  const { setIsCollapsed } = useSidebar(); // Only need setIsCollapsed
  const { t } = useLanguage();

  const getLabel = (item: NavigationItemData): string => {
    switch (item.name) {
      case 'Home':
        return t('nav.home');
      case 'Agents':
        return t('nav.agents');
      case '精选':
        return t('nav.agents.featured');
      case '全部智能体':
        return t('nav.agents.all');
      case 'Settings':
        return t('nav.settings');
      case 'Docs':
        return t('nav.docs');
      case 'Image Generation':
        return t('nav.imageGeneration');
      case 'AI Compare':
        return t('nav.compare');
      case 'History':
        return t('nav.history');
      // Category items use their id as the name (e.g. "health", "legal", ...)
      case 'health':
        return t('nav.category.health');
      case 'legal':
        return t('nav.category.legal');
      case 'characters':
        return t('nav.category.characters');
      case 'productivity':
        return t('nav.category.productivity');
      case 'technical':
        return t('nav.category.technical');
      case 'research':
        return t('nav.category.research');
      case 'web3':
        return t('nav.category.web3');
      case 'codegen':
        return t('nav.category.codegen');
      case 'learning':
        return t('nav.category.learning');
      case 'marketing':
        return t('nav.category.marketing');
      default:
        return item.name;
    }
  };

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  // Simplified isActive check directly using pathname
  const isActive = (itemPath: string, itemName?: string): boolean => {
    // Special case for Featured
    if (itemName === 'Featured' && itemPath === '/agents') {
      return pathname === '/agents';
    }
    // Exact match
    if (pathname === itemPath) {
      return true;
    }
    // Child path match (handles /agents/category correctly)
    if (
      itemPath !== '/' &&
      pathname?.startsWith(itemPath + (itemPath.endsWith('/') ? '' : '/')) &&
      itemPath.length > 1
    ) {
      // Ensure it's not just a partial match for non-category paths
      if (!itemPath.startsWith('/agents/')) {
        const pathSegments = pathname.split('/');
        const itemSegments = itemPath.split('/');
        // Only active if the segment count matches or the next segment starts the child path
        return (
          pathSegments.length === itemSegments.length ||
          pathSegments.length > itemSegments.length
        );
      }
      return true;
    }
    // Handle /agents/all specifically
    if (itemPath === '/agents/all' && pathname === '/agents/all') {
      return true;
    }

    return false;
  };

  const renderItem = (item: NavigationItemData) => {
    const isItemActive = isActive(item.href, item.name);
    const isExpanded = expandedItems.includes(item.name);

    if (item.children) {
      // Parent Item Rendering with Wrapper Div
      return (
        <div
          key={item.name}
          className="group/sidebar-item"
        >
          {/* Wrapper Div handles background, rounding, and base layout */}
          <div
            className={cn(
              'flex w-full items-center rounded-xl transition-all duration-300 relative overflow-hidden',
              // Active State
              isItemActive
                ? 'bg-gradient-to-r from-primary/15 to-primary/10 text-primary shadow-lg shadow-primary/20 border border-primary/30'
                : 'text-muted-foreground hover:bg-gradient-to-r hover:from-accent/10 hover:to-accent/5 hover:text-foreground border border-transparent hover:border-accent/20',
              isCollapsed && 'justify-center px-2 py-2'
            )}
          >
            {/* 悬停光效 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover/sidebar-item:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover/sidebar-item:translate-x-[100%]"></div>

            {/* Link - No background/rounding, handles text/icon & navigation */}
            <Link
              href={{ pathname: item.href }}
              className={cn(
                'flex items-center gap-3 text-sm font-semibold relative z-10',
                isCollapsed ? 'flex-none' : 'flex-1 px-3 py-2.5'
              )}
              onClick={(e) => {
                if (isCollapsed) {
                  e.preventDefault();
                  setIsCollapsed(false);
                  setTimeout(() => toggleExpanded(item.name), 50);
                  return;
                }
                if (!isExpanded) {
                  toggleExpanded(item.name);
                }
                if (item.autoCollapse) {
                  setIsCollapsed(true);
                }
              }}
            >
              {item.icon && (
                <div
                  className={cn(
                    'p-1.5 rounded-lg transition-all duration-300',
                    isItemActive
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted/50 text-muted-foreground group-hover/sidebar-item:bg-accent/20 group-hover/sidebar-item:text-accent'
                  )}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                </div>
              )}
              {!isCollapsed && (
                <span className="truncate">{getLabel(item)}</span>
              )}
            </Link>

            {/* Toggle Button */}
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(item.name);
                }}
                className="h-auto px-2 py-2 opacity-60 hover:opacity-100 bg-transparent hover:bg-transparent relative z-10"
                aria-label={
                  isExpanded ? `Collapse ${item.name}` : `Expand ${item.name}`
                }
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          {/* Render children links */}
          {!isCollapsed && isExpanded && (
            <div className="mt-1.5 space-y-1 pl-6 border-l-2 border-primary/20 ml-6">
              {item.children.map(renderItem)}
            </div>
          )}
        </div>
      );
    }

    // Render simple link (no children)
    return (
      <Link
        key={item.name}
        href={{ pathname: item.href }}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-all duration-300 rounded-xl relative overflow-hidden group/link',
          !item.icon && !isCollapsed && 'pl-4',
          isCollapsed && 'w-full justify-center',
          isItemActive
            ? 'bg-gradient-to-r from-primary/15 to-primary/10 text-primary shadow-lg shadow-primary/20 border border-primary/30'
            : 'text-muted-foreground hover:bg-gradient-to-r hover:from-accent/10 hover:to-accent/5 hover:text-foreground border border-transparent hover:border-accent/20'
        )}
        onClick={() => {
          if (item.autoCollapse) {
            setIsCollapsed(true);
          }
        }}
      >
        {/* 悬停光效 */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover/link:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover/link:translate-x-[100%]"></div>

        {item.icon && (
          <div
            className={cn(
              'p-1.5 rounded-lg transition-all duration-300 relative z-10',
              isItemActive
                ? 'bg-primary/20 text-primary'
                : 'bg-muted/50 text-muted-foreground group-hover/link:bg-accent/20 group-hover/link:text-accent'
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
          </div>
        )}
        {!isCollapsed && (
          <span className="truncate relative z-10">{getLabel(item)}</span>
        )}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-border/30 bg-gradient-to-b from-background via-background to-background/95 backdrop-blur-xl transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[70px]' : 'w-[260px]',
        'hidden md:block'
      )}
    >
      {/* 侧边栏装饰光效 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>

      <div className="flex h-full flex-col relative z-10">
        {/* Logo 区域 */}
        <div className="flex h-16 items-center border-b border-border/30 px-4 justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
          <Logo showText={!isCollapsed} />
        </div>

        <div className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          <div className="space-y-6">
            {/* Core Platform Section */}
            <div>
              <h2
                className={cn(
                  'mb-3 px-4 text-[10px] font-bold uppercase tracking-widest',
                  'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent',
                  isCollapsed && 'text-center'
                )}
              >
                {!isCollapsed ? 'Core' : '●'}
              </h2>
              <nav className="flex flex-col gap-1 px-3">
                {coreNavigationItems.map(renderItem)}
              </nav>
            </div>

            {/* 分隔线 */}
            <div className="px-4">
              <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent"></div>
            </div>

            {/* Additional Features Section */}
            <div>
              <h2
                className={cn(
                  'mb-3 px-4 text-[10px] font-bold uppercase tracking-widest',
                  'bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent',
                  isCollapsed && 'text-center'
                )}
              >
                {!isCollapsed ? 'Features' : '●'}
              </h2>
              <nav className="flex flex-col gap-1 px-3">
                {additionalNavigationItems.map(renderItem)}
              </nav>
            </div>
          </div>
        </div>

        {/* 底部装饰 */}
        <div className="h-16 border-t border-border/30 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/5 to-transparent"></div>
          <div className="text-[10px] text-muted-foreground/50 font-medium">
            {!isCollapsed && 'LinAI'}
          </div>
        </div>
      </div>
    </aside>
  );
}
