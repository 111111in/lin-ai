# 编排框架总览

AgentDock 的编排（Orchestration）提供了一种结构化方式，用于控制智能体行为、在不同状态（步骤）下管理可用工具，并为复杂任务定义执行序列。相较于“工具无限制可用”，编排能带来更可引导、更可靠、更聚焦的智能体交互。

## Core Concepts

 - **步骤（Steps/模式 Modes）：** 智能体工作流中的离散状态（例如 `research`、`planning`、`code_generation`）。每个步骤定义该状态下的行为与约束。
 - **条件（Conditions）：** 基于上下文（用户消息、工具使用等）触发“步骤之间”切换的规则。见 [条件跳转](./conditional-transitions.md)。
 - **工具可用性（Tool Availability）：** 每个步骤的配置决定该步骤激活时，哪些工具允许/禁止。
 - **序列（Sequencing）：** 在某个步骤内部，可以强制工具以指定顺序执行。见 [步骤编排（序列）](./step-sequencing.md)。
 - **会话状态（Session State）：** 编排高度依赖每个会话的状态（`OrchestrationState`），用于跟踪当前激活步骤、工具使用历史以及序列推进进度。见 [状态管理](./state-management.md)。

## Architecture & Implementation

Key components work together, managed primarily within the `agentdock-core/src/orchestration` directory:

1. **配置（Configuration）：** 在智能体模板（`template.json` 等）中定义，包含步骤、条件、工具可用性与序列等。见 [编排配置](./orchestration-config.md)。
2. **`OrchestrationStateManager`：** 使用核心 `SessionManager` 与配置好的存储 Provider，为每个会话管理 `OrchestrationState`。
3. **`StepSequencer`：** 强制执行步骤内定义的工具序列，并通过与 `OrchestrationStateManager` 交互来跟踪进度（`sequenceIndex`）。
4. **条件评估逻辑（Condition Evaluation Logic）：** 基于配置条件与当前上下文（消息内容、`OrchestrationState`）判断应激活哪个步骤；该逻辑会协调读取状态并触发状态更新。
5. **工具过滤（Tool Filtering）：** 将当前激活步骤的 `availableTools` 配置与 `StepSequencer` 的过滤结果组合起来，得到“此刻提供给 LLM 的精确工具集合”。

## Flow of Operation

1. **初始化：** 智能体实例加载其编排配置。
2. **收到交互（例如用户消息）：**
   a. 系统通过 `OrchestrationStateManager` 读取或创建该会话的 `OrchestrationState`。  
   b. 条件评估逻辑将消息内容与当前状态对照所有步骤中定义的条件进行检查。  
   c. 若满足某个新步骤的条件，则通过 `OrchestrationStateManager.setActiveStep` 更新会话状态。  
3. **确定可用工具集合：**
   a. 系统从 `OrchestrationState` 中得到 `activeStep`。  
   b. 从该步骤配置中读取 `availableTools`（允许/禁止列表）。  
   c. 先基于 `availableTools` 做第一轮过滤。  
   d. 对过滤后的结果调用 `StepSequencer.filterToolsBySequence`；若当前步骤存在活动序列，会进一步收窄工具列表（常见情况只剩一个工具）。  
   e. 将最终工具列表提供给 LLM。  
4. **执行工具：**
   a. LLM 从提供的工具列表中选择并调用工具。  
   b. 工具执行完成。  
5. **工具调用后的处理：**
   a. `OrchestrationStateManager.addUsedTool` 记录该次工具使用。  
   b. 若步骤序列处于活动状态，调用 `StepSequencer.processTool`，可能推进 `sequenceIndex`。  
   c. 条件评估逻辑可能再次运行，以检查“工具使用”是否触发步骤切换。  

## Benefits

 - **引导式工作流：** 确保智能体在复杂任务中遵循指定流程。
 - **更高可靠性：** 防止智能体使用不恰当工具或陷入卡死。
 - **更聚焦的交互：** 限制 LLM 可选项，有助于提高回复质量并降低幻觉风险。
 - **有状态控制：** 能根据会话历史与上下文动态调整行为。

## Integration Points

 - **会话管理：** 编排依赖会话状态的隔离与管理。
 - **智能体配置：** 通过智能体模板定义。
 - **LLM 交互：** 控制呈现给 LLM 的工具集合。