/**
 * LinAI - 全局样式配置
 *
 * 这个文件定义了整个应用的设计系统，包括：
 * - 色彩变量（亮色/暗色主题）
 * - 自定义动画
 * - 工具类
 *
 * @author LinAI Team
 * @version 1.0.0
 */

export const designTokens = {
  // 色彩系统
  colors: {
    primary: {
      light: 'hsl(200, 90%, 50%)',
      dark: 'hsl(180, 100%, 50%)',
      rgb: '59, 130, 246'
    },
    secondary: {
      light: 'hsl(150, 75%, 45%)',
      dark: 'hsl(280, 100%, 50%)',
      rgb: '34, 197, 94'
    },
    accent: {
      light: 'hsl(165, 80%, 45%)',
      dark: 'hsl(330, 100%, 55%)',
      rgb: '20, 184, 166'
    }
  },

  // 动画时长
  animations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms'
  },

  // 圆角
  radius: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },

  // 阴影
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.05)',
    md: '0 4px 16px rgba(0, 0, 0, 0.1)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.15)',
    glow: '0 0 20px rgba(var(--primary-rgb), 0.3)'
  }
};

// 导出设计令牌供其他组件使用
export default designTokens;
