/**
 * LinAI Logo 组件
 *
 * 自定义设计的 Logo，融合 AI 和个人品牌元素
 *
 * @author LinAI Team
 * @version 1.0.0
 */

'use client';

import React from 'react';
import Link from 'next/link';

import { branding } from '@/lib/branding';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  showText?: boolean;
};

/**
 * LinAI Logo 组件
 *
 * 设计理念：
 * - L 字母与 AI 芯片的结合
 * - 渐变色彩体现科技感
 * - 悬停动画增加互动性
 */
export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn('flex items-center gap-3 group', className)}
    >
      {/* Logo 图标 */}
      <div className="relative">
        {/* 发光背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Logo SVG */}
        <svg
          className="h-8 w-8 relative z-10 transition-transform duration-300 group-hover:scale-110"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 外圈 - 代表 AI 芯片 */}
          <rect
            x="2"
            y="2"
            width="28"
            height="28"
            rx="6"
            className="stroke-primary transition-all duration-300 group-hover:stroke-secondary"
            strokeWidth="2"
            fill="none"
          />

          {/* 内部连接线 - 科技感 */}
          <path
            d="M8 8 L12 12 M20 8 L16 12 M8 24 L12 20 M20 24 L16 20"
            className="stroke-secondary/50 transition-all duration-300 group-hover:stroke-accent"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* L 字母主体 */}
          <path
            d="M10 10 L10 22 L18 22"
            className="stroke-primary transition-all duration-300 group-hover:stroke-secondary"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* AI 点 - 代表智能 */}
          <circle
            cx="22"
            cy="12"
            r="2"
            className="fill-accent transition-all duration-300 group-hover:fill-primary animate-pulse"
          />
          <circle
            cx="22"
            cy="20"
            r="2"
            className="fill-secondary transition-all duration-300 group-hover:fill-accent animate-pulse"
            style={{ animationDelay: '0.5s' }}
          />

          {/* 中心装饰点 */}
          <circle
            cx="14"
            cy="16"
            r="1.5"
            className="fill-primary/50 transition-all duration-300 group-hover:fill-accent"
          />
        </svg>
      </div>

      {/* Logo 文字 */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-black text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent transition-all duration-300 group-hover:from-secondary group-hover:via-accent group-hover:to-primary">
            {branding.logo.text}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium mt-0.5 tracking-wider">
            AI PLATFORM
          </span>
        </div>
      )}
    </Link>
  );
}
