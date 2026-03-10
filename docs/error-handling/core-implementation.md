# AgentDock Core 错误处理（实现细节）

本文档描述 `agentdock-core` 库内部的错误处理架构与实现要点。

## 错误分类

AgentDock Core 定义了一套标准错误分类，用于统一组织与处理各类异常：

- **API Errors**：与提供商 API 通信相关的问题  
- **Authentication Errors**：API Key/凭据相关问题  
- **Validation Errors**：输入或参数不合法  
- **Resource Errors**：资源不可用或受到限制（配额、上下文窗口等）  
- **System Errors**：Core 内部的非预期故障

## 核心错误类

Core 提供了一组标准化错误类（以下为概念示意，不代表真实实现一字不差）：

```typescript
// Example of the error types (conceptual, not actual implementation)
class AgentError extends Error { /* Base error class */ }
class APIError extends AgentError { /* API-related errors */ }
class ValidationError extends AgentError { /* Input validation errors */ }
```

## 提供商错误处理

`agentdock-core` 的关键目标之一是：对不同 LLM 提供商的错误进行一致化处理：

1. **提供商模式识别（Provider Pattern Detection）**
   - 不同提供商的错误格式各不相同；  
   - Core 会将这些差异映射为统一模式；  
   - 识别方式通常结合字符串匹配与错误码。

2. **错误归一化（Error Normalization）**
   - 将提供商错误转换为一致的结构；  
   - 错误信息尽量转为用户可理解的表达；  
   - 状态码与错误类型标准化。

3. **错误上下文保留（Error Context Preservation）**
   - 在需要调试时保留原始错误细节；  
   - 保持错误堆栈（stack trace）；  
   - 在必要情况下提供提供商特有信息。

## 错误响应格式

归一化后的错误通常遵循如下结构：

```typescript
{
  error: string;        // 人类可读的错误信息
  code: string;         // 标准错误码（例如 "LLM_API_KEY_ERROR"）
  status: number;       // 对应的 HTTP 状态码
  provider?: string;    // 产生错误的提供商（如适用）
  details?: unknown;    // 额外细节（如可用）
}
```

## 在应用中使用错误系统

依赖 `agentdock-core` 的应用可以这样使用这套错误系统：

1. **识别错误类型**
   ```typescript
   try {
     // Use agentdock-core functionality
   } catch (error) {
     if (error instanceof APIError && error.code === "LLM_API_KEY_ERROR") {
       // Handle API key errors
     }
   }
   ```

2. **错误事件（Error Events）**
   - Core 可以发出错误事件供应用层监听；  
   - 为日志、监控与用户反馈提供钩子。

## 与日志系统的集成

错误处理与 Core 的日志系统集成，通常具备：

1. 按合适的日志级别自动记录错误；  
2. 自动脱敏错误中的敏感信息；  
3. 记录足够的上下文信息以便排查。