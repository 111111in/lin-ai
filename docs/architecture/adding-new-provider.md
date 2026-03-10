# 新增一个 LLM 提供商

本文档介绍如何在 AgentDock Core 中**接入新的 LLM 提供商**。

## 总览

AgentDock Core 基于 Vercel AI SDK（示例版本 4.2.0）实现了一套统一的 LLM 封装。  
框架通过标准化接口和消息转换工具，确保内部消息格式与 AI SDK 保持兼容。

接入一个新的提供商大致需要以下步骤：

1. 增加该提供商专用的配置类型；  
2. 编写对应的模型创建函数；  
3. 更新提供商注册表；  
4. 更新 `createLLM` 工厂函数；  
5. 为新提供商编写测试并验证集成。

## 第一步：增加提供商配置类型

首先，在 `src/llm/types.ts` 中为新提供商添加配置类型：

```typescript
// 向 LLMProvider 中添加新的提供商
export type LLMProvider = 'anthropic' | 'openai' | 'gemini' | 'deepseek' | 'groq' | 'your-provider';

// 新增提供商专用配置
export interface YourProviderConfig extends LLMConfig {
  // 这里加入你的自定义配置字段
  someProviderSpecificOption?: boolean;
}

// 更新 ProviderConfig 联合类型
export type ProviderConfig =
  | AnthropicConfig
  | OpenAIConfig
  | GeminiConfig
  | DeepSeekConfig
  | GroqConfig
  | YourProviderConfig;
```

## 第二步：添加提供商 SDK 依赖

在 `package.json` 中引入新提供商的 SDK。如果有官方 AI SDK 集成，优先使用；否则使用原生 SDK 并自己写适配层：

```json
{
  "dependencies": {
    "@ai-sdk/anthropic": "^1.0.7",
    "@ai-sdk/google": "^1.1.26",
    "@ai-sdk/openai": "^1.0.14",
    "@ai-sdk/groq": "^1.0.0",

    "@ai-sdk/your-provider": "^1.0.0",
    "your-provider-sdk": "^1.0.0"
  }
}
```

> 提示：部分提供商（例如 DeepSeek）支持 OpenAI 兼容 API，这种情况下可以直接复用 OpenAI SDK，只需配置自定义 `baseURL`。

## 第三步：创建模型构造函数

在 `src/llm/model-utils.ts` 中为新提供商新增一个模型创建函数。若有 AI SDK 集成，可按如下方式实现：

```typescript
import { YourProvider } from '@ai-sdk/your-provider';
// 或者使用原生 SDK
// import { YourProviderClient } from 'your-provider-sdk';

/**
 * 创建 YourProvider 模型
 */
export function createYourProviderModel(config: LLMConfig): LanguageModel {
  // 校验 API Key
  if (!config.apiKey) {
    throw createError('llm', 'API key is required', ErrorCode.LLM_API_KEY);
  }

  // 提供商特定校验逻辑
  if (!config.apiKey.startsWith('your-prefix-')) {
    throw createError('llm', 'Invalid API key format for Your Provider', ErrorCode.LLM_API_KEY);
  }

  // 使用 AI SDK 创建 provider
  const provider = YourProvider({
    apiKey: config.apiKey
  });

  // 额外模型配置
  const modelOptions: any = {};

  // 处理提供商专用配置
  const yourProviderConfig = config as YourProviderConfig;
  if (yourProviderConfig.someProviderSpecificOption !== undefined) {
    modelOptions.someOption = yourProviderConfig.someProviderSpecificOption;
  }

  // 返回模型实例
  return provider.LanguageModel({
    model: config.model,
    ...modelOptions
  });
}
```

### 备选方案：实现自定义适配器

如果没有可用的 AI SDK 集成，可以实现一个自定义适配器以符合 `LanguageModel` 接口：

```typescript
import { LanguageModel } from 'ai';
import { YourProviderClient } from 'your-provider-sdk';

export function createYourProviderModel(config: LLMConfig): LanguageModel {
  // 初始化原生客户端
  const client = new YourProviderClient({
    apiKey: config.apiKey
  });

  // 返回实现 LanguageModel 接口的对象
  return {
    generate: async (options) => {
      // 将 CoreMessage 转为提供商消息格式
      const providerMessages = options.messages.map((message) => ({
        role: message.role === 'data' ? 'tool' : message.role,
        content: message.content
      }));

      // 调用提供商 API
      const response = await client.createCompletion({
        model: config.model,
        messages: providerMessages,
        temperature: options.temperature
      });

      // 返回统一格式的结果
      return {
        choices: [
          {
            message: {
              role: 'assistant',
              content: response.text
            }
          }
        ]
      };
    },

    // 如支持流式，额外实现 generateStream
    generateStream: async (_options) => {
      // 这里实现 ReadableStream 适配逻辑，可参考 AI SDK 文档
      throw new Error('Streaming not implemented for your-provider');
    }
  };
}
```

## 第四步：更新提供商注册表

在 `src/llm/provider-registry.ts` 中，把新提供商加入 `DEFAULT_PROVIDERS`：

```typescript
const DEFAULT_PROVIDERS: Record<LLMProvider, ProviderMetadata> = {
  // ... 其他提供商 ...
  'your-provider': {
    id: 'your-provider',
    displayName: 'Your Provider',
    description: 'Description of your provider',
    defaultModel: 'default-model-id',
    validateApiKey: (key: string) => key.startsWith('your-prefix-'),
    fetchModels: async (apiKey: string) => {
      try {
        const client = new YourProviderClient({ apiKey });
        const models = await client.listModels();

        // 转换为统一格式
        return models.map((model) => ({
          id: model.id,
          name: model.name,
          contextLength: model.contextLength || 4096,
          pricingInfo: {
            inputPrice: model.inputPrice || 0,
            outputPrice: model.outputPrice || 0,
            unit: model.pricingUnit || '1M tokens'
          }
        }));
      } catch (error: any) {
        logger.error(
          LogCategory.LLM,
          'fetchModels',
          `Error fetching models for your-provider: ${error.message}`
        );
        return [];
      }
    }
  }
};
```

## 第五步：更新 `createLLM` 工厂函数

在 `src/llm/create-llm.ts` 中，让工厂函数识别并创建新提供商的模型：

```typescript
import {
  createAnthropicModel,
  createOpenAIModel,
  createGeminiModel,
  createDeepSeekModel,
  createGroqModel,
  createYourProviderModel
} from './model-utils';

export function createLLM(config: LLMConfig): CoreLLM {
  logger.debug(LogCategory.LLM, 'createLLM', 'Creating LLM instance', {
    provider: config.provider,
    model: config.model
  });

  let model;
  switch (config.provider) {
    case 'anthropic':
      model = createAnthropicModel(config);
      break;
    case 'openai':
      model = createOpenAIModel(config);
      break;
    case 'gemini':
      model = createGeminiModel(config);
      break;
    case 'deepseek':
      model = createDeepSeekModel(config);
      break;
    case 'groq':
      model = createGroqModel(config);
      break;
    case 'your-provider':
      model = createYourProviderModel(config);
      break;
    default:
      throw createError('llm', `Unsupported provider: ${config.provider}`, ErrorCode.LLM_EXECUTION);
  }

  return new CoreLLM({ model, config });
}
```

## 第六步：更新导出

在 `src/llm/index.ts` 中导出新提供商的工具函数，便于外部复用：

```typescript
export {
  createAnthropicModel,
  createOpenAIModel,
  createGeminiModel,
  createDeepSeekModel,
  createGroqModel,
  createYourProviderModel
} from './model-utils';
```

如果需要在主入口 `src/index.ts` 中导出一些与该提供商相关的类型或类，也可以加上：

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GroqAPI } from '@ai-sdk/groq';
import { YourProviderClient } from 'your-provider-sdk';

export { GoogleGenerativeAI, GroqAPI, YourProviderClient };
```

## 第七步：消息格式兼容

AgentDock Core 已在 `src/types/messages.ts` 中提供了消息格式转换工具：

- `toAIMessage`：将内部 `Message` 转换为 AI SDK 的 `AIMessage`；  
- `fromAIMessage`：将 `AIMessage` 转换回内部 `Message`。

若新提供商对消息格式有特别要求，可根据需要扩展这些函数或增加新的辅助函数。

## 第八步：提供商特性（可选）

如果新提供商有标准接口之外的特性，可以在配置类型中添加字段，并在模型构造函数里处理。  
例如，该提供商支持额外的 `creativity` 参数：

```typescript
// types.ts
export interface YourProviderConfig extends LLMConfig {
  creativity?: number;
}

// model-utils.ts
export function createYourProviderModel(config: LLMConfig): LanguageModel {
  const yourProviderConfig = config as YourProviderConfig;
  const modelOptions: any = {};

  if (yourProviderConfig.creativity !== undefined) {
    modelOptions.creativity = yourProviderConfig.creativity;
  }

  return YourProvider({
    apiKey: config.apiKey
  }).LanguageModel({
    model: config.model,
    ...modelOptions
  });
}
```

## 第九步：测试

在 `src/llm/__tests__/your-provider.test.ts` 中为新提供商增加单元测试：

```typescript
import { createLLM } from '../create-llm';
import { CoreLLM } from '../core-llm';

jest.mock('your-provider-sdk', () => {
  return {
    YourProviderClient: jest.fn().mockImplementation(() => {
      return {
        createCompletion: jest.fn().mockResolvedValue({
          text: 'Mock response'
        })
      };
    })
  };
});

describe('YourProvider integration', () => {
  it('creates a YourProvider LLM instance', () => {
    const llm = createLLM({
      provider: 'your-provider',
      apiKey: 'your-test-api-key',
      model: 'your-test-model'
    });

    expect(llm).toBeInstanceOf(CoreLLM);
    expect(llm.config.provider).toBe('your-provider');
  });

  it('generates text correctly', async () => {
    const llm = createLLM({
      provider: 'your-provider',
      apiKey: 'your-test-api-key',
      model: 'your-test-model'
    });

    const result = await llm.generateText({
      messages: [{ role: 'user', content: 'Hello' }]
    });

    expect(result.text).toBeDefined();
  });
});
```

在自动化测试之外，也建议使用真实 API Key 做一轮手动验证：

```typescript
const llm = createLLM({
  provider: 'your-provider',
  apiKey: process.env.YOUR_PROVIDER_API_KEY,
  model: 'your-provider-model',
  someProviderSpecificOption: true
});

const result = await llm.generateText({
  messages: [{ role: 'user', content: 'Hello' }]
});

console.log(result.text);
```

## Embedding 支持

接入新提供商时，要考虑其是否支持 Embedding，用于记忆连接（Memory Connections）：

### 支持 Embedding 的提供商

- ✅ **OpenAI**：`text-embedding-3-small`, `text-embedding-3-large`  
- ✅ **Google**：`text-embedding-004`  
- ✅ **Mistral**：`mistral-embed`（当对应 AI SDK 可用时）

### 暂不支持 Embedding 的提供商

- ❌ **Anthropic、Groq、Cerebras、DeepSeek**：当前没有官方 Embedding 模型

### 实现注意事项

- Embedding 是**可选能力**——没有 Embedding，智能体依然可以正常对话和调用工具；  
- 若不支持 Embedding，相关记忆功能会被优雅禁用；  
- LLM 层会校验提供商是否支持 Embedding，并在不支持时抛出清晰错误；  
- 当新增支持 Embedding 的提供商时，记得更新 `createEmbedding()` 的分支逻辑。

如果你的提供商支持 Embedding，可在 `src/llm/create-embedding.ts` 中加入类似实现：

```typescript
export function createEmbedding(config: EmbeddingConfig): EmbeddingModel<string> {
  switch (config.provider) {
    case 'openai':
      // OpenAI 实现
      break;
    case 'google':
      // Google 实现
      break;
    case 'your-provider':
      if (!config.apiKey) {
        throw createError(
          'llm',
          'Your Provider API key is required for embeddings',
          ErrorCode.LLM_API_KEY
        );
      }

      const provider = createYourProvider({ apiKey: config.apiKey });
      return provider.embedding(config.model || 'your-embedding-model');
    default:
      throw createError(
        'llm',
        `Provider ${config.provider} does not support embeddings`,
        ErrorCode.LLM_EXECUTION
      );
  }
}
```

## 总结

通过以上步骤，你可以把新的 LLM 提供商平滑接入 AgentDock Core。  
统一的 LLM 抽象让「新增提供商」的变更集中在 Core 层，业务应用几乎无需改动。

在实现新提供商时，建议重点关注：

1. **兼容性**：确保与现有消息/模型接口保持一致；  
2. **错误处理**：提供清晰的错误信息与回退策略；  
3. **性能与稳定性**：根据需要加入缓存、限流、重试等机制；  
4. **测试覆盖**：为关键路径与边界情况编写足够的测试。

此外，AgentDock Core 还允许**工具直接复用当前智能体的 LLM 实例**：  
在工具实现中通过 `options.llmContext?.llm` 获取并复用该实例，同时配合合理的 temperature 设置和清晰的系统/用户消息，使工具调用更稳定、更可控。