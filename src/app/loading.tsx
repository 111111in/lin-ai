/**
 * LinAI - 全局加载组件
 * 
 * 精美的加载动画，展示品牌特色
 * 
 * @author LinAI Team
 * @version 1.0.0
 */

'use client';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* 加载内容 */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* LinAI Logo 动画 */}
        <div className="relative">
          {/* 外圈旋转光环 */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="w-32 h-32 rounded-full border-4 border-transparent border-t-primary border-r-secondary"></div>
          </div>
          
          {/* 中圈反向旋转 */}
          <div className="absolute inset-2 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
            <div className="w-28 h-28 rounded-full border-4 border-transparent border-b-secondary border-l-accent"></div>
          </div>

          {/* Logo 中心 */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* 发光背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 rounded-2xl blur-xl animate-pulse"></div>
            
            {/* Logo SVG */}
            <svg
              className="w-16 h-16 relative z-10"
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
                className="stroke-primary animate-pulse"
                strokeWidth="2"
                fill="none"
              />
              
              {/* 内部连接线 - 科技感 */}
              <path
                d="M8 8 L12 12 M20 8 L16 12 M8 24 L12 20 M20 24 L16 20"
                className="stroke-secondary/50"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              
              {/* L 字母主体 */}
              <path
                d="M10 10 L10 22 L18 22"
                className="stroke-primary"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* AI 点 - 代表智能 */}
              <circle
                cx="22"
                cy="12"
                r="2"
                className="fill-accent animate-pulse"
              />
              <circle
                cx="22"
                cy="20"
                r="2"
                className="fill-secondary animate-pulse"
                style={{ animationDelay: '0.5s' }}
              />
              
              {/* 中心装饰点 */}
              <circle
                cx="14"
                cy="16"
                r="1.5"
                className="fill-primary/50 animate-pulse"
                style={{ animationDelay: '0.25s' }}
              />
            </svg>
          </div>
      </div>

        {/* 品牌名称 */}
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-4xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
            LinAI
          </h2>
          <p className="text-sm text-muted-foreground font-medium animate-pulse">
            Loading your AI experience...
          </p>
        </div>

        {/* 进度条 */}
        <div className="w-64 h-1.5 bg-muted/30 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full animate-loading-bar"></div>
        </div>

        {/* 加载点动画 */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
