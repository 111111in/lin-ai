# 开源客户端（Next.js 实现）

这个参考实现基于 Next.js（App Router）构建，用于演示如何接入并使用 AgentDock Core 框架，从而搭建一个具备完整功能的对话式 AI 智能体 Web 应用。

**重要说明：**
- AgentDock Core 目前处于预发布阶段。当前我们在仓库内将其作为本地包（`file:./agentdock-core`）使用；当达到稳定版本后会发布为带版本号的 NPM 包。
- 随着 Core 的演进，框架与该 Next.js 客户端实现之间的职责边界也在持续优化。
- 如果你发现集成方式可以更清晰、或有改进建议，欢迎在 GitHub 提 Issue！

Core 与 Client 的整体规划可参考 [AgentDock Roadmap](./../roadmap.md)。

## 核心目的

- **演示 Core 集成：** 展示如何将前端应用接入 AgentDock Core 的能力（智能体、工具、会话管理、编排等）。
- **提供可用 UI：** 提供可用的聊天界面、智能体选择与设置管理等。
- **参考架构：** 给出 Web 场景下处理 API 通信、流式响应、状态管理与配置的实现模式。

## 关键特性与实现细节

- **框架：** Next.js（App Router）
  - 使用 Server Components、Client Components 与 API Routes
  - 使用基于文件的路由（`/app` 目录）
- **API Routes（`/app/api`）：**
  - `/api/chat/[agentId]/route.ts`：处理聊天消息的主入口。它接收消息、实例化 AgentDock Core 中对应的 `AgentNode`、管理 `sessionId`、处理流式响应，并可能返回会话 / token 使用信息。
  - 还可能存在用于配置、图像处理等的其它路由。
- **AgentDock Core 集成（`/lib/agent-adapter.ts` 或类似文件）：**
  - 包含加载智能体模板（`template.json`）的逻辑
  - 用合适的配置（API key、Provider 设置等）实例化 `AgentNode`
  - 调用 `AgentNode.handleMessage` 处理用户输入并生成响应
  - 管理 API 路由与 Core 库之间的数据流（消息、Session ID 等）
- **Session ID 处理：**
  - API 路由处理器负责从请求头/请求体提取 `sessionId`，或在必要时生成新 ID（遵循“单一事实来源”原则）。
  - `sessionId` 会被传给 `AgentNode`，并可能在响应头中返回给客户端以便持久化（例如 `localStorage` / session storage），用于后续请求。
- **会话管理：**
  - API 路由处理器负责 `sessionId` 管理（提取或生成）
  - `sessionId` 传入 `AgentNode` 并在响应头中返回
  - **Session TTL** 通过环境变量 `SESSION_TTL_SECONDS` 配置，详见 [Next.js 会话集成文档](../architecture/sessions/nextjs-integration.md#environment-based-ttl-configuration)
- **UI 组件（`/components`）：**
  - 使用 React、Shadcn/ui、Radix UI、Tailwind CSS 构建
  - 包含聊天界面（消息展示、输入、流式渲染）、智能体选择、设置面板等组件
- **状态管理（UI）：**
  - 使用标准 React state 与 context 管理
  - 如需更复杂的全局 UI 状态，也可使用 Zustand 等库
- **客户端存储与 API Key（BYOK）：**
  - 开源客户端使用 `localStorage` / `sessionStorage` 存储用户偏好设置（以及可能的 Session ID）。
  - BYOK（Bring Your Own Key）模式下，用户提供的 API Key 会通过 `agentdock-core` 的 `SecureStorage` 在客户端存储。
  - **安全注意事项（`SecureStorage`）：** `SecureStorage` 使用 AES-GCM 加密 API Key，并在使用前通过 HMAC 签名检测篡改。但为了能解密数据，所需的加密密钥也会存储在浏览器的 `localStorage` 中。这是常见的客户端加密技术，但存在固有风险：如果应用任意位置存在 XSS（或某些浏览器扩展注入恶意脚本），攻击者可能读取 `localStorage` 中的密钥并解密出 API Key。
  - **风险背景：** 实际风险取决于浏览器环境与应用对 XSS 的整体防护能力（例如浏览器是否更新、是否存在恶意扩展、应用是否有稳健的 XSS 防护）。如果 XSS 无法成功执行，风险会显著降低；但只要 XSS 可执行，风险就存在。
  - **建议：** 使用 BYOK 的用户应了解：即便加密，把 API Key 放在 `localStorage` 中仍存在 XSS 风险。请结合你的安全要求评估该风险。若追求最高安全性，更推荐在服务端通过环境变量配置 API Key；若必须客户端存储，请务必强化 XSS 防护。
- **图像生成：** 包含一个使用 Gemini 进行图像生成与编辑的独立页面，用于展示高级能力的集成方式。部署到 Vercel 时使用 Vercel Blob 持久化图像；本地开发时使用 `localStorage`。详见 [图像生成文档](./image-generation.md)。

## 目录结构（`/src`）

```
/src
├── app/                  # Next.js App Router
│   ├── api/              # API routes interfacing with Core
│   ├── chat/             # Main chat page components/logic
│   ├── docs/             # Documentation site pages
│   └── settings/         # User settings pages
├── components/           # Reusable React components
│   ├── chat/             # Components specific to the chat UI
│   ├── ui/               # Base UI elements (from shadcn/ui)
│   └── layout/           # Page layout components
├── lib/                  # Shared utilities, config, core integration
│   ├── agent-adapter.ts  # Logic for interacting with AgentNode
│   ├── docs-config.ts    # Documentation sidebar config
│   └── store/            # UI state management stores (if any)
├── public/               # Static assets (images, fonts)
└── templates/            # Agent template definitions (e.g., *.json)
```

## 如何使用该实现

请参考 [快速上手](../getting-started.md)，了解如何安装、配置（包括 API Key 与存储相关环境变量），并在本地运行开源客户端。