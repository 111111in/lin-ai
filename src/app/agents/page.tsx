/**
 * @fileoverview AI Agents page with modern card layout and settings management
 * Implemented as a Server Component for optimal performance with skeleton-based loading
 */

import { Suspense } from 'react';

// Import with a dynamic import to ensure it's a client component
import ClientWrapper from '@/app/agents/client-wrapper';
import { AgentLoading } from '@/components/agents/AgentLoading';
import { templates } from '@/generated/templates';
import type { AgentTemplate } from '@/lib/store/types';

export default function AgentsPage() {
  // This is now a server component - we can fetch data directly
  const allTemplates = Object.values(templates) as unknown as AgentTemplate[];

  // Filter featured agents on the server
  const featuredTemplates = allTemplates.filter(
    (template) => template.tags?.includes('featured') || false
  );

  return (
    // Suspense boundary uses the existing AgentLoading component
    <Suspense fallback={<AgentLoading />}>
      <div className="relative min-h-screen overflow-hidden">
        {/* CHIRP 风格动态背景 */}
        <div className="fixed inset-0 -z-10">
          {/* 主渐变背景 */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/10 to-secondary/10"></div>
          
          {/* 动态渐变光斑 - CHIRP 风格 */}
          <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-gradient-to-br from-primary/30 via-primary/20 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-float"></div>
          <div className="absolute top-1/3 -right-40 w-[700px] h-[700px] bg-gradient-to-br from-secondary/30 via-secondary/20 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-float" style={{ animationDelay: '2s', animationDuration: '7s' }}></div>
          <div className="absolute bottom-0 left-1/4 w-[750px] h-[750px] bg-gradient-to-br from-accent/30 via-accent/20 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-float" style={{ animationDelay: '4s', animationDuration: '6s' }}></div>
          
          {/* 细微网格背景 */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          {/* 顶部和底部渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
          
          {/* 装饰性光线 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-40 bg-gradient-to-b from-primary/50 to-transparent"></div>
          <div className="absolute bottom-0 left-1/3 w-[1px] h-32 bg-gradient-to-t from-secondary/50 to-transparent"></div>
          <div className="absolute bottom-0 right-1/3 w-[1px] h-32 bg-gradient-to-t from-accent/50 to-transparent"></div>
        </div>

        {/* 主内容区域 */}
        <div className="container relative">
          {/* 顶部装饰 */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          
          <div className="py-12 space-y-12 md:py-16 md:space-y-16">
            {/* Client components for interactive parts */}
            <ClientWrapper
              templates={featuredTemplates}
              initialCategory="featured"
            />
          </div>
          
          {/* 底部装饰 */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent"></div>
        </div>
      </div>
    </Suspense>
  );
}
