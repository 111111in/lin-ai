# 条件跳转

本文介绍 AgentDock 如何基于已定义的条件，在不同编排步骤之间进行切换。

## Core Concept

条件跳转允许智能体的行为（更具体地说：当前激活步骤 `activeStep`，以及随之变化的“可用工具集合”）根据当前会话中智能体的历史行为动态变化。

## Configuration

条件定义在智能体编排配置（`template.json`）的每个步骤中：

```json
{
  "name": "post_analysis_step",
  "description": "Activate after the 'think' tool has been used.",
  "conditions": [
    {
      "type": "tool_used",
      "value": "think"
    }
  ],
  "availableTools": {
    "allowed": ["summarize", "save_result"]
  }
}
```

- 每个步骤都可以包含一个 `conditions` 数组。
- 只有当数组中的条件**同时全部满足**（逻辑 AND）时，该步骤才会被激活。
- 每个条件对象包含 `type` 与 `value` 字段。

## Implemented Condition Types

当前 `agentdock-core` 已实现的条件类型包括：

- **`tool_used`**：检查 `value` 指定的工具名是否出现在会话的 `recentlyUsedTools` 列表的任意位置。
  - 示例：`{ "type": "tool_used", "value": "search" }`
- **`sequence_match`**：检查 `recentlyUsedTools` 列表的**末尾**是否与当前评估步骤配置的 `sequence` 数组完全一致。适用于“只有当一组工具按顺序执行完成后才激活某步骤”的场景。
  - 不使用 `value` 字段。
  - 示例：`{ "type": "sequence_match" }`（用于定义了 `sequence` 的步骤上）

## Implementation (`OrchestrationManager`)

条件评估逻辑位于 `OrchestrationManager`（`agentdock-core/src/orchestration/index.ts`）中。

### Key Logic:

- **状态访问：** 条件评估需要访问会话当前 `OrchestrationState`（来自 `OrchestrationStateManager`），尤其是 `recentlyUsedTools` 列表。
- **评估流程：**
  1. 通常在处理新用户消息的开始阶段触发（在确定本轮 LLM 可用工具之前）。
  2. **额外地**，现在在工具使用事件处理完成后（`processToolUsage`）也会立刻触发一次评估，确保基于“完成序列”的步骤切换能在同一轮内发生。
  3. 遍历编排配置中定义的全部步骤。
  4. 对每个步骤，将其 `conditions`（如 `tool_used`、`sequence_match`）与当前状态进行逐项判断。
  5. 若某步骤的条件**全部通过**，则该步骤成为可被激活的候选项。
- **步骤激活：**
  - 如果有一个或多个步骤满足条件，会通过策略选择最终激活步骤（通常是“配置顺序中第一个命中的步骤”）。
  - 调用 `OrchestrationStateManager.setActiveStep` 将新激活步骤名写入会话状态。
  - 若没有任何步骤满足条件，系统可能回退到默认步骤，或维持当前 `activeStep`。

## How it Works (Example Flow)

1. **初始状态：** 会话开始，可能处于默认 “general” 步骤；`recentlyUsedTools` 为空。
2. **用户动作 / LLM 行为：** 智能体使用了 `think` 工具。
3. **状态更新：** 调用 `OrchestrationStateManager.addUsedTool(sessionId, "think")`，此时 `recentlyUsedTools` 变为 `["think"]`。
4. **下一次交互前的条件检查：** 在下一次 LLM 调用前，`OrchestrationManager` 会评估条件：
   - 步骤 “general”（默认）→ 可能仍是候选；
   - 步骤 “post_analysis_step”（条件 `tool_used: "think"`）→ 在 `recentlyUsedTools` 中命中，通过。
5. **步骤激活：** 因为 “post_analysis_step” 条件通过，它被设为激活步骤，调用 `OrchestrationStateManager.setActiveStep(sessionId, "post_analysis_step")`。
6. **工具可用性：** 下一轮 LLM 请求工具时，系统只会提供 “post_analysis_step” 允许的工具（例如 `summarize`、`save_result`）。

## Multi-Agent Relevance

在规划中的多智能体协作模型 [Orchestration-Driven Personas](./../roadmap/multi-agent-collaboration.md) 中：

- `tool_used` 条件可以触发不同 persona/步骤之间的切换。
- 例如当 “Researcher”（步骤）使用了 `web_search` 与 `summarize` 后，可以用 `tool_used: summarize` 激活 “Planner”（步骤）来处理总结内容。

## Considerations

 - **条件类型有限：** 当前实现支持 `tool_used` 与 `sequence_match`。若要扩展更多条件（例如基于消息内容、基于状态值等），需要在 `OrchestrationManager` 的 `checkCondition` 逻辑中增加分支。
 - **条件顺序：** 若多个步骤依赖相似条件，配置中的步骤顺序会影响最终激活哪个步骤（一般先匹配者优先）。
 - **强依赖状态：** 条件高度依赖准确的会话状态（`activeStep`、`recentlyUsedTools` 等）。
 - **对模型智能的依赖：** 随着前沿 LLM 越来越擅长理解上下文与遵循复杂指令，过度刚性的约束（大量复杂条件、过严的序列）可能不再必要，甚至可能适得其反。未来可以探索在“显式编排规则”和“利用模型内在规划/推理能力”之间取得平衡，以在保持可靠性的同时简化配置。

下面是一个概念性的“基于消息内容触发步骤切换”的例子（该文件前文未列为当前已实现条件类型，仅用于说明思路）：

1. **初始状态：** 会话开始，没有明确激活步骤（或处于默认步骤）。
2. **用户消息：** 用户发送：“Okay, let's plan the project structure.”
3. **条件检查：** 编排系统评估各步骤条件：
   - 步骤 “research”（`message_contains: "research"`）→ 不通过；
   - 步骤 “planning_mode”（`message_contains: "plan"`）→ 通过；
   - 步骤 “planning_mode”（`not_recently_used: "web_search"`，`window: 3`）→ 通过（假设最近没用过 `web_search`）。
4. **步骤激活：** “planning_mode” 条件通过，被设为激活步骤：`OrchestrationStateManager.setActiveStep(sessionId, "planning_mode")`。
5. **工具可用性：** 下一轮 LLM 请求工具时，系统只提供 “planning_mode” 允许的工具（例如 `think`、`list_generation`）。
6. **继续交互：** 若用户随后说 “research caching strategies”，条件可能再次评估并激活 “research” 步骤，改变可用工具集合。

## 进一步注意事项

- **条件顺序：** 当多个步骤可能同时满足条件时，配置顺序很重要（通常“第一个匹配者获胜”）。
- **特异性：** 条件应足够具体以避免误触发，但也要足够通用以覆盖用户意图。
- **复杂度：** 过多步骤或过复杂条件会使智能体行为更难预测与调试。
- **状态一致性：** 条件依赖准确的会话状态（`activeStep`、`recentlyUsedTools`）。 