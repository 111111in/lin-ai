# AgentDock 中的流式响应（Response Streaming）

AgentDock 的流式响应系统在 Vercel AI SDK 之上进行了扩展，  
为**编排、错误处理与状态管理**提供了更强大的能力。

## `AgentDockStreamResult`

AgentDock 流式能力的核心是 `AgentDockStreamResult` 接口，  
它在 Vercel AI SDK 的 `StreamTextResult` 基础上进行了增强：

```typescript
export interface AgentDockStreamResult<T extends ToolSet = ToolSet, R = unknown>
  extends VercelStreamTextResult<T, R> {
  _orchestrationState?: {
    recentlyUsedTools?: string[];
    cumulativeTokenUsage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
    [key: string]: unknown;
  } | null;
  
  _hasStreamingError?: boolean;
  _streamingErrorMessage?: string;
}
```

### 关键增强点

1. **编排状态追踪（Orchestration State Tracking）**  
   - 记录最近使用过的工具列表；  
   - 按会话维度累计统计 token 使用量；  
   - 支持扩展任意自定义状态字段。  

2. **强化错误处理（Enhanced Error Handling）**  
   - 通过布尔标记标识流式过程是否出现错误；  
   - 保留错误信息，便于前端或上层代码处理；  
   - 对 `toDataStreamResponse` 做了覆盖，以确保错误信息在流式响应中被正确传递。  

3. **向后兼容（Backward Compatibility）**  
   - 提供与原有 `StreamTextResult` 的类型别名，保持既有调用方式不变；  
   - 保持与 Vercel AI SDK 一致的使用体验。

## 与 `LLMOrchestrationService` 的集成

`AgentDockStreamResult` 主要由 `LLMOrchestrationService.streamWithOrchestration` 返回，该方法会：

1. 对 `CoreLLM.streamText` 进行封装；  
2. 注入与编排相关的回调（如状态更新钩子）；  
3. 在会话状态中更新 token 使用量；  
4. 记录工具使用情况，为后续请求提供上下文。

## 在 `AgentNode` 中的使用方式

`AgentNode` 的 `handleMessage` 方法直接返回 `AgentDockStreamResult`，这带来：

1. 客户端可以按原样消费流；  
2. 适配层 / API 路由可以在更高层统一处理错误；  
3. 对于复杂流程，可在流对象中读取编排状态做进一步控制或监控。

## 带来的收益

- **更高可靠性**：  
  错误链路更清晰，便于快速定位问题。  
- **更好的状态管理**：  
  token 与工具使用情况被自动追踪，不需要在业务层重复实现。  
- **无缝集成**：  
  在保持与 Vercel AI SDK 一致用法的前提下，提供额外的编排与诊断能力。

关于 `AgentNode` 的更多实现细节，可参考：[Agent 节点文档](../agent-node.md)。 