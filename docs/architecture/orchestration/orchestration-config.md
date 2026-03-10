# 编排配置

本文介绍如何通过智能体模板（`template.json` 或类似文件）为 AgentDock 智能体配置编排（Orchestration）行为。

## Structure

编排配置位于智能体主配置的顶层 `orchestration` 字段下：

```json
{
  "id": "research-planner",
  "name": "Research and Planning Agent",
  "description": "An agent that performs research and planning.",
  "llm": {
    "provider": "openai",
    "model": "gpt-4-turbo"
  },
  "tools": ["web_search", "think", "list_generation"],
  "orchestration": {
    "description": "Manages transitions between research and planning modes.",
    "defaultStep": "idle",
    "steps": [
      // Step definitions go here...
    ]
  }
}
```

- `orchestration`：包含所有编排设置的主对象。
- `description`：可选，编排工作流的说明。
- `defaultStep`：可选，当没有任何步骤满足激活条件时要启用的步骤名。若省略，智能体可能在初始时没有明确的激活步骤，或回退为允许所有已配置工具。
- `steps`：编排步骤对象数组。

## Step Definition

`steps` 数组中的每个对象都定义了一个编排步骤：

```json
{
  "name": "research_mode",
  "description": "Step for active research using web search.",
  "conditions": [
    {
      "type": "tool_used",
      "value": "search"
    },
    {
      "type": "sequence_match"
    }
  ],
  "availableTools": {
    "allowed": ["web_search", "think", "*cognitive*"],
    "denied": []
  },
  "sequence": [
    "web_search",
    "think"
  ],
  "resetSequenceOn": ["message_contains"]
}
```

### 步骤的核心属性

- `name`（必填）：步骤的唯一标识字符串（例如 `research_mode`、`planning`、`code_review`）。
- `description`（可选）：步骤用途的人类可读说明。

### `conditions` (Array, Optional)

一个条件对象数组。要让该步骤被激活，数组中的条件必须**全部**满足（逻辑 AND）。

- 数组中的每个对象代表一个条件。
- 如果省略该数组或数组为空，则该步骤没有激活条件（除非它被用作默认步骤等特殊情况）。

#### Condition Object

```json
{
  "type": "tool_used" | "sequence_match",
  "value": "string (required for type='tool_used', unused for type='sequence_match')",
  "description": "string (optional)"
}
```

- `type`（字符串，必填）：条件类型。当前支持：
  - `tool_used`：检查 `value` 指定的工具名是否存在于会话的 `recentlyUsedTools` 历史中。
  - `sequence_match`：检查 `recentlyUsedTools` 的末尾是否与该步骤定义的 `sequence` 完全匹配。
- `value`（字符串，条件必填）：与条件相关的值。
  - 当 `type` 为 `tool_used` 时**必填**（表示工具名）。
  - 当 `type` 为 `sequence_match` 时**不使用**（应省略）。
- `description`（字符串，可选）：条件用途的说明。

### `availableTools`

- （可选）用于控制该步骤激活时可访问哪些工具。
- `allowed`：允许的工具名或通配符数组（例如 `*cognitive*`）。
- `denied`：显式禁止的工具名或通配符数组（即使同时命中 `allowed` 也会被禁止）。
- **行为规则：**
  - 若省略 `availableTools`，则默认允许该智能体配置的全部工具。
  - 若仅提供 `allowed`，则只允许这些工具。
  - 若仅提供 `denied`，则允许除 `denied` 之外的所有工具。
  - 若同时提供 `allowed` 与 `denied`，则工具需命中 `allowed` 且不命中 `denied` 才可用。

### `sequence` (Array, Optional)

- 一个工具名数组，定义该步骤中工具必须按顺序执行。
- 当带 `sequence` 的步骤处于激活状态时，`StepSequencer` 通常会将可用工具限制为序列中的**下一个**必需工具。
- 序列中出现的工具一般也应被该步骤的 `availableTools` 配置允许。
- 更多细节见 [步骤编排（序列）](./step-sequencing.md)。