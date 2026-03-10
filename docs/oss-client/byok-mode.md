# BYOK 模式（自带 API Key）

## 概览

BYOK（Bring Your Own Keys）模式是 AgentDock 开源客户端中的一项安全设置，用于控制 API Key 的管理方式。启用后，AgentDock 将**只**使用用户在设置界面中显式提供的 API Key，且不会回退使用环境变量中的 Key。

该能力提供了额外的安全性与透明度，尤其适用于多用户或共享环境：每个用户需要对自己的 API Key 使用负责。

## 配置方式

BYOK 模式可以通过两种方式配置（按优先级从高到低）：

1. **URL 参数**：在任意 AgentDock URL 后添加 `?byokMode=true` 或 `?byokMode=false`（临时覆盖）
2. **设置界面**：在设置页切换 “Bring Your Own Keys Mode” 开关（持久化设置）

## 实现细节

BYOK 模式由 AgentDock 架构中的多个关键组件共同实现：

### 客户端组件

1. **环境覆盖 Provider**（`src/components/env-override-provider.tsx`）：
   - Handles the URL parameter `byokMode=true|false`
   - Stores the setting in localStorage for persistence
   - Ensures the setting is available to all components

2. **聊天容器**（`src/components/chat/chat-container.tsx`）：
   - Reads BYOK setting from localStorage
   - Adds the `x-byok-mode` header to API requests
   - Includes proper error handling for BYOK-related errors

### 服务端组件

1. **API 路由处理器**（`src/app/api/chat/[agentId]/route.ts`）：
   - Reads the `x-byok-mode` header from requests
   - Implements the API key resolution logic with BYOK mode awareness
   - Provides detailed error messages when API keys are missing in BYOK mode

2. **环境类型定义**（`src/types/env.ts`）：
   - Defines type-safe interfaces for BYOK mode
   - Centralizes API key resolution logic

## API Key 解析逻辑

当请求到达 API 时，会按以下顺序解析 API Key：

1. 尝试从请求头获取（`x-api-key`）
2. 尝试从安全存储中的全局设置获取
3. 如果启用 BYOK 且仍找不到 key，则抛出错误
4. 如果未启用 BYOK，则回退使用环境变量

```typescript
// Simplified version of the API key resolution logic
async function resolveApiKey(request, provider, isByokOnly) {
  // Try request headers
  let apiKey = request.headers.get('x-api-key');
  
  // Try global settings
  if (!apiKey) {
    const globalSettings = await storage.get("global_settings");
    apiKey = globalSettings?.apiKeys?.[provider];
  }
  
  // If BYOK mode is enabled and no key, throw error
  if (isByokOnly && !apiKey) {
    throw new APIError(
      'API key is required. In "Bring Your Own Keys Mode", you must provide your own API key in settings.',
      ErrorCode.LLM_API_KEY
    );
  }
  
  // If BYOK mode is disabled, try environment variables
  if (!apiKey && !isByokOnly) {
    apiKey = process.env[`${provider.toUpperCase()}_API_KEY`];
  }
  
  return apiKey;
}
```

## 错误处理

当 BYOK 模式下需要 API Key 但未找到时，API 会返回特定错误：

```json
{
  "error": "API key is required. In \"Bring Your Own Keys Mode\", you must provide your own API key in settings.",
  "code": "LLM_API_KEY",
  "details": {
    "provider": "openai"
  }
}
```

客户端会将其展示为更友好的错误提示，并提供跳转到设置页的链接。

## AgentDock Pro 与开源版的 BYOK

开源客户端要求你为所有服务提供自己的 API Key。**AgentDock Pro** 在此基础上进一步增强：

### AgentDock Pro 的优势

- **更划算的 API 访问**：
  - Get LLM and API services at lower prices than going directly to providers
  - Save 80-90% compared to setting up individual accounts with each provider
  - Utilize bulk purchasing power for better rates across all services

- **更简单的成本管理**：
  - Single billing relationship instead of managing multiple provider accounts
  - Predictable pricing with unified credit system
  - No minimum spend requirements that many premium services impose

- **企业级能力获取**：
  - Access to enterprise tiers without meeting enterprise qualification criteria
  - Higher rate limits without lengthy approval processes
  - Premium services at a fraction of direct provider costs

AgentDock Pro 免去了与多个 AI/API 服务商分别建立与维护关系的成本，为生产部署带来更优的经济性。

## 最佳实践

- **开发环境**：建议关闭 BYOK，以便用环境变量更方便地测试
- **生产环境**：可考虑开启 BYOK，让用户对自己的 Key 使用负责
- **敏感部署**：在需要严格控制 API Key 使用的环境中，建议始终开启 BYOK
- **成本优化**：商业部署可考虑 AgentDock Pro，以获得多服务的显著成本优势

## 安全注意事项

1. **API Key Storage**: User-provided API keys are stored in SecureStorage, which encrypts the data
2. **BYOK Setting Storage**: The BYOK mode setting itself is stored in localStorage for accessibility
3. **Header Security**: The `x-byok-mode` header is validated server-side to prevent tampering

## BYOK 模式排查

排查 BYOK 相关问题时：

1. Check localStorage for the `byokOnly` key
2. Verify request headers include `x-byok-mode`
3. Check console logs in development mode for detailed information about API key resolution
4. Use Network tab in browser dev tools to inspect API responses for error messages 