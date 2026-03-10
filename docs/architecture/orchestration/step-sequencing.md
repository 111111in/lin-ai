# 步骤编排（序列）

本文介绍 AgentDock 如何在编排步骤中强制执行“工具序列”，确保结构化任务中工具按预期顺序被使用。

## Core Concept

某些编排步骤要求工具按固定顺序执行。例如一个研究任务可能需要：
1.  `web_search`
2.  `think` (to analyze results)
3.  `summarize` (to condense findings)

“序列”能力会确保智能体遵循上述规定顺序。

## Configuration

序列在智能体模板中某个编排步骤的配置里定义：

```json
{
  "name": "structured_research",
  "description": "Perform research following a specific sequence.",
  "availableTools": {
    "allowed": ["web_search", "think", "summarize", "*cognitive*"]
  },
  "sequence": [
    "web_search",
    "think",
    "summarize"
  ]
}
```

- `sequence` 数组按顺序列出工具名。
- 序列中列出的工具也必须在该步骤的 `availableTools` 中可用（直接列出或通过通配符命中）。

## Implementation (`StepSequencer`)

`StepSequencer` 类（`agentdock-core/src/orchestration/sequencer.ts`）负责管理序列逻辑。

### Key Features:

- **状态依赖：** 依赖 `OrchestrationStateManager` 在当前会话的 `OrchestrationState` 中读写 `sequenceIndex`。
- **序列跟踪：**
  - `hasActiveSequence(step, sessionId)`：检查步骤是否定义了序列，以及当前 `sequenceIndex` 是否仍在序列边界内。
  - `getCurrentSequenceTool(step, sessionId)`：返回当前 `sequenceIndex` 所期望的工具名。
  - `advanceSequence(step, sessionId)`：将会话 `OrchestrationState` 中的 `sequenceIndex` 递增。
- **工具处理：**
  - `processTool(step, sessionId, usedTool)`：当某工具被使用时调用。它会检查 `usedTool` 是否与 `getCurrentSequenceTool` 一致；若一致则调用 `advanceSequence` 推进序列，否则记录告警日志。
- **工具过滤：**
  - `filterToolsBySequence(step, sessionId, allToolIds)`：核心强制机制。如果该步骤存在活动序列，会取 `getCurrentSequenceTool`；若该工具存在于 `allToolIds`（该步骤一般允许的工具集合）中，则只返回该工具名。否则（序列完成、或期望工具不可用）会根据具体逻辑返回全部工具或空数组（当前描述：如果期望工具不可用会返回 `[]`，这会在配置不一致时直接阻断推进）。

## How it Works

1. **步骤激活：** 当带有 `sequence` 的编排步骤被激活时，`OrchestrationStateManager` 会确保会话状态中的 `sequenceIndex` 被初始化（通常为 0）。
2. **请求可用工具：** 当核心系统（例如 `AgentNode`）需要为 LLM 计算可用工具时：
   a. 确定当前激活步骤；  
   b. 基于该步骤 `availableTools` 配置得到“一般允许的工具集合”；  
   c. 调用 `StepSequencer.filterToolsBySequence(step, sessionId, allowedTools)`；  
   d. 若序列处于活动状态且期望工具可用，则 `filterToolsBySequence` 只返回该工具名；  
   e. LLM 只能看到当前序列步骤允许的单个工具。  
3. **执行工具：** LLM 调用该必需工具。
4. **推进序列：** 工具执行后，系统调用 `StepSequencer.processTool`：
   a. 若实际执行工具与期望工具一致，则 `processTool` 调用 `advanceSequence` 递增 `sequenceIndex`；  
   b. 若不一致（理论上过滤正确时不应发生，但防御性处理），会记录告警。  
5. **下一步：** 下一次交互重复上述流程，`filterToolsBySequence` 会基于更新后的 `sequenceIndex` 选择“下一工具”。
6. **序列完成：** 当 `sequenceIndex` 达到 `sequence` 长度后，`getCurrentSequenceTool` 返回 `null`，`filterToolsBySequence` 会允许该步骤“一般允许”的所有工具（或回退到默认行为）。

## Considerations

- **配置一致性：** `sequence` 中的工具必须在该步骤的 `availableTools` 中可用。
- **错误处理：** 当前实现会在序列被违反或期望工具不可用时记录告警；可以进一步扩展更强的错误处理或替代策略（例如重置序列）。
- **LLM 遵循性：** 该机制依赖 LLM 在序列活动时只使用被提供的单个工具。

## Sequence Concepts

### What is a Tool Sequence?

工具序列定义了一个必须按顺序使用的工具列表，从而形成引导式工作流，帮助智能体更有条理地完成复杂任务。

序列可用于：
- 强制采用更系统的方法解决问题；
- 引导智能体执行复杂工作流；
- 确保关键步骤不被跳过；
- 构建结构化推理模式。

### Sequence Representation

序列在步骤配置中用数组表示：

```json
"sequence": [
  "think",
  "web_search",
  "summarize"
]
```

该序列要求智能体：
1. 首先使用 `"think"`；
2. 然后使用 `"web_search"`；
3. 最后使用 `"summarize"`。

### Flexible Sequences

为了更灵活，序列的某些位置可以允许“工具组”：

```json
"sequence": [
  ["think", "reflect"],  // First position: either think OR reflect
  "web_search",          // Second position: web_search
  ["summarize", "save"]  // Third position: either summarize OR save
]
```

这样在保持整体结构不变的前提下，允许序列中出现多条合法路径。

## Sequence Enforcement Across Environments

系统中的一个关键改进是：序列强制在所有环境（包括 Serverless 部署）中表现一致。

### Always Enforced

过去，序列强制执行是“有条件启用”的：

```typescript
// Old approach - sequences were only enforced under certain conditions
if (!this.lightweight && activeStep.sequence?.length) {
  return this.sequencer.filterToolsBySequence(activeStep, sessionId, allToolIds);
}
```

现在，序列会始终被强制执行：

```typescript
// New approach - sequences are always enforced
if (activeStep.sequence?.length) {
  return this.sequencer.filterToolsBySequence(activeStep, sessionId, allToolIds);
}
```

### Why This Matters

这一变更确保：

1. **行为一致：** 智能体在所有环境下表现一致；
2. **结构化思考：** 例如 “critique → debate → reflect” 这样的步骤能被正确强制；
3. **序列可靠：** 用户可以相信序列会按设计工作；
4. **性能代价低：** 序列强制开销很小。

### Implementation Details

序列过滤工具的关键方法如下：

```typescript
public filterToolsBySequence(
  step: OrchestrationStep, 
  sessionId: SessionId, 
  allToolIds: string[]
): string[] {
  // If no active sequence, return all tools
  if (!this.hasActiveSequence(step, sessionId)) return allToolIds;
  
  const currentTool = this.getCurrentSequenceTool(step, sessionId);
  if (!currentTool) return allToolIds;
  
  // If current tool is available, only allow that tool
  if (allToolIds.includes(currentTool)) {
    return [currentTool];
  }
  
  // Current tool not available
  logger.warn(
    LogCategory.ORCHESTRATION,
    'StepSequencer',
    'Current sequence tool not available',
    {
      sessionId,
      step: step.name,
      currentTool
    }
  );
  
  return allToolIds;
}
```

这确保了：在序列推进之前，智能体只能使用当前序列位置对应的工具。

## Integration with Tool Filtering

编排管理器提供了一个获取允许工具的方法，将序列过滤与其它过滤机制整合在一起：

```typescript
public getAllowedTools(
  orchestration: OrchestrationConfig,
  messages: LLMMessage[],
  sessionId: SessionId,
  allToolIds: string[]
): string[] {
  // If no orchestration, return all tools
  if (!orchestration?.steps?.length) return allToolIds;
  
  // Get active step
  const activeStep = this.getActiveStep(orchestration, messages, sessionId);
  
  // If no active step, return all tools
  if (!activeStep) return allToolIds;
  
  // Apply sequence filtering regardless of environment
  if (activeStep.sequence?.length) {
    return this.sequencer.filterToolsBySequence(activeStep, sessionId, allToolIds);
  }
  
  // If step has explicitly allowed tools, filter by those
  if (activeStep.availableTools?.allowed && activeStep.availableTools.allowed.length > 0) {
    return allToolIds.filter(toolId => {
      return activeStep.availableTools?.allowed?.includes(toolId) || false;
    });
  }
  
  // If step has explicitly denied tools, filter those out
  if (activeStep.availableTools?.denied && activeStep.availableTools.denied.length > 0) {
    return allToolIds.filter(toolId => {
      return !activeStep.availableTools?.denied?.includes(toolId);
    });
  }
  
  // Default - return all tools
  return allToolIds;
}
```

## Sequence Processing

当工具被使用时，序列会相应推进：

```typescript
public processToolUsage(
  orchestration: OrchestrationConfig,
  messages: LLMMessage[],
  sessionId: SessionId,
  toolName: string
): void {
  // Get active step
  const activeStep = this.getActiveStep(orchestration, messages, sessionId);
  
  // Skip if no active step
  if (!activeStep) return;
  
  // Skip if no sequence defined
  if (!activeStep.sequence?.length) return;
  
  // Always process tool usage through the sequencer
  this.sequencer.processTool(activeStep, sessionId, toolName);
}
```

## User Experience

序列强制系统为用户带来一种“被引导的”体验：

1. **清晰：** 智能体能清楚表达当前处于序列的哪一步、在用什么工具；
2. **结构：** 复杂推理过程遵循一致模式；
3. **方法论：** 例如评估流程可遵循 “critique → debate → reflect”；
4. **完整性：** 避免智能体跳过推理过程中的重要步骤。

## Example: Evaluation Mode Sequence

一个实际例子是我们的认知推理智能体中的 Evaluation Mode（评估模式）序列强制：

```json
{
  "name": "EvaluationMode",
  "description": "Critical evaluation sequence",
  "conditions": [
    {
      "type": "message_regex",
      "value": "critique|evaluate|assess|review|analyze|opinion"
    }
  ],
  "sequence": [
    "critique",
    "debate",
    "reflect"
  ],
  "availableTools": {
    "allowed": ["critique", "debate", "reflect", "search"]
  }
}
```

这会强制一个三步评估流程：
1. 首先进行批判性分析（critique）；
2. 然后给出多视角讨论（debate）；
3. 最后沉淀洞察与原则（reflect）。

这种结构化方法确保无论部署环境如何，评估过程都足够完整一致。

## Deployment Considerations

### Serverless/Edge

在 Serverless 与 Edge 部署中：
- 序列强制表现一致；
- 必须在请求之间正确“回填/恢复”会话状态；
- 响应头中只传输最小必要状态信息。

### Long-Running Servers

在长驻进程的服务部署中：
- 完整的状态持久化提供无缝的序列跟踪；
- 内存管理防止序列状态无限增长；
- 清理机制避免状态泄漏。

## Best Practices

1. **序列尽量短：** 建议控制在 3-5 步以内；
2. **提供上下文：** 告诉用户当前正在遵循结构化序列；
3. **适度灵活：** 需要时可在序列位置允许多个工具；
4. **充分测试：** 确保序列在所有部署环境中都能正确工作。