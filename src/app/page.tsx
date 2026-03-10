/**
 * LinAI - 欢迎首页
 *
 * 展示项目特色、核心功能和快速入口
 *
 * @author LinAI Team
 * @version 1.0.0
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Bot,
  GitCompare,
  History,
  Image,
  Sparkles,
  Zap
} from 'lucide-react';

import { useLanguage } from '@/components/providers/language-provider';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

/**
 * 功能卡片数据
 */
const features = [
  {
    icon: Bot,
    title: '智能体广场',
    description: '与多种预配置的 AI 智能体对话，获得专业的帮助和建议',
    href: ROUTES.AGENTS,
    color: 'from-blue-500 to-cyan-500',
    gradient: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    icon: GitCompare,
    title: '模型对比',
    description: '同时测试多个 AI 模型，对比响应质量和速度',
    href: ROUTES.COMPARE,
    color: 'from-purple-500 to-pink-500',
    gradient: 'from-purple-500/20 to-pink-500/20'
  },
  {
    icon: History,
    title: '历史管理',
    description: '管理所有对话历史，支持搜索、过滤和导出',
    href: ROUTES.HISTORY,
    color: 'from-green-500 to-emerald-500',
    gradient: 'from-green-500/20 to-emerald-500/20'
  },
  {
    icon: Image,
    title: '图像生成',
    description: '使用 AI 生成和编辑图像，释放创造力',
    href: ROUTES.IMAGE_GEN,
    color: 'from-orange-500 to-red-500',
    gradient: 'from-orange-500/20 to-red-500/20'
  }
];

/**
 * 特色亮点
 */
const highlights = [
  {
    icon: Sparkles,
    title: '现代化 UI',
    description: '精心设计的渐变配色和流畅动画'
  },
  {
    icon: Zap,
    title: '多模型支持',
    description: '支持 GPT-4、Claude、Gemini 等主流模型'
  },
  {
    icon: Bot,
    title: '智能管理',
    description: '完整的对话历史和数据管理系统'
  }
];

/**
 * 统计数据
 */
const stats = [
  { label: 'AI 模型', value: '4+' },
  { label: '功能模块', value: '8+' },
  { label: '预置智能体', value: '20+' }
];

/**
 * 欢迎首页组件
 */
export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: '1s' }}
      ></div>

      <div className="relative z-10">
        {/* Hero 区域 */}
        <section className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="max-w-5xl mx-auto text-center">
            {/* Logo 动画 */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-xl border-2 border-primary/30 flex items-center justify-center shadow-2xl">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary animate-pulse-glow"></div>
                </div>
              </div>
            </div>

            {/* 主标题 */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6 md:mb-8">
              <span className="inline-block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
                {t('home.hero.title')}
              </span>
            </h1>

            {/* 副标题 */}
            <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground/90 font-medium mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('home.hero.subtitle.main')}
              <br />
              <span className="text-lg sm:text-xl text-muted-foreground/70">
                {t('home.hero.subtitle.sub')}
              </span>
            </p>

            {/* CTA 按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                onClick={() => router.push(ROUTES.AGENTS)}
                className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 font-bold text-base shadow-2xl shadow-primary/30 relative overflow-hidden group w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                <Sparkles className="mr-2 h-5 w-5 relative z-10" />
                <span className="relative z-10">
                  {t('home.hero.cta.primary')}
                </span>
                <ArrowRight className="ml-2 h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                className="h-14 px-8 rounded-2xl border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 font-bold text-base shadow-lg relative overflow-hidden group w-full sm:w-auto"
                asChild
              >
                <Link href="/docs">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                  <span className="relative z-10">
                    {t('home.hero.cta.secondary')}
                  </span>
                </Link>
              </Button>
            </div>

            {/* 统计数据 */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label === 'AI Models'
                      ? t('home.stats.models')
                      : stat.label === 'Features'
                        ? t('home.stats.features')
                        : stat.label === 'Agents'
                          ? t('home.stats.agents')
                          : stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 功能卡片区域 */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            {/* 区域标题 */}
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  {t('home.features.title')}
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                探索 LinAI 的强大功能，提升你的 AI 工作流程
              </p>
            </div>

            {/* 功能卡片网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <Link
                  key={index}
                  href={feature.href}
                  className="group relative rounded-3xl border-2 border-border/30 bg-card/50 hover:border-primary/50 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 overflow-hidden"
                >
                  {/* 背景渐变 */}
                  <div
                    className={cn(
                      'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                      feature.gradient
                    )}
                  ></div>

                  {/* 悬停光效 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>

                  <div className="relative p-8">
                    {/* 图标 */}
                    <div
                      className={cn(
                        'w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300',
                        feature.color
                      )}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* 标题 */}
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>

                    {/* 描述 */}
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {feature.description}
                    </p>

                    {/* 箭头 */}
                    <div className="flex items-center text-primary font-semibold">
                      <span className="mr-2">了解更多</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 特色亮点区域 */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            {/* 区域标题 */}
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Why Choose LinAI?
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                现代化的设计，强大的功能，完美的用户体验
              </p>
            </div>

            {/* 亮点网格 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="relative rounded-2xl border-2 border-border/30 bg-card/50 backdrop-blur-xl p-8 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300 group"
                >
                  {/* 顶部装饰线 */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  {/* 图标 */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <highlight.icon className="w-7 h-7 text-primary" />
                  </div>

                  {/* 标题 */}
                  <h3 className="text-xl font-bold mb-3">{highlight.title}</h3>

                  {/* 描述 */}
                  <p className="text-muted-foreground leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA 区域 */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl border-2 border-border/30 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 backdrop-blur-xl p-12 md:p-16 text-center shadow-2xl overflow-hidden">
              {/* 背景装饰 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Ready to Get Started?
                  </span>
                </h2>

                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  开始使用 LinAI，体验下一代 AI Agent 平台
                </p>

                <Button
                  onClick={() => router.push(ROUTES.AGENTS)}
                  className="h-16 px-10 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 font-bold text-lg shadow-2xl shadow-primary/30 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                  <Sparkles className="mr-3 h-6 w-6 relative z-10" />
                  <span className="relative z-10">Start Your Journey</span>
                  <ArrowRight className="ml-3 h-6 w-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 页脚 */}
        <footer className="container mx-auto px-4 py-8 border-t border-border/30">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2026 LinAI. Built with ❤️ using Next.js</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
