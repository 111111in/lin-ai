# LinAI - Your Personal AI Agent Platform

<div align="center">

![LinAI Logo](./public/linai-banner.png)

**一个现代化的 AI Agent 平台，支持多模型对比、对话历史管理和图像生成**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

[在线演示](https://your-demo-link.com) · [功能介绍](#-核心功能) · [快速开始](#-快速开始)

</div>

---

## 📖 项目简介

LinAI 是一个基于 Next.js 15 构建的现代化 AI Agent 平台。项目在开源项目 AgentDock 的基础上进行了深度改造，包括：

- 🎨 **全新的 UI 设计系统** - 现代化的渐变配色、悬停光效、玻璃态效果
- 📜 **对话历史管理** - 完整的历史记录、搜索、过滤、导出功能
- 🔄 **AI 模型对比** - 同时测试多个 AI 模型，对比响应质量
- 🖼️ **图像生成** - 基于 Gemini 的图像生成和编辑功能

---

## ✨ 核心功能

### 1. AI Agent 对话
- 🤖 多种预配置的 AI Agent（代码助手、架构专家等）
- 💬 流式响应，实时显示
- 🎯 支持多种 AI 模型（GPT-4, Claude, Gemini）
- 📝 Markdown 渲染支持

### 2. 对话历史管理 🆕
- 📊 查看所有历史对话
- 🔍 强大的搜索和过滤功能
- ⭐ 收藏重要对话
- 🏷️ 标签分类系统
- 💾 导出对话（JSON 格式）

### 3. AI 模型对比 🆕
- 🔄 同时向多个 AI 模型提问
- ⚡ 并行请求，实时对比
- 📊 显示响应时间和 token 使用
- 👍👎 投票选择最佳答案

### 4. 图像生成
- 🎨 基于 Gemini 的图像生成
- ✏️ 图像编辑和修改
- 📤 上传本地图像
- 🖼️ 图像历史画廊

---

## 🎨 设计特色

### 现代化 UI 设计
- **渐变色彩系统**：天蓝 → 清新绿 → 青绿
- **悬停光效**：所有可交互元素的光效扫描动画
- **玻璃态效果**：backdrop-blur + 半透明背景
- **流畅动画**：300-500ms 的过渡效果
- **响应式设计**：完美适配移动端

### 视觉元素
```
🌈 渐变文字标题
💫 悬停光效动画
🎯 统一的圆角设计
💎 多层次阴影系统
⚡ 流畅的过渡动画
```

---

## 🚀 快速开始

### 环境要求

- Node.js >= 20.11.0
- pnpm >= 9.15.0

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/yourusername/linai.git
cd linai
```

2. **安装依赖**
```bash
# 启用 pnpm
corepack enable
corepack prepare pnpm@latest --activate

# 安装依赖
pnpm install
```

3. **配置环境变量**
```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local，添加你的 API Keys
```

需要的 API Keys：
```env
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
```

4. **启动开发服务器**
```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

---

## 📦 技术栈

### 前端框架
- **Next.js 15** - React 框架，App Router
- **React 18** - UI 库
- **TypeScript** - 类型安全

### 样式
- **Tailwind CSS** - 原子化 CSS
- **Framer Motion** - 动画库
- **Radix UI** - 无障碍组件库

### AI 集成
- **Vercel AI SDK** - AI 集成工具
- **OpenAI API** - GPT 模型
- **Anthropic API** - Claude 模型
- **Google Gemini API** - Gemini 模型

### 状态管理
- **Zustand** - 轻量级状态管理
- **React Hooks** - 组件状态

### 工具
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Husky** - Git hooks

---

## 📂 项目结构

```
linai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── agents/            # Agent 列表和对话
│   │   ├── compare/           # 🆕 AI 模型对比
│   │   ├── history/           # 🆕 对话历史管理
│   │   ├── image-generation/  # 图像生成
│   │   ├── docs/              # 文档系统
│   │   └── settings/          # 设置页面
│   ├── components/            # React 组件
│   │   ├── layout/           # 布局组件
│   │   ├── ui/               # UI 基础组件
│   │   └── agents/           # Agent 相关组件
│   ├── lib/                   # 工具函数
│   │   ├── config.ts         # 配置文件
│   │   ├── branding.ts       # 品牌配置
│   │   └── utils.ts          # 工具函数
│   └── styles/
│       └── globals.css        # 全局样式
├── public/                    # 静态资源
├── docs/                      # 文档内容
└── package.json              # 项目配置
```

---

## 🎯 核心页面

| 页面 | 路径 | 功能 |
|------|------|------|
| 首页 | `/` | 项目介绍和导航 |
| Agent 列表 | `/agents` | 浏览和选择 AI Agent |
| 对话历史 | `/history` | 管理历史对话 |
| 模型对比 | `/compare` | 对比多个 AI 模型 |
| 图像生成 | `/image-generation` | 生成和编辑图像 |
| 文档 | `/docs` | 使用文档 |
| 设置 | `/settings` | 配置 API Keys |

---

## 🎨 UI 组件示例

### 渐变标题
```tsx
<h1 className="text-5xl font-black">
  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
    LinAI
  </span>
</h1>
```

### 悬停光效按钮
```tsx
<button className="relative overflow-hidden group">
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  <span className="relative z-10">点击我</span>
</button>
```

### 玻璃态卡片
```tsx
<div className="bg-card/50 backdrop-blur-xl border-2 border-border/30 rounded-3xl shadow-2xl">
  {/* 内容 */}
</div>
```

---

## 🔧 开发指南

### 添加新的 Agent

1. 在 `agents/` 目录创建配置文件
2. 定义 Agent 的系统提示词
3. 配置可用的工具
4. 在 `agent-tags.ts` 中注册

### 自定义主题

编辑 `src/app/globals.css` 中的 CSS 变量：

```css
:root {
  --primary: 200 90% 50%;      /* 天蓝色 */
  --secondary: 150 75% 45%;    /* 清新绿 */
  --accent: 165 80% 45%;       /* 青绿色 */
}
```

### 添加新功能

1. 在 `src/app/` 创建新路由
2. 在 `site-sidebar.tsx` 添加导航项
3. 遵循现有的设计系统

---

## 📊 性能优化

- ✅ Next.js 15 App Router（服务端渲染）
- ✅ 图片优化（next/image）
- ✅ 代码分割（动态导入）
- ✅ 字体优化（Geist Sans/Mono）
- ✅ CSS 优化（Tailwind CSS）

---

## 🚀 部署

### Vercel（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/linai)

1. 点击上方按钮
2. 连接 GitHub 仓库
3. 配置环境变量
4. 部署完成！

### 其他平台

- **Netlify**: 支持 Next.js
- **Railway**: 一键部署
- **AWS Amplify**: 企业级部署

---

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📝 更新日志

### v1.0.0 (2026-02-09)
- 🎨 全新的 UI 设计系统
- 📜 添加对话历史管理功能
- 🔄 添加 AI 模型对比功能
- 🖼️ 优化图像生成界面
- 📚 完善文档系统

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

基于 [AgentDock](https://github.com/AgentDock/AgentDock) 项目改造。

---

## 🙏 致谢

- [AgentDock](https://github.com/AgentDock/AgentDock) - 提供基础框架
- [Next.js](https://nextjs.org/) - React 框架
- [Vercel](https://vercel.com/) - 部署平台
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架

---

## 📞 联系方式

- **作者**: [你的名字]
- **Email**: [你的邮箱]
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **LinkedIn**: [你的 LinkedIn](https://linkedin.com/in/yourprofile)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给个 Star！**

Made with ❤️ by [你的名字]

</div>

