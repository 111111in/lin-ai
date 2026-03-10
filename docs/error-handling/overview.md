# AgentDock 的错误处理

本文档概述 AgentDock 在应用层的错误处理方式：主要通过 React 的 `ErrorBoundary` 组件与一组专用错误处理器，提供一致、可恢复、面向用户的错误体验。

## 核心组件

### `ErrorBoundary`

我们在 `src/components/error-boundary.tsx` 中实现了一个完善的 `ErrorBoundary`，用于在整个应用中提供稳健的错误处理能力。它主要负责：

1. 捕获并处理 React 组件树中的运行时错误；  
2. 在全站提供一致的错误 UI 体验；  
3. 对不同错误类型做专门处理（`NetworkError`、`SecurityError`、`ValidationError`、`StorageError` 等）；  
4. 在开发模式下展示更详细的错误信息；  
5. 在可能的情况下提供重试能力，帮助用户从错误中恢复。

### `ChatErrorOverlay`

在聊天界面中处理运行时错误时，我们使用 `src/components/chat/chat-error-overlay.tsx` 中的 `ChatErrorOverlay` 组件。它主要负责：

1. 针对聊天相关错误展示更友好的提示；  
2. 按标准错误类型分类展示（安全 / 网络 / 校验 / 存储等）；  
3. 根据错误类型提供恰当的恢复动作（重试、跳转设置、清理缓存等）；  
4. 与整体错误处理架构保持一致。

## 与 Vercel AI SDK 的集成

我们与 Vercel AI SDK 的错误处理机制集成，确保来自 LLM 提供商的错误可以被正确传递到 UI 层并展示给用户：

### Agent Adapter 的错误处理

`src/lib/agent-adapter.ts` 中的 agent adapter 会增强 stream result，使其能够正确处理流式错误：

```typescript
// In agent-adapter.ts
const enhancedResult = {
  ...result,
  toDataStreamResponse(options = {}) {
    return result.toDataStreamResponse({
      ...options,
      getErrorMessage: (error: unknown) => {
        // Extract streaming error message
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

该方式的要点：

1. 使用 Vercel 推荐的 `getErrorMessage` 模式；  
2. 从 CoreLLM 的增强字段中提取更细致的错误信息；  
3. 保证 UI 侧错误展示一致。

### 错误流转架构

错误处理采用分层架构：

1. **CoreLLM**：检测流式错误并写入错误标记；  
2. **Agent Adapter**：将错误转换为 Vercel AI SDK 需要的格式；  
3. **API Route**：不做额外改动，直接透传增强后的结果；  
4. **客户端组件**：展示对用户友好的错误信息与操作指引。

更详细说明请见：[LLM 错误处理](./llm-errors.md)。

## 错误分类

AgentDock 会把错误归类为以下标准类型：

| 分类 | 描述 | 示例 |
|------|------|------|
| Security | 权限与认证问题 | 缺少 API Key、凭据无效 |
| Network | API 与网络连接问题 | 触发限流、服务不可用 |
| Validation | 输入校验失败 | 入参不合法、上下文窗口超限 |
| Storage | 本地存储访问问题 | 无法访问安全存储 |
| Unknown | 兜底类型 | 未预期异常 |
| LLM | 模型相关错误 | 配额耗尽、模型不可用 |

## 使用 `ErrorBoundary`

在实现需要错误处理的新功能时，可以这样使用：

```tsx
import { ErrorBoundary } from "@/components/error-boundary";

// Basic usage
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// With custom fallback UI
<ErrorBoundary
  fallback={<YourCustomErrorComponent />}
>
  <YourComponent />
</ErrorBoundary>

// With error callback
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Log or handle the error
    console.error("Component error:", error);
  }}
  resetOnPropsChange={true}
>
  <YourComponent />
</ErrorBoundary>
```

## 使用 `ChatErrorOverlay`

在聊天界面中处理 API 错误时，可以这样使用：

```tsx
import { ChatErrorOverlay } from "@/components/chat/chat-error-overlay";

// Basic usage within chat components
<ChatErrorOverlay 
  error={error}
  onRetry={handleRetry}
  onDismiss={clearError}
  open={!!error}
/>
```

## 最佳实践

1. 在特性模块的顶层用 `ErrorBoundary` 包裹；  
2. 抛错时使用明确的错误类型，便于 UI 做精细化处理；  
3. 对需要“换参数就重试”的组件，可考虑 `resetOnPropsChange`；  
4. 错误信息要可读、可操作，帮助用户理解并自助解决；  
5. 聊天界面的运行时 API 错误用 `ChatErrorOverlay` 展示；  
6. 分类时遵循既定错误分类体系；  
7. 确保所有错误提示对用户友好且可行动；  
8. LLM 错误遵循 Vercel AI SDK 的处理模式；  
9. 将错误处理放在合适的层（通常在 adapter，而不是 API route）。

## 专项错误处理

`ErrorBoundary` 会针对不同错误类型提供专项处理：

### 网络错误（Network）
- 展示网络连通性相关信息  
- 提供刷新/重试选项  
- 给出排查建议

### 安全错误（Security）
- 处理权限与认证相关问题  
- 给出明确的修复指引

### 校验错误（Validation）
- 展示校验失败的详细信息  
- 指导如何修复输入

### 存储错误（Storage）
- 处理浏览器存储相关问题  
- 建议清理缓存或更换浏览器

### LLM 错误（LLM）
- 展示来自 LLM 提供商的更具体错误信息  
- 区分配额、限流等常见原因  
- 提供对应的恢复动作

## API 错误处理

对于 API 错误（尤其是聊天界面）：

1. 后端使用标准化错误系统（如 `parseProviderError` / `normalizeError`）；  
2. 聊天组件通过 `ChatErrorOverlay` 展示错误；  
3. 按分类展示并提供对应操作；  
4. 流式错误通过 Vercel AI SDK 机制处理；  
5. 开发模式下会展示更多调试信息。

## 后续规划

### 1. 错误追踪与分析
- 接入错误追踪服务  
- 增加匿名错误上报以改进产品  
- 为管理员提供错误仪表盘

### 2. 更强的恢复策略
- 更智能的重试策略  
- 对外部服务增加熔断机制  
- 提供更多用户可控的恢复选项

### 3. 上下文感知的错误边界
- 为不同区域提供专用 ErrorBoundary  
- 基于组件类型做上下文感知处理  
- 为特定错误添加定制化恢复策略