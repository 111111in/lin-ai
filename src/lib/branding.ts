/**
 * LinAI - 品牌配置
 * 
 * 定义品牌相关的视觉元素，包括颜色、字体、Logo 等
 * 
 * @author LinAI Team
 * @version 1.0.0
 */

import { Bot } from 'lucide-react';

import { inter } from './fonts';

/**
 * 品牌配置对象
 * 包含了整个应用的视觉识别系统
 */
export const branding = {
  // 色彩系统 - 使用 HSL 格式以支持主题切换
  colors: {
    border: 'hsl(var(--border))',
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    primary: {
      DEFAULT: 'hsl(var(--primary))',
      foreground: 'hsl(var(--primary-foreground))'
    },
    secondary: {
      DEFAULT: 'hsl(var(--secondary))',
      foreground: 'hsl(var(--secondary-foreground))'
    },
    muted: {
      DEFAULT: 'hsl(var(--muted))',
      foreground: 'hsl(var(--muted-foreground))'
    },
    accent: {
      DEFAULT: 'hsl(var(--accent))',
      foreground: 'hsl(var(--accent-foreground))'
    },
    popover: {
      DEFAULT: 'hsl(var(--popover))',
      foreground: 'hsl(var(--popover-foreground))'
    },
    card: {
      DEFAULT: 'hsl(var(--card))',
      foreground: 'hsl(var(--card-foreground))'
    },
    // 自定义品牌色
    brand: {
      blue: 'hsl(var(--brand-blue))',
      blueForeground: 'hsl(var(--brand-blue-foreground))'
    }
  },

  // 字体系统
  fonts: {
    sans: inter.style.fontFamily
  },

  // Logo 配置
  logo: {
    icon: Bot,
    text: 'LinAI'
  }
};

/**
 * 导出品牌配置供其他组件使用
 */
export default branding;
