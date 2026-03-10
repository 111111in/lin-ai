# LLM 错误处理

本文档说明我们如何处理来自各类 LLM 提供商的错误，并将其以清晰、可操作的方式呈现给用户。

## 总览

我们的错误处理系统会对不同提供商的错误进行捕获与归一化，把底层技术性 API 错误转换成统一、易理解的提示信息。

## 错误流转架构

错误处理采用分层架构：

### 1. CoreLLM（检测层）
- 在 `agentdock-core/src/llm/core-llm.ts` 中检测流式过程中的错误；  
- 设置错误标记：`_hasStreamingError` 与 `_streamingErrorMessage`；  
- 将错误码等元信息附加到 stream result 上。

### 2. Agent Adapter（转换层）
- 位于 `src/lib/agent-adapter.ts`；  
- 使用 Vercel AI SDK 推荐的模式增强 stream result；  
- 通过 `getErrorMessage` 从 CoreLLM 的增强字段中提取更详细错误；  
- 将错误格式化为适合客户端展示的形式。

### 3. API Route（传输层）
- 对已增强的结果做简单透传；  
- 对非流式错误使用标准错误响应格式返回。

### 4. 客户端组件（展示层）
- 展示来自错误处理链路的用户友好提示；  
- 根据错误类型提供相应操作（重试、跳转设置、等待等）。

## 实现细节

### CoreLLM 错误检测
```typescript
// In agentdock-core/src/llm/core-llm.ts
const enhancedResult: StreamTextResult<any, any> = {
  ...streamResult,
  _hasStreamingError: false,
  _streamingErrorMessage: '',
  
  // When streaming errors are detected
  if (part.type === 'error') {
    enhancedResult._hasStreamingError = true;
    enhancedResult._streamingErrorMessage = parsedError.message;
  }
};
```

### Agent Adapter 错误转换
```typescript
// In src/lib/agent-adapter.ts
const enhancedResult = {
  ...result,
  toDataStreamResponse(options = {}) {
    return result.toDataStreamResponse({
      ...options,
      getErrorMessage: (error: unknown) => {
        // Extract streaming error message from CoreLLM
        if (error && typeof error === 'object' && '_hasStreamingError' in error) {
          const streamError = error as any;
          if (streamError._streamingErrorMessage) {
            return streamError._streamingErrorMessage;
          }
        }
        
        // Standard error handling
        if (error instanceof Error) {
          return error.message;
        }
        
        return typeof error === 'string' ? error : 'Unknown error occurred';
      }
    });
  }
};
```

## 错误分类

LLM 错误会被归类为以下类型：

| 分类 | 描述 | 示例 |
|------|------|------|
| API Key Errors | API Key 缺失/无效 | 未提供 key、key 格式无效 |
| Rate Limit Errors | 触发限流 | 请求过多、达到使用上限 |
| Context Window Errors | 上下文窗口限制 | 消息过长，超过模型上下文窗口 |
| Service Availability | 服务不可用 | 提供商宕机、维护中 |
| Network Errors | 网络连接问题 | 超时、网络失败 |
| Quota Errors | 配额耗尽 | “You exceeded your current quota” |

## 用户体验

发生错误时，用户会看到：

1. **清晰的错误信息**：把技术细节翻译成可理解的语言；  
2. **可操作的指引**：告诉用户如何解决问题；  
3. **相关操作入口**：UI 根据错误类型提供对应的操作按钮/链接。

### API Key 错误

对于 API Key 相关问题，系统会：
- 明确提示需要 API Key；  
- 提供直达设置页的入口；  
- 在适用时说明需要配置哪些环境变量。

### 限流错误（Rate Limit）

触发限流时，系统会：
- 告知已达到使用限制；  
- 建议稍后再试；  
- 在合适情况下提供重试操作。

### 服务与网络错误

对于连接类问题：
- 区分临时故障与持续故障；  
- 对临时故障提供重试；  
- 对持续故障提供排查建议。

## BYOK 模式注意事项

在 BYOK（Bring Your Own Keys）模式下：
- 错误信息会强调需要用户自行提供 API Key；  
- 当窗口重新获得焦点时，系统会检查 key 是否已配置；  
- 通过清晰指引引导用户到设置页完成 key 管理。