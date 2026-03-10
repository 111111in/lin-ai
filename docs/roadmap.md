# 路线图（Roadmap）

本页概述了 AgentDock 未来的规划与功能演进方向。大多数改进都会优先落在核心框架 `agentdock-core` 上（当前仍在积极开发中，稳定后会以版本化 NPM 包发布），部分特性也会涉及开源客户端。

## 已完成

| 功能 | 描述 |
|------|------|
| **存储抽象层（Storage Abstraction Layer）** | ✅ 灵活的存储系统，提供 15 个可直接用于生产的存储适配器 |
| **高级记忆系统（Advanced Memory Systems）** | ✅ 四层认知架构，支持 PRIME 提取、混合检索与记忆连接 |
| **向量存储集成（Vector Storage Integration）** | ✅ 基于向量嵌入的文档与记忆检索（已完整集成 PostgreSQL+pgvector 与 SQLite+sqlite-vec） |

## 进行中

| 功能 | 描述 |
|------|------|
| [**智能体评估框架**](./roadmap/evaluation-framework.md) | 面向 AI 智能体的系统化测试与评估体系 |

## 计划中

| 功能 | 描述 |
|------|------|
| [**平台集成**](./roadmap/platform-integration.md) | 支持 Telegram、WhatsApp 等消息平台接入 |
| [**多智能体协作**](./roadmap/multi-agent-collaboration.md) | 让多个智能体能够协同工作 |
| [**MCP（Model Context Protocol）集成**](./roadmap/mcp-integration.md) | 通过 MCP 发现并使用外部工具 |
| [**语音 AI 智能体**](./roadmap/voice-agents.md) | 基于 AgentNode 的语音与电话智能体 |
| [**遥测与可追踪性**](./roadmap/telemetry.md) | 高级日志与性能追踪能力 |

## 高级智能体应用

| 功能 | 描述 |
|------|------|
| [**代码演练场（Code Playground）**](./roadmap/code-playground.md) | 具备可视化能力的沙盒代码生成与执行环境 |

## 工作流系统

| 功能 | 描述 |
|------|------|
| [**工作流运行时与节点系统**](./roadmap/workflow-nodes.md) | 支持复杂自动化的核心运行时、节点类型与编排逻辑 |

## 云端部署方向

| 功能 | 描述 |
|------|------|
| [**AgentDock Pro**](/docs/agentdock-pro) | 面向企业的云平台，支持智能体与工作流的大规模部署，可视化工具与自动扩缩容 |
| [**自然语言智能体构建器**](./roadmap/nl-agent-builder.md) | 结合可视化界面与自然语言，实现智能体与工作流的一站式构建 |
| [**智能体市场（Agent Marketplace）**](./roadmap/agent-marketplace.md) | 支持智能体模板的上架与变现 |

## 开源客户端增强

-   提升智能体管理与聊天界面的 UI/UX 体验  
-   更直观地展示编排步骤与执行路径  
-   更健壮的 BYOK（自带密钥）管理能力  
-   扩展多模态输入/输出支持（不仅限于基础图像生成）  
-   在 Next.js 约束下探索多线程/后台任务的实现示例  
-   探索客户端架构中的多租户支持模式  

## 社区与生态建设

-   扩充社区贡献的智能体模板库  
-   提供更多示例项目与教程  
-   完善贡献指南与规范  

## AgentDock 仓库改进

-   补齐单元、集成与端到端（E2E）测试  
-   持续扩展核心能力，完善工作流节点类型与运行时实现  

> 本路线图仅作为当前规划参考，后续可能根据实际情况调整。

