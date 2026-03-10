# 核心架构总览（Core Architecture Overview）

**AgentDock Core** 提供构建「有状态、可用工具」AI 智能体所需的基础库与系统，强调**模块化、类型安全与可扩展性**。

## 设计原则

- **模块化（Modularity）**：  
  LLM 交互、状态管理、存储、编排等关键职责由彼此独立、可替换的模块承担。
- **可扩展性（Extensibility）**：  
  易于接入新的 LLM 提供商、存储后端、自定义工具和智能体逻辑。
- **类型安全（Type Safety）**：  
  全面使用 TypeScript，对核心库进行强类型约束。
- **提供商无关（Provider Agnosticism）**：  
  尽量抽象各家 LLM 与存储系统的共性，让上层代码与具体厂商解耦。
- **状态管理（State Management）**：  
  核心关注点之一是如何在多轮交互中可靠维护会话状态。

## 关键子系统与组件

AgentDock Core 由多个紧密协作的子系统组成：

1. **LLM 抽象层（`/llm`）**  
   - `CoreLLM`：统一封装与各类 LLM 提供商的交互（基于 Vercel AI SDK）。  
   - 负责流式输出、函数/工具调用协议转换、基础 token 统计等。

2. **节点系统（`/nodes`）**  
   - `AgentNode`：核心节点类型，负责对话智能体的整体编排，包括 LLM 调用、工具执行与状态管理。  
   - 定义了对话型智能体的主要处理流程。

3. **存储抽象（`/storage`）**  
   - 提供统一接口 `StorageProvider` 及多种实现（内存、Redis、Vercel KV 等）。  
   - `StorageFactory`：根据配置创建不同存储实例。  
   - `SecureStorage`：浏览器端加密存储。  
   - 也是后续向量存储、关系型存储等能力的基础。

4. **会话管理（`/session`）**  
   - `SessionManager`：基于存储抽象管理会话状态的全生命周期（创建、读取、更新、TTL 清理）。  
   - 确保不同会话间的上下文隔离。

5. **编排框架（`/orchestration`）**  
   - `OrchestrationStateManager`：管理每个会话的编排状态（当前步骤、工具历史、步骤进度）。  
   - `StepSequencer`：在单个步骤内控制工具的执行顺序。  
   - 条件逻辑：根据配置的条件决定步骤间的跳转。  
   - 决定在当前步骤/序列下哪些工具对 LLM 可见。

6. **工具系统（`/tools`，并与 `/nodes`、`/llm` 集成）**  
   - 定义工具的结构、入参校验与执行逻辑。  
   - 与 `CoreLLM` 集成，实现函数/工具调用。  
   - 由 `AgentNode` 负责加载、过滤（结合编排规则）并执行工具。

7. **配置系统（`/config`, `/templates`）**  
   - 从模板文件（如 `template.json`）中加载智能体定义。  
   - 管理 API Key、存储等运行时环境配置。

8. **错误处理（`/errors`）**  
   - 提供统一的错误类型与工厂方法，保证错误上报的一致性与可观测性。

9. **评估框架（`/evaluation`）**  
   - 为系统化评估智能体效果提供工具与基础设施。  
   - 包含 `EvaluationRunner`、多种 `Evaluators`（规则、LLM 裁判、NLP、词汇、工具使用等）、`EvaluationCriteria` 定义，以及用于持久化评估结果的 `EvaluationStorageProvider`。

## 核心组件一览

从更高层的视角看，AgentDock Core 包含以下关键能力：

- **节点系统（Node System）**：灵活可扩展的智能体构建框架；  
- **LLM 提供商抽象（LLM Providers）**：面向多家 LLM 的统一接口；  
- **工具框架（Tool Framework）**：标准化的工具定义与使用方式；  
- **编排系统（Orchestration）**：管理多步骤、多工具的复杂工作流；  
- **流式响应（Response Streaming）**：在 Vercel AI SDK 之上扩展的高级流式能力；  
- **LLM 编排服务（LLM Orchestration Service）**：在 `AgentNode` 与 `CoreLLM` 之间提供编排桥接。

如需进一步了解各模块细节，可参阅：

- [请求流转（Request Flow）](./request-flow.md)  
- [技术栈（Technology Stack）](./technology-stack.md)  
- [流式响应（Response Streaming）](./response-streaming.md)

## 交互关系总结

整体上，各子系统的协作方式可以概括为：  
`AgentNode` 使用 `CoreLLM` 完成语言任务；  
通过 `SessionManager` 与 `OrchestrationStateManager`（底层依赖 `Storage` 抽象）维护上下文与流程控制；  
再根据编排规则触发并执行各类 `Tools`。  

更多关于每个子系统的详细说明，可在 [架构总览文档](../README.md) 中找到链接。