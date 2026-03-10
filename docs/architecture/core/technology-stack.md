# 技术栈（Technology Stack）

本文档概述 AgentDock Core 及其参考实现所使用的**核心技术栈**。

## 核心框架（Core Framework）

- **TypeScript**：主力语言，提供类型安全与现代 JavaScript 特性；  
- **Node.js**：服务端运行时（推荐版本 ≥ 20.11.0）；  
- **Vercel AI SDK**：统一接入多家 LLM 提供商的核心依赖。

## 状态管理

- **Zod**：用于 Schema 校验与运行时类型检查；  
- **Zustand**：在参考实现中用于部分 UI 状态管理。

## 开发环境

- **pnpm**：包管理工具（推荐版本 ≥ 9.15.0）；  
- **ESLint & TypeScript-ESLint**：代码质量与类型检查；  
- **Jest**：单元测试框架；  
- **Husky**：通过 Git hooks 强制执行代码规范。

## 前端参考实现

关于基于 Next.js 构建的开源客户端实现，可参考文档：  
[Next.js 实现](../../oss-client/nextjs-implementation.md)。

### 关键前端技术

- **Next.js**：带 App Router 的 React 框架；  
- **React**：UI 库（^18.2.0）；  
- **shadcn/ui & Radix UI**：高质量的基础组件库；  
- **Tailwind CSS**：原子化 CSS 框架；  
- **React Hook Form**：表单管理；  
- **React Markdown**：文档渲染。

## AgentDock Core 主要依赖

- **语言：TypeScript**  
  - 为核心库提供强类型、编译期检查与更好的可维护性。  
- **运行时：Node.js（推荐 LTS）**  
  - 作为在服务端部署 core 逻辑的主要执行环境。  
- **LLM 交互：Vercel AI SDK（`ai` 包）**  
  - 提供统一的、以流式优先的接口来调用多家 LLM 提供商（OpenAI、Anthropic、Google Gemini、Groq 等）；  
  - 处理文本生成、流式输出、函数/工具调用等跨提供商差异。  
- **存储（默认与内置）**  
  - 内存存储：在未配置外部存储时，用作会话/编排状态的默认 KV；  
  - Redis（`@upstash/redis`）：适合本地与云端持久化存储，常配合 Docker 使用；  
  - Vercel KV（`@vercel/kv`）：适配 Vercel 平台的 KV 存储。  
- **Schema 校验（工具参数）：Zod**  
  - 在工具定义中用于描述与校验 LLM 传入的参数，确保安全与可调试性。  
- **日志：自定义 Logger（`agentdock-core/src/logging`）**  
  - 提供结构化日志能力，方便排查问题与监控运行状态。  
- **包管理：pnpm**  
  - 管理依赖并提供高效的安装过程；AgentDock Core 计划以独立 NPM 包形式发布。

## 开源客户端（参考实现）

该 Web 应用展示了如何在实践中使用 AgentDock Core：

- **框架：Next.js（App Router）**  
  - 提供路由、服务端组件、客户端组件以及 API 路由能力。  
- **UI 组件：shadcn/ui & Radix UI**  
  - 用于按钮、输入框、布局等基础组件，基于 Tailwind CSS 构建。  
- **样式：Tailwind CSS**  
  - 提供便捷的原子化样式体系。  
- **UI 状态管理**：以 React state/context 为主，必要时辅以 Zustand；  
- **客户端存储**：`localStorage`（对于敏感信息可结合 Core 中的 `SecureStorage` 做加密存储）。

## 开发与构建工具

- **依赖管理：pnpm**  
  - 使用高效的 node_modules 结构，保证安装与缓存的一致性。  
- **脚本与任务：pnpm scripts**  
  - 用于运行构建、测试、开发、Lint 等任务。  
- **测试框架：Vitest**  
  - 执行单元与集成测试。  
- **代码规范：ESLint & Prettier**  
  - 保证代码质量与统一的格式风格。

## 可选后端服务（开发环境）

- **Redis**：  
  - 如前文所述，用于在开发环境持久化会话与编排状态，通常通过 `docker-compose.yaml` 启动；  
- **Redis Commander**：  
  - 简单的 Web UI，方便在开发过程中查看 Redis 中的数据，同样包含在 `docker-compose.yaml` 中。

## Vercel AI SDK 的增强能力

AgentDock 在 Vercel AI SDK 之上做了多项增强：

- **`AgentDockStreamResult`**  
  - 在标准 `StreamTextResult` 基础上扩展：  
    - 编排状态追踪（如已使用工具、累积 token 消耗）；  
    - 更丰富的错误信息；  
    - 自定义流式响应转换能力。  

- **`LLMOrchestrationService`**  
  - 将 SDK 的流式能力与编排逻辑打通：  
    - 自动在会话状态中更新 token 使用量；  
    - 记录对话过程中的工具使用情况；  
    - 为编排规则提供最新的状态输入。

更多内容可继续阅读：

- [流式响应（Response Streaming）](./response-streaming.md)  
- [LLM 编排（LLM Orchestration）](../orchestration/llm-orchestration.md)