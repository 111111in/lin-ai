/**
 * AgentHeader component optimized for Server Components
 * Static parts remain as server components, while interactive parts are marked with "use client"
 */

import Link from 'next/link';
import { Plus, Search, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Compatible with both TagConfig and dynamically created category configs
export interface CategoryConfig {
  id: string;
  name: string;
  description?: string;
}

interface AgentHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryConfig?: CategoryConfig;
  onRemoveCategory?: () => void;
  isAllAgents?: boolean;
}

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export function AgentHeader({
  searchTerm,
  onSearchChange,
  categoryConfig,
  onRemoveCategory,
  isAllAgents = true
}: AgentHeaderProps) {
  return (
    <div className="relative">
      {/* 背景装饰 */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent rounded-full filter blur-3xl opacity-30 pointer-events-none"></div>

      <div className="relative flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between mb-12">
        {/* 左侧标题区域 */}
        <div className="space-y-4 sm:space-y-3 flex-1">
          <div className="flex items-center gap-4 flex-wrap">
            {/* 装饰性图标 */}
            <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-xl border border-primary/30 shadow-lg shadow-primary/20">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary animate-pulse-glow"></div>
            </div>

            <div className="flex-1">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none mb-2">
                <span className="inline-block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
                  AI Agents
                </span>
              </h1>

              {!isAllAgents && categoryConfig && onRemoveCategory && (
                <div className="inline-flex items-center gap-2 mt-3">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/50"></div>
                  <Badge
                    variant="secondary"
                    className="h-9 px-5 gap-2 text-sm font-bold bg-gradient-to-r from-secondary/20 to-secondary/10 hover:from-secondary/30 hover:to-secondary/20 transition-all group cursor-pointer rounded-full border border-secondary/40 shadow-lg shadow-secondary/20 backdrop-blur-sm text-white"
                    onClick={onRemoveCategory}
                  >
                    <span className="text-white">
                      {capitalizeFirstLetter(categoryConfig.name)}
                    </span>
                    <X
                      className="h-4 w-4 text-white/70 group-hover:text-white group-hover:rotate-90 transition-all duration-300"
                      aria-label="Remove category filter"
                    />
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-primary/50 to-transparent"></div>
            <p className="text-muted-foreground/90 text-base sm:text-lg font-medium">
              Discover powerful open source AI agents
            </p>
          </div>
        </div>

        {/* 右侧操作区域 */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="relative group sm:w-[320px]">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/70 group-focus-within:text-primary transition-colors duration-300 z-10" />
              <Input
                type="search"
                placeholder="Search agents..."
                className="pl-14 pr-5 h-14 w-full rounded-2xl border-2 border-border/50 focus:border-primary/50 bg-card/50 backdrop-blur-xl shadow-xl focus:shadow-2xl focus:shadow-primary/20 transition-all duration-300 font-medium text-base"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          <Link
            href="/docs/rfa/add-agent"
            passHref
          >
            <Button className="sm:w-[180px] h-14 rounded-2xl bg-gradient-to-r from-secondary via-secondary to-accent hover:from-secondary/90 hover:via-secondary/90 hover:to-accent/90 text-white font-bold shadow-xl hover:shadow-2xl hover:shadow-secondary/50 transition-all duration-300 border-0 text-base group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Add Agent</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 底部分隔线 */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-8"></div>
    </div>
  );
}
