# 使用 AgentDock 的快速开始

本指南将帮助你在本地机器上完成 AgentDock 的安装与运行，用于开发和测试。

## 组件组成

AgentDock 主要由两个核心组件构成：

1. **AgentDock Core** —— 提供所有智能体能力的核心基础库
2. **开源客户端（Open Source Client）** —— 基于 Next.js 实现的完整 Web 应用，用来与智能体进行交互

本仓库同时包含这两个部分，你可以一起使用，也可以按需拆分使用。

## 环境要求

- Node.js ≥ 20.11.0（LTS）
- pnpm ≥ 9.15.0（必需）
- Docker 与 Docker Compose（推荐开启，用于有状态特性）
- 至少一个 LLM 提供商的 API Key（Anthropic、OpenAI、Gemini 等）

## 安装与启动

1. **克隆仓库**：

   ```bash
   git clone https://github.com/AgentDock/AgentDock.git
   cd AgentDock
   ```

2. **安装 pnpm（如尚未安装）**：

   ```bash
   corepack enable
   corepack prepare pnpm@latest --activate
   ```

3. **安装依赖**：

   ```bash
   pnpm install
   ```

4. **（推荐）启动后端服务（通过 Docker 运行 Redis）**

   对于需要在多轮交互之间保持状态的功能（例如会话管理、编排状态、累计 Token 统计），强烈建议通过 Docker 启动 Redis。

   - **为什么需要 Docker/Redis？** AgentDock Core 使用可配置的存储层。默认情况下（未配置 Docker）会使用**内存存储**，这意味着会话状态、编排进度和 Token 计数在服务重启后会**全部丢失**，在某些部署模式下甚至可能在请求之间丢失。虽然应用看起来能跑，但所有依赖持久状态的功能都不可靠。
   - 使用 Redis 可以在开发过程中为这些数据提供持久化存储。

   - **使用 Docker Desktop：** 如果你刚接触 Docker，可以使用 [Docker Desktop](https://www.docker.com/products/docker-desktop/) 这种带图形界面的工具来启动/停止容器、查看日志等。

   - **启动服务：**
     在仓库根目录（`docker-compose.yaml` 所在目录）执行：
     ```bash
     docker compose up -d
     ```
     该命令会在后台启动 Redis（以及用于查看数据的 Redis Commander 等相关服务）。

   - **停止 Redis：**
     开发结束后，可通过以下命令关闭服务：
     ```bash
     docker compose down
     ```

5. **配置环境变量**：

   Create an environment file (`.env` or `.env.local`) in the root directory:

   ```bash
   # Option 1: Create .env.local
   cp .env.example .env.local
   
   # Option 2: Create .env
   cp .env.example .env
   ```

   编辑环境变量文件：
   - 添加各个 LLM 提供商的 API Key（至少需要一个）。
   - **（如果按第 4 步使用了 Docker/Redis）** 从下面两种存储配置方式中选择 **一种**：
     
     **方案 A：直连 Redis（本地开发推荐）**
     ```dotenv
     # --- Key-Value Storage --- 
     # Connect directly to the Redis container
     KV_STORE_PROVIDER=redis
     REDIS_URL="redis://localhost:6380" 
     # REDIS_TOKEN=... (Leave commented out unless you set a password in docker-compose.yaml)
     ```
     
     **方案 B：通过 Redis HTTP 代理连接（用于本地模拟 edge/serverless 环境）**
     `docker-compose.yaml` 还会启动 `redis-http-proxy`（端口 8079），它为 Redis 提供 HTTP 接口，类似生产环境中 Upstash 之类的服务。如果你需要专门测试通过 HTTP 代理访问 Redis，可以使用该方案。
     ```dotenv
     # --- Key-Value Storage --- 
     # Connect via the local Redis HTTP Proxy container
     KV_STORE_PROVIDER=redis 
     REDIS_URL="http://localhost:8079" # Note: Using HTTP URL for the proxy
     REDIS_TOKEN="test_token" # Use the token defined for the proxy in docker-compose.yaml
     ```
   - **（如果不使用 Docker/Redis）** 应用会默认使用 `KV_STORE_PROVIDER=memory`。你可以显式设置为 `memory`，或直接不配置该变量。

   Example snippet for `.env.local` (using Option A - Direct Redis):
   ```dotenv
   # LLM Provider API Keys
   OPENAI_API_KEY=sk-xxxxxxx
   OPENAI_API_KEY=sk-xxxxxxx
   # ... other keys ...

   # Storage Configuration (Using Dockerized Redis)
   KV_STORE_PROVIDER=redis
   REDIS_URL="redis://localhost:6380"
   ```

6. **启动开发服务器**：

   ```bash
   pnpm dev
   ```

7. **访问应用**：

   在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

## 创建你的第一个智能体

AgentDock 通过「智能体模板」来描述智能体的行为。下面是创建自定义智能体的步骤：

### 1. 创建智能体模板

在仓库根目录下的 `agents` 文件夹中新建一个目录：

```
agents/my-first-agent/
```

在该目录下新建 `template.json` 文件，写入你的智能体配置：

```json
{
  "version": "1.0",
  "agentId": "my-first-agent",
  "name": "My First Agent",
  "description": "一个简单的示例智能体",
  "personality": [
    "You are a helpful assistant that provides concise answers.",
    "You are designed to be helpful and informative.",
    "You can help users with weather information and web searches.",
    "Use the weather tool to get current conditions and forecasts for any location worldwide.",
    "Use the search tool to find information on any topic. The tool will return relevant web search results that you can use to answer user questions.",
  ],
  "nodes": [
    "llm.anthropic",
    "weather",
    "search"
  ],
  "nodeConfigurations": {
    "llm.anthropic": {
      "model": "gpt-4.1-mini",
      "temperature": 0.7,
      "maxTokens": 4096,
      "useCustomApiKey": false
    },
    "weather": {
      "maxResults": 5
    },
    "search": {
      "maxResults": 8
    }
  },
  "chatSettings": {
    "historyPolicy": "lastN",
    "historyLength": 50,
    "initialMessages": [
      "你好！我是你的新智能体，我可以帮你查询天气和进行网页搜索，今天想让我为你做点什么？"
    ],
    "chatPrompts": [
      "What's the weather like in New York?",
      "Search for information about climate change"
    ]
  },
  "tags": ["Personal", "Weather", "Research"]
}
```

### 2. 启动开发服务器

直接启动开发服务器，系统会自动打包 `agents` 目录下的所有模板：

```bash
pnpm dev
```

The `predev` script will automatically run before starting the server, bundling all templates in the `agents` directory.

### 3. 测试你的智能体

在浏览器中访问 [http://localhost:3000/chat?agentId=my-first-agent](http://localhost:3000/chat?agentId=my-first-agent) 即可与该智能体对话；它也会出现在智能体选择页面中。

## 自定义你的智能体

智能体的所有行为都通过 `template.json` 控制，主要字段说明如下：

- `version`：模板版本（可选）
- `agentId`：智能体的唯一标识
- `name`：在界面中显示的名称
- `description`：对智能体职责的简要说明
- `personality`：一组描述智能体性格与行为风格的字符串
- `nodes`：该智能体会使用到的节点类型列表，每个节点代表一项能力：
  - LLM 节点（如 `"llm.anthropic"`、`"llm.openai"`、`"llm.gemini"`）—— 提供大模型对话能力
  - 工具节点 —— 提供特定功能：
    - `"weather"` —— 查询指定地点的天气
    - `"search"` —— 进行网页检索
    - `"stock-price"` —— 获取股票行情
    - `"crypto-price"` —— 获取加密货币价格
    - `"image-generation"` —— 生成图像
    - `"deep-research"` —— 进行深度研究
    - `"science"` —— 访问科学论文与数据
    - `"cognitive-tools"` —— 高级认知工具能力
- `nodeConfigurations`：针对各节点的详细配置
  - 对 LLM 节点，可指定模型名称与参数（temperature、maxTokens 等）
  - 对工具节点，可设置其特有参数（例如 search 的 `maxResults`）
  - 不同节点类型会有各自支持的配置项
- `chatSettings`：控制聊天行为
  - `historyPolicy`：聊天历史策略（`"none"`、`"lastN"`、`"all"`）
  - `historyLength`：在使用 `"lastN"` 时保留的消息条数
  - `initialMessages`：会话开始时展示的系统消息
  - `chatPrompts`：在 UI 中展示的推荐提问
- `tags`：用来给智能体打标签、归类

## 关于开源客户端（Open Source Client）

开源客户端是本仓库中完整的 Web 应用，用作 AgentDock Core 的参考实现，主要包含：

- 与智能体对话的聊天界面
- 智能体选择与管理
- 文档站点
- 用于智能体通信的 API 路由
- 图像生成功能
- 设置管理等

通过该客户端，你可以看到如何基于 AgentDock Core 搭建一个完整的生产级应用。

## 生产环境构建

要生成生产构建：

```bash
pnpm build
```

该命令会在 `.next` 目录中生成优化后的生产构建。

在本地预览生产环境构建：

```bash
pnpm start
```

## 在独立项目中使用 AgentDock Core

如果你只想在自己的项目中单独使用 AgentDock Core，可以按下面步骤操作：

1. **安装依赖包**：

   ```bash
   pnpm add agentdock-core
   ```

2. **在代码中引入并使用**：

   ```typescript
   import { AgentNode } from 'agentdock-core';
   
   async function createAgent() {
     // 创建一个智能体配置
     const config = {
       id: "my-agent",
       name: "My Agent",
       systemPrompt: "You are a helpful assistant.",
       tools: ["search"]
     };
     
     // 创建智能体实例
     const agent = new AgentNode('my-agent', {
       agentConfig: config,
       apiKey: process.env.OPENAI_API_KEY,
       provider: 'openai'
     });
     
     // 处理一条消息
     const result = await agent.handleMessage({
       messages: [{ role: 'user', content: 'Hello, how can you help me?' }]
     });
     
     console.log(result.text);
   }
   ```

## 下一步可以做什么？

当你成功跑起 AgentDock 之后，可以继续阅读：

- [智能体模板](agent-templates.md) —— 了解更多模板字段与配置选项
- [架构总览](architecture/README.md) —— 理解系统整体架构
- [节点系统](nodes/README.md) —— 深入了解基于节点的架构
- [自定义工具开发](nodes/custom-tool-development.md) —— 编写你自己的工具节点
- [开源客户端功能](oss-client/image-generation.md) —— 探索参考实现中的各项特性

## 故障排查

### 常见问题

1. **“Cannot find module 'pnpm'”**
   - 请确认已通过全局安装或 corepack 安装 pnpm

2. **API Key 相关错误**
   - 检查是否在 `.env.local` 中正确填入了 API Key
   - 确认 Key 的格式符合对应提供商的要求

3. **新建的智能体没有出现在列表中**
   - 创建新模板后，请重新启动开发服务器
   - 检查 `template.json` 是否为合法 JSON 且包含必需字段

4. **依赖问题**
   - 尝试执行 `pnpm clean && pnpm install` 重新安装依赖

### 获取更多帮助

如果遇到以上内容未覆盖的问题，可以：
- 在 GitHub 仓库中搜索现有 Issue
- 提交一个包含详细信息的新 Issue

### 快速启动开发服务器

```bash
pnpm dev
```

该命令会启动 Next.js 参考客户端应用。

### 在其他后端框架中集成 AgentDock Core

本指南主要围绕 Next.js 参考客户端展开，但 `agentdock-core` 本质上是一个适用于 Node.js 环境的独立库，你可以将其集成到任意后端框架（如 Express、Fastify、Hono、NestJS 等）中：

1.  **安装：** 在你的后端项目中添加 `agentdock-core` 依赖（或通过本地 link 的方式引用）。
2.  **引入：** 导入所需的类与函数（如 `AgentNode`、`NodeRegistry`、`registerCoreNodes`、配置加载器等）。
3.  **初始化：** 调用 `registerCoreNodes()` 注册核心节点，并注册你的自定义节点/工具。
4.  **集成：** 在后端框架中创建 API 路由（例如 `/api/chat/:agentId`）。
5.  **处理请求：** 在路由处理函数中实例化 `AgentNode`，使用核心提供的会话/存储管理器（或你自己的实现）管理状态，通过 `agentNode.handleMessage` 处理消息并将流式响应返回给客户端。

### 从其他语言（Python、Rust 等）访问 AgentDock

`agentdock-core` 是 TypeScript 库，无法在非 JS/TS 环境中直接使用。但你可以通过 HTTP API 方式，从任意语言或平台访问 AgentDock 智能体：

1.  **构建后端 API：** 使用 Node.js 与 `agentdock-core` 搭建后端服务，对外暴露 HTTP API（例如 REST 接口）。
2.  **在其他语言中调用：** 从 Python、Rust、Java、前端应用或任何其他客户端，通过标准 HTTP 请求调用这些 API，即可与智能体交互。

这种以 API 为中心的方式，可以让 AgentDock 的核心能力在不同技术栈中复用。