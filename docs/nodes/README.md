# 节点系统总览（Node System）

AgentDock 采用基于 `BaseNode` 的**节点化架构**，所有能力都围绕节点来组织。  
这种设计让系统具备高度的模块化、可扩展性和可配置性：在统一节点框架下，既包括负责 LLM 交互的 `AgentNode`，也包括可被调用的各种工具节点。

**向前展望：工作流愿景**

当前节点体系已经具备明确的 `input` / `output` 端口定义和 `MessageBus` 消息总线集成，  
这些能力为后续构建复杂工作流引擎和串联执行模式打下了基础。  
虽然目前参考客户端主要聚焦于由 `AgentNode` 调用工具，但底层架构远不止于此。

未来我们会继续扩展节点类型，以支持真正意义上的自动化工作流，例如：
- **事件节点（Event Nodes）**：从外部事件或定时任务触发流程；  
- **变换 & AI 推理节点（Transform & AI Inference Nodes）**：做数据处理和专门的 AI 任务；  
- **连接器 & 动作节点（Connector & Action Nodes）**：与外部服务、数据库集成；  
- **逻辑节点（Logic Nodes）**：分支、循环等高级流程控制。

更多规划可见 [工作流节点路线图](./../roadmap/workflow-nodes.md)。  
AgentDock Pro 会在此开源节点系统之上提供可视化工作流编辑器与管理界面。

## 核心节点类型

在支持自定义节点的同时，AgentDock Core 也内置了若干基础节点类型。

### `BaseNode`

`BaseNode` 由 **AgentDock Core** 提供，是所有节点的基类，为不同节点提供统一接口与核心能力：

- **元数据管理（Metadata）**：通过不可变的 `NodeMetadata` 描述节点：  
  - `category`：`core` 或 `custom`；  
  - `label`：展示名称；  
  - `description`：功能简介；  
  - `inputs` / `outputs`：端口定义；  
  - `version`：语义化版本号；  
  - `compatibility`：是否支持 core / pro / custom 环境。  
- **端口系统（Port System）**：通过 `NodePort` 定义类型安全的输入输出：  
  `id`、`type`、`label`、可选的 `schema`（Zod 校验）、`required`、`defaultValue` 等。  
- **校验钩子**：提供 `validateInput` / `validateOutput` / `validateConnection` 等方法，子类可覆盖以实现更严格校验。  
- **消息传递（MessageBus）**：可通过 `setMessageBus` 注入消息总线，节点可调用 `sendMessage` / `addMessageHandler` / `removeMessageHandler` 进行异步通信。  
- **生命周期管理**：`initialize()` 做初始化，`execute()` 执行业务逻辑，`cleanup()` 做资源释放。  
- **序列化**：`toJSON()` 可将节点状态（id、type、config、metadata）序列化为 JSON。

```typescript
// 来自 AgentDock Core 的示意
export abstract class BaseNode<TConfig = unknown> {
  readonly id: string;
  abstract readonly type: string; // 例如 'core.agent'
  protected config: TConfig;
  readonly metadata: NodeMetadata;

  abstract execute(input: unknown): Promise<unknown>;

  async initialize(): Promise<void>;
  async cleanup(): Promise<void>;

  validateInput(input: unknown): boolean;
  validateOutput(output: unknown): boolean;
  validateConnection(sourcePort: string, targetPort: string): boolean;

  setMessageBus(messageBus: MessageBus): void;
  protected async sendMessage<T>(targetId: string, type: string, payload: T): Promise<string>;
  protected addMessageHandler<T>(type: string, handler: MessageHandler<T>): void;
  protected removeMessageHandler(type: string): void;

  toJSON(): { id: string; type: string; config: TConfig; metadata: NodeMetadata };
}
```

### `AgentNode`

`AgentNode`（`type: 'core.agent'`）是 **AgentDock Core** 中用于编排对话式 AI 的核心节点：

- **配置（`AgentNodeConfig`）**：包含提供商信息、主/备 API Key、LLM 选项，以及完整的 `agentConfig`（人格、可用节点、编排规则等）；  
- **LLM 集成**：管理主/备 `CoreLLM` 实例；若未显式配置，会通过 `createLLMInstance` 自动推导；  
- **动态工具选择**：通过 `getAvailableTools`、`ToolRegistry` 与 `OrchestrationManager`，在每一轮对话中筛选可用工具；  
- **运行时执行（`handleMessage`）**：接收 `messages`、`sessionId`、`OrchestrationManager` 以及可选的系统 Prompt / LLM 覆盖配置；  
- **流式委托**：内部调用 LLM 的 `streamText` 并返回 `AgentDockStreamResult`，实际消费流与处理工具调用结果则交给 API Route / 适配层；  
- **错误处理**：内置多提供商回退机制。

### 工具即节点（Tools as Nodes）

在 Core 层，工具本质上也是节点的一种，通常以 `isTool: true` 的形式注册到 `NodeRegistry`：

- **注册方式**：与普通节点类似，只是多了工具相关字段（`parameters`、`description` 等）；  
- **Schema 与描述**：`parameters` 使用 Zod Schema，用于约束 LLM 调用参数；  
- **统一接口**：同样遵循 `BaseNode` 的生命周期与执行接口；  
- **动态可用性**：由 `AgentNode` + `ToolRegistry` + `OrchestrationManager` 共同决定在某次对话中哪些工具可被 LLM 使用。

## 节点注册系统

AgentDock 通过注册表来管理节点类型和工具类型。

### `NodeRegistry`

`NodeRegistry`（来自 **AgentDock Core**）负责节点类型的发现和实例化：

- 通过唯一的 type 字符串（如 `'core.agent'`）注册 `NodeRegistration`（包含 `nodeClass`、`version`、`isTool`、`parameters`、`description` 等）；  
- 区分核心与自定义：`register` 用于 core，`registerCustomNode` 用于 custom；  
- `create` 方法根据类型创建节点实例，并做版本兼容性检查；  
- `getToolDefinitions` 会把标记为 `isTool` 的节点封装成 AI SDK 兼容的 `Tool` 对象；  
- `getNodeMetadata` 用于获取所有已注册节点的完整元数据。

### `ToolRegistry`

`ToolRegistry` 负责**运行时**工具可用性的管理：

- `AgentNode` 会调用它来确定某个 agent 在当前轮次可以使用哪些工具；  
- `getToolsForAgent` 根据 agent 配置中的节点列表，返回已注册的工具对象；  
- 一般通过单例 `getToolRegistry()` 访问。

## 设计模式与生命周期

节点系统实现了若干经典设计模式：

- **工厂模式**：`NodeRegistry.create` 作为节点实例工厂；  
- **注册表模式**：`NodeRegistry` / `ToolRegistry` 统一管理所有类型；  
- **观察者模式（潜在）**：`MessageBus` 支持节点间事件驱动通信；  
- **策略模式**：不同节点实现代表完成任务的不同策略。

节点的一般生命周期：

1. **注册**：节点“类型”在 `NodeRegistry` 中完成注册；  
2. **实例化**：通过 `NodeRegistry.create` 创建具体实例；  
3. **初始化**：调用 `initialize()` 做准备工作；  
4. **执行**：反复调用 `execute()`（或 `AgentNode.handleMessage`）；  
5. **清理**：在不再需要实例时调用 `cleanup()`。

## 节点之间的关系

- **消息传递**：通过 `MessageBus` 进行异步通信，可用于构建复杂的事件驱动工作流；  
- **工具调用**：`AgentNode` 根据 LLM 请求调用工具节点；  
- **工作流连接**：依托 `input` / `output` 端口和 `validateConnection`，可以在不同节点之间建立显式的数据流链路，为未来的可视化工作流编辑器打下基础。

## 未来演进方向

- 扩充丰富的工作流节点库（事件、变换、AI 推理、连接器、动作、逻辑等）；  
- 基于 `NodeMetadata` 构建可视化节点编辑器；  
- 更完善的节点版本管理与节点「市场」；  
- 在消息总线和端口系统之上构建通用工作流引擎。

如需进一步了解，可直接阅读 `agentdock-core` 中的 `src/nodes/` 源码，以及参考实现里 `src/nodes/tools/` 下的各类工具示例。 