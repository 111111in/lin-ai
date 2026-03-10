# AgentDock 架构概览

本章节介绍 AgentDock Core 的整体架构。AgentDock Core 是支撑所有 AgentDock 功能的基础库。

## 核心设计理念

AgentDock Core 的设计遵循以下原则：

-   **模块化（Modularity）：** 将 LLM 调用、会话管理、存储、编排等拆分为独立可替换的模块。
-   **可扩展性（Extensibility）：** 易于接入新的 LLM 提供商、存储后端、工具或自定义智能体逻辑。
-   **类型安全（Type Safety）：** 全面使用 TypeScript 类型，提升开发者信心，减少运行时错误。
-   **提供商无关（Provider Agnosticism）：** 在可能的情况下，屏蔽不同 LLM 提供商与存储系统之间的差异。
-   **状态管理优先（State Management Focus）：** 为多轮对话提供健壮的状态管理机制。

## 关键子系统

AgentDock Core 由若干相互连接的子系统组成：

1.  **LLM 抽象层（`/llm`）：** 通过统一接口 `CoreLLM` 与不同 LLM 提供商交互（OpenAI、Anthropic、Gemini 等，经由 Vercel AI SDK）。负责发起 API 调用、流式输出以及基础的 Token 统计。
2.  **存储抽象层（`/storage`）：** 提供可插拔的 Key‑Value 存储体系（已实现 Memory、Redis、Vercel KV），并预留向量存储和关系型存储的扩展能力。详见 [存储总览](../storage/README.md)。
3.  **会话管理（`/session`）：** 基于存储抽象层管理独立的会话状态，确保上下文持续可用，并处理会话的生命周期（创建、更新、基于 TTL 的清理）。详见 [会话管理](./sessions/session-management.md)。
4.  **编排框架（`/orchestration`）：** 通过“步骤（mode）+ 条件跳转 + 工具可用性 + 可选的工具序列”来控制智能体行为，核心依据是会话状态。详见 [编排总览](./orchestration/orchestration-overview.md)。
5.  **节点系统（`/nodes`）：** 定义核心执行单元与模块化架构。基于 `BaseNode`，包含主要的 `AgentNode`（整合 LLM、工具、会话与编排）、各类工具节点以及自定义节点。由 `NodeRegistry`（类型注册）与 `ToolRegistry`（运行时工具注册）统一管理。详见 [节点系统总览](../nodes/README.md)。
6.  **工具系统（集成于 `/nodes`）：** 工具以“专用节点”的形式实现，其定义、注册（`NodeRegistry`）、运行时可用性（`ToolRegistry`）以及被 `AgentNode` 通过函数/工具调用触发执行，都是节点系统的一部分。
7.  **错误处理（`/errors`）：** 提供标准化的错误类型与处理机制。
8.  **配置系统（`/config` 与 Agent 模板）：** 通过 `template.json` 模板文件定义智能体行为，包括 LLM、工具、提示词、编排规则等。

## 交互流程总览

一次典型的请求‑响应流程如下：

1.  **请求进入：** 来自开源客户端等入口的请求首先到达对应的 API 路由。
2.  **会话处理：** 路由层获取或创建 `SessionId`。
3.  **实例化智能体：** 根据智能体模板配置创建 `AgentNode` 实例。
4.  **状态加载：** 通过 `SessionManager` / `OrchestrationStateManager` 载入相关会话状态（例如 `OrchestrationState`）。
5.  **编排判定：** 编排逻辑确定当前激活的步骤，并基于条件与工具序列筛选可用工具。
6.  **LLM 调用：** `AgentNode` 使用 `CoreLLM` 调用 LLM，传入消息历史、系统提示词以及已筛选的工具列表。
7.  **工具执行（如有）：** 若 LLM 触发工具调用，`AgentNode` 执行对应工具，并在需要时更新会话状态。
8.  **流式返回：** 将 LLM 的文本或工具调用结果以流式方式返回给客户端。
9.  **状态更新：** 通过对应的管理器更新会话状态（消息历史、Token 使用量、编排状态等）。
10. **结束与持久化：** 流结束后，最终状态被持久化存储。

更详细的流程请参见 [请求流转](./core/request-flow.md)。

## 目录结构（`agentdock-core/src`）

```
/src
├── client/         # (Primarily for Open Source Client integration)
├── config/         # Configuration loading utilities
├── errors/         # Custom error types and factory
├── evaluation/     # Agent evaluation framework (runner, evaluators, storage)
├── llm/            # CoreLLM abstraction, provider specifics
├── logging/        # Logging utilities
├── nodes/          # AgentNode, tool execution logic
├── orchestration/  # State management, sequencing, conditions
├── session/        # SessionManager implementation
├── storage/        # Storage abstraction, providers (KV, Secure)
├── tools/          # Base tool definitions and specific tool implementations
├── types/          # Core TypeScript type definitions
└── utils/          # General utility functions
```

## 延伸阅读

-   [核心架构详情](./core/overview.md)
-   [节点系统总览](../nodes/README.md)
-   [技术栈](./core/technology-stack.md)

## 评估框架概览

AgentDock 中一个非常重要的组成部分是 **评估框架（Evaluation Framework）**。它用于系统化地度量、分析并持续改进智能体质量，位于 `agentdock-core` 包内，为不同维度的性能评估提供完整工具集。

核心特点包括：

*   **模块化评估器：** 内置多种评估器（如 `RuleBasedEvaluator`、`LLMJudgeEvaluator`、`NLPAccuracyEvaluator`、词汇评估套件、`ToolUsageEvaluator` 等），可以针对不同质量维度进行精细化评估。
*   **`EvaluationRunner`：** 负责根据配置与评估标准协调整次评估流程。
*   **可配置评估标准：** 支持通过 `EvaluationCriteria` 定义评估名称、描述、评分尺度、权重等信息。
*   **结果聚合与存储：** 提供加权评分、结果聚合以及通过 `EvaluationStorageProvider` 持久化存储的能力。
*   **高度可扩展：** 基于 `Evaluator` 与 `EvaluationStorageProvider` 等接口，可以方便地扩展自定义评估组件。

评估框架是保证智能体可靠性与性能的关键基础设施，有助于数据驱动的迭代优化。更多细节可参见 [评估框架文档](../evaluations/README.md)。