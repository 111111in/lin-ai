<div align="center">
  <img src="./public/linai-logo.svg" alt="LinAI Logo" width="120" height="120" />
  <h1>LinAI</h1>
  <p><strong>您的个人 AI Agent 平台</strong></p>
  <p>轻松构建、部署和扩展 AI 智能体</p>
</div>

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)](https://tailwindcss.com/)

</div>

---

## 🌟 项目简介

**LinAI** 是一个现代化的全栈 AI Agent 平台，采用最新技术栈构建。它提供了一个美观、直观的界面，用于与多个 AI 模型交互、管理对话历史、对比模型响应以及生成图像。

### 项目亮点

- 🎨 **现代化 UI/UX 设计** - 基于渐变色的设计系统，流畅的动画效果
- 🤖 **多模型支持** - 支持 GPT-4、Claude、Gemini 等主流模型
- 📊 **高级功能** - 历史管理、模型对比、图像生成
- 🛠️ **清晰架构** - 自定义 Hooks、工具函数和设计令牌
- 📱 **响应式设计** - 适配所有设备尺寸

基于 AgentDock 框架构建，LinAI 展示了如何创建一个注重用户体验和代码质量的生产级 AI 应用。

---

## ✨ 核心功能

### 🎯 主要特性

- **🤖 AI 智能体** - 与 20+ 个预配置的 AI Agent 交互，完成各种任务
- **💬 智能对话** - 实时流式响应，支持 Markdown 格式
- **📊 模型对比** - 并排对比多个 AI 模型的响应结果
- **📜 历史管理** - 完整的对话历史，支持搜索、筛选和导出
- **🖼️ 图像生成** - AI 驱动的图像创建和编辑功能
- **📚 文档系统** - 完善的文档，带搜索功能

### 🎨 设计亮点

- **现代渐变 UI** - 青色-紫色-粉色的精美渐变配色
- **流畅动画** - 精心设计的过渡效果和微交互
- **玻璃态效果** - 背景模糊效果，增加深度和优雅感
- **响应式设计** - 针对桌面、平板和移动端优化
- **深色/浅色模式** - 无缝主题切换，平滑过渡
- **自定义 Logo** - 独特的 LinAI 品牌标识，带动画效果

### 🛠️ 技术亮点

- **Next.js 15** - 最新的 App Router 和 Server Components
- **TypeScript** - 全代码库类型安全
- **Tailwind CSS** - 自定义设计系统和设计令牌
- **Zustand** - 轻量级状态管理
- **Vercel AI SDK** - 流式 AI 响应
- **自定义 Hooks** - 8+ 个可复用的 React Hooks
- **工具库** - 800+ 行自定义工具函数

---

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 pnpm
- AI 服务商的 API 密钥（OpenAI、Anthropic 等）

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/yourusername/linai.git
cd linai

# 安装依赖
npm install
# 或
pnpm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的 API 密钥

# 启动开发服务器
npm run dev
# 或
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 环境变量配置

```env
# 必需
OPENAI_API_KEY=你的_openai_密钥
ANTHROPIC_API_KEY=你的_anthropic_密钥

# 可选
GOOGLE_GENERATIVE_AI_API_KEY=你的_gemini_密钥
DEEPSEEK_API_KEY=你的_deepseek_密钥
GROQ_API_KEY=你的_groq_密钥
```

---

## 📁 项目结构

```
linai/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── agents/            # AI Agents 页面
│   │   ├── compare/           # 模型对比工具
│   │   ├── history/           # 对话历史
│   │   ├── image-generation/  # 图像生成
│   │   ├── docs/              # 文档系统
│   │   └── page.tsx           # 欢迎页面
│   ├── components/            # React 组件
│   │   ├── agents/           # Agent 相关组件
│   │   ├── chat/             # 聊天界面
│   │   ├── layout/           # 布局组件
│   │   └── ui/               # UI 基础组件
│   ├── lib/                   # 工具函数和辅助函数
│   │   ├── hooks/            # 自定义 React Hooks
│   │   ├── utils/            # 工具函数
│   │   ├── constants.ts      # 应用常量
│   │   └── design-tokens.ts  # 设计系统令牌
│   └── styles/               # 全局样式
├── public/                    # 静态资源
├── docs/                      # 文档文件
└── agents/                    # Agent 配置
```

---

## 🎨 设计系统

### 配色方案

```css
/* 主色调 */
--primary: 200 90% 50%;    /* 青色 */
--secondary: 150 75% 45%;  /* 绿色 */
--accent: 165 80% 45%;     /* 青绿色 */

/* 渐变色 */
from-primary via-secondary to-accent
from-blue-500 to-cyan-500
from-purple-500 to-pink-500
```

### 字体排版

- **标题**: Inter (Bold/Black)
- **正文**: Inter (Regular/Medium)
- **代码**: Geist Mono

### 间距与尺寸

- **圆角**: 0.5rem - 2rem (8px - 32px)
- **阴影**: 多层阴影增加深度
- **动画**: 150ms - 500ms 过渡时间

---

## 🔧 技术栈

### 前端
- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript 5.0
- **样式**: Tailwind CSS 3.0
- **UI 组件**: Radix UI + 自定义组件
- **状态管理**: Zustand
- **动画**: CSS 动画 + Framer Motion

### 后端
- **API 路由**: Next.js API routes
- **AI 集成**: Vercel AI SDK
- **存储**: Local Storage + IndexedDB

### 开发工具
- **包管理器**: pnpm
- **代码检查**: ESLint
- **代码格式化**: Prettier
- **类型检查**: TypeScript 严格模式

---

## 📸 功能截图

### 欢迎页面
精美的着陆页，展示功能特性和快速导航。

### AI 智能体
与 20+ 个专业 AI Agent 交互，完成不同任务。

### 模型对比
并排对比多个 AI 模型的响应结果。

### 历史管理
完整的对话历史，支持搜索和筛选功能。

---

## 🎯 功能详解

### 1. AI 智能体
预配置的专业 Agent，适用于：
- 代码审查和调试
- 内容写作和编辑
- 研究和分析
- 创意头脑风暴
- 更多场景...

### 2. 模型对比
- 向多个模型发送相同提示
- 对比响应质量和速度
- 为最佳答案投票
- 实时流式响应

### 3. 历史管理
- 自动保存所有对话
- 按内容或日期搜索
- 按 Agent 或模型筛选
- 导出对话记录
- 删除或归档旧对话

### 4. 图像生成
- 文本生成图像
- 图像编辑和增强
- 多种风格选项
- 画廊视图和历史记录

---

## 🚀 部署指南

### Vercel（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### Docker

```bash
# 构建镜像
docker build -t linai .

# 运行容器
docker run -p 3000:3000 linai
```

### 手动部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

---

## 🤝 贡献指南

欢迎贡献！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 🙏 致谢

- 基于 [AgentDock](https://github.com/agentdock/agentdock) 框架构建
- UI 设计灵感来自现代设计趋势
- 图标来自 [Lucide](https://lucide.dev/)
- 字体来自 [Google Fonts](https://fonts.google.com/)

---

## 📞 联系方式

**您的名字** - [@yourtwitter](https://twitter.com/yourtwitter)

项目链接: [https://github.com/yourusername/linai](https://github.com/yourusername/linai)

---

<div align="center">
  <p>使用 ❤️ 和 Next.js 构建</p>
  <p>⭐ 如果觉得有帮助，请给个 Star！</p>
</div>

