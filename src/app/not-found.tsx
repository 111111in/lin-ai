/**
 * LinAI - 404 错误页面
 * 
 * 友好的错误提示和导航帮助
 * 
 * @author LinAI Team
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Bot,
  GitCompare,
  History,
  Home,
  Image,
  Search
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

/**
 * 热门页面链接
 */
const popularPages = [
  {
    name: 'AI Agents',
    href: ROUTES.AGENTS,
    icon: Bot,
    description: '与 AI Agent 对话',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Model Compare',
    href: ROUTES.COMPARE,
    icon: GitCompare,
    description: '对比 AI 模型',
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'History',
    href: ROUTES.HISTORY,
    icon: History,
    description: '查看对话历史',
    color: 'from-green-500 to-emerald-500'
  },
  {
    name: 'Image Generation',
    href: ROUTES.IMAGE_GEN,
    icon: Image,
    description: '生成 AI 图像',
    color: 'from-orange-500 to-red-500'
  }
];

/**
 * 404 错误页面组件
 */
export default function NotFound() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * 处理搜索
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // 这里可以实现真实的搜索功能
      router.push(`${ROUTES.AGENTS}?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* 404 数字 */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              {/* 发光效果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent blur-3xl opacity-30 animate-pulse"></div>
              
              {/* 404 文字 */}
              <h1 className="relative text-[150px] sm:text-[200px] md:text-[250px] font-black leading-none">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  404
                </span>
              </h1>
            </div>
          </div>

          {/* 错误信息 */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Oops! Page Not Found
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              看起来你迷路了。这个页面可能已经被移动或删除了。
              <br />
              不过别担心，让我们帮你找到正确的方向！
            </p>
          </div>

          {/* 搜索框 */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl blur-lg opacity-60"></div>
              
              <div className="relative flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                  <Input
                    type="search"
                    placeholder="搜索页面或功能..."
                    className="pl-12 h-14 rounded-2xl border-2 border-border/50 focus:border-primary/50 bg-card/50 backdrop-blur-xl shadow-lg text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 font-bold shadow-xl"
                >
                  搜索
                </Button>
              </div>
            </form>
          </div>

          {/* 快速返回按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={() => router.push(ROUTES.HOME)}
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 font-bold text-base shadow-xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
              <Home className="mr-2 h-5 w-5 relative z-10" />
              <span className="relative z-10">返回首页</span>
            </Button>

            <Button
              onClick={() => router.back()}
              variant="outline"
              className="h-14 px-8 rounded-2xl border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 font-bold text-base shadow-lg relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
              <ArrowLeft className="mr-2 h-5 w-5 relative z-10" />
              <span className="relative z-10">返回上一页</span>
            </Button>
          </div>

          {/* 热门页面 */}
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                或者访问这些热门页面
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularPages.map((page, index) => (
                <Link
                  key={index}
                  href={page.href}
                  className="group relative rounded-2xl border-2 border-border/30 bg-card/50 hover:border-primary/50 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 overflow-hidden"
                >
                  {/* 悬停光效 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>

                  <div className="relative">
                    {/* 图标 */}
                    <div className={cn(
                      'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform',
                      page.color
                    )}>
                      <page.icon className="w-6 h-6 text-white" />
                    </div>

                    {/* 标题 */}
                    <h4 className="font-bold mb-2 group-hover:text-primary transition-colors">
                      {page.name}
                    </h4>

                    {/* 描述 */}
                    <p className="text-sm text-muted-foreground">
                      {page.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 帮助提示 */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">
              如果你认为这是一个错误，请{' '}
      <Link
                href={ROUTES.SETTINGS}
                className="text-primary hover:underline font-semibold"
      >
                联系我们
      </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

