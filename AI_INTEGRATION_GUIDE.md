# AI 模型接入完整指南

## 📋 目录
1. [基础概念](#基础概念)
2. [接入流程](#接入流程)
3. [代码实现](#代码实现)
4. [常见问题](#常见问题)
5. [面试要点](#面试要点)

---

## 基础概念

### 什么是 AI API？

AI API 就是 AI 公司提供的接口，让你可以通过 HTTP 请求调用他们的模型。

```
你的应用 → HTTP 请求 → AI API → 返回结果 → 显示给用户
```

### 主流 AI 提供商

| 提供商 | 模型 | 特点 | 价格 |
|--------|------|------|------|
| OpenAI | GPT-4, GPT-3.5 | 最强大，生态好 | 较贵 |
| Anthropic | Claude 3 | 长上下文，安全 | 中等 |
| Google | Gemini Pro | 免费额度大 | 便宜 |
| DeepSeek | DeepSeek-V3 | 性价比高 | 很便宜 |

---

## 接入流程

### 第 1 步：获取 API Key

#### OpenAI
```
1. 访问 https://platform.openai.com/
2. 注册账号
3. 进入 API Keys 页面
4. 点击 "Create new secret key"
5. 复制保存（只显示一次！）
```

#### Anthropic
```
1. 访问 https://console.anthropic.com/
2. 注册账号
3. 进入 API Keys
4. 创建新 Key
```

#### Google Gemini
```
1. 访问 https://makersuite.google.com/
2. 获取 API Key
3. 免费额度很大
```

### 第 2 步：安装 SDK

```bash
# OpenAI
pnpm add openai

# Anthropic
pnpm add @anthropic-ai/sdk

# Google Gemini
pnpm add @google/generative-ai
```

### 第 3 步：配置环境变量

创建 `.env.local` 文件：

```bash
# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Google Gemini
GEMINI_API_KEY=xxxxxxxxxxxxx
```

**重要：** 
- ✅ 添加到 `.gitignore`
- ✅ 不要提交到 Git
- ✅ 只在服务端使用

---

## 代码实现

### 方式 1：直接调用（最简单）

#### OpenAI 示例

```typescript
// src/app/api/chat/route.ts
import OpenAI from 'openai';

export async function POST(req: Request) {
  // 1. 初始化客户端
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // 2. 获取用户消息
  const { messages } = await req.json();

  // 3. 调用 API
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: messages,
  });

  // 4. 返回结果
  return Response.json({
    content: response.choices[0].message.content,
  });
}
```

#### 测试调用

```typescript
// 前端代码
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: '你好！' }
    ]
  })
});

const data = await response.json();
console.log(data.content); // AI 的回复
```

---

### 方式 2：流式响应（推荐）

#### 为什么要用流式？

```
普通方式：等待 10 秒 → 一次性显示全部内容
流式方式：边生成边显示 → 用户体验好
```

#### 后端实现

```typescript
// src/app/api/chat/stream/route.ts
import OpenAI from 'openai';

export async function POST(req: Request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { messages } = await req.json();

  // 1. 开启流式模式
  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: messages,
    stream: true, // 关键：开启流式
  });

  // 2. 创建可读流
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      // 3. 逐块发送数据
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || '';
        controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  // 4. 返回流式响应
  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

#### 前端实现

```typescript
// src/app/chat/page.tsx
const sendMessage = async (content: string) => {
  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    body: JSON.stringify({
      messages: [{ role: 'user', content }]
    }),
  });

  // 1. 获取流读取器
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  let fullText = '';

  // 2. 循环读取数据
  while (true) {
    const { done, value } = await reader.read();
    
    if (done) break;

    // 3. 解码并累加文本
    const text = decoder.decode(value);
    fullText += text;

    // 4. 实时更新 UI
    setMessages(prev => [
      ...prev.slice(0, -1),
      { role: 'assistant', content: fullText }
    ]);
  }
};
```

---

### 方式 3：统一适配器（最专业）

#### 为什么需要适配器？

```
问题：不同 AI 的接口格式不一样
- OpenAI: openai.chat.completions.create()
- Anthropic: anthropic.messages.create()
- Gemini: model.generateContent()

解决：创建统一接口，屏蔽差异
```

#### 1. 定义统一接口

```typescript
// src/lib/ai/types.ts
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIProvider {
  // 普通调用
  chat(messages: Message[]): Promise<string>;
  
  // 流式调用
  stream(messages: Message[]): AsyncIterator<string>;
  
  // 获取模型信息
  getModelInfo(): {
    name: string;
    maxTokens: number;
    costPer1kTokens: number;
  };
}
```

#### 2. 实现 OpenAI 适配器

```typescript
// src/lib/ai/providers/openai.ts
import OpenAI from 'openai';
import { AIProvider, Message } from '../types';

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model = 'gpt-4') {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  // 普通调用
  async chat(messages: Message[]): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: messages,
    });

    return response.choices[0].message.content || '';
  }

  // 流式调用
  async *stream(messages: Message[]): AsyncIterator<string> {
    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages: messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        yield content;
      }
    }
  }

  // 模型信息
  getModelInfo() {
    return {
      name: this.model,
      maxTokens: 8192,
      costPer1kTokens: 0.03,
    };
  }
}
```

#### 3. 实现 Anthropic 适配器

```typescript
// src/lib/ai/providers/anthropic.ts
import Anthropic from '@anthropic-ai/sdk';
import { AIProvider, Message } from '../types';

export class AnthropicProvider implements AIProvider {
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model = 'claude-3-opus-20240229') {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async chat(messages: Message[]): Promise<string> {
    // 注意：Claude 需要单独的 system 消息
    const systemMessage = messages.find(m => m.role === 'system');
    const userMessages = messages.filter(m => m.role !== 'system');

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: systemMessage?.content,
      messages: userMessages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    return response.content[0].text;
  }

  async *stream(messages: Message[]): AsyncIterator<string> {
    const systemMessage = messages.find(m => m.role === 'system');
    const userMessages = messages.filter(m => m.role !== 'system');

    const stream = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: systemMessage?.content,
      messages: userMessages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        yield event.delta.text;
      }
    }
  }

  getModelInfo() {
    return {
      name: this.model,
      maxTokens: 200000,
      costPer1kTokens: 0.015,
    };
  }
}
```

#### 4. 实现 Gemini 适配器

```typescript
// src/lib/ai/providers/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider, Message } from '../types';

export class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI;
  private model: string;

  constructor(apiKey: string, model = 'gemini-pro') {
    this.client = new GoogleGenerativeAI(apiKey);
    this.model = model;
  }

  async chat(messages: Message[]): Promise<string> {
    const model = this.client.getGenerativeModel({ model: this.model });

    // Gemini 格式转换
    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    
    return result.response.text();
  }

  async *stream(messages: Message[]): AsyncIterator<string> {
    const model = this.client.getGenerativeModel({ model: this.model });

    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastMessage.content);

    for await (const chunk of result.stream) {
      yield chunk.text();
    }
  }

  getModelInfo() {
    return {
      name: this.model,
      maxTokens: 32768,
      costPer1kTokens: 0.0005,
    };
  }
}
```

#### 5. 创建工厂函数

```typescript
// src/lib/ai/factory.ts
import { AIProvider } from './types';
import { OpenAIProvider } from './providers/openai';
import { AnthropicProvider } from './providers/anthropic';
import { GeminiProvider } from './providers/gemini';

export function createAIProvider(
  provider: 'openai' | 'anthropic' | 'gemini',
  model?: string
): AIProvider {
  switch (provider) {
    case 'openai':
      return new OpenAIProvider(
        process.env.OPENAI_API_KEY!,
        model || 'gpt-4'
      );
    
    case 'anthropic':
      return new AnthropicProvider(
        process.env.ANTHROPIC_API_KEY!,
        model || 'claude-3-opus-20240229'
      );
    
    case 'gemini':
      return new GeminiProvider(
        process.env.GEMINI_API_KEY!,
        model || 'gemini-pro'
      );
    
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}
```

#### 6. 使用适配器

```typescript
// src/app/api/chat/[provider]/route.ts
import { createAIProvider } from '@/lib/ai/factory';

export async function POST(
  req: Request,
  { params }: { params: { provider: string } }
) {
  const { messages } = await req.json();

  // 1. 创建对应的 AI 提供商
  const ai = createAIProvider(
    params.provider as 'openai' | 'anthropic' | 'gemini'
  );

  // 2. 调用统一接口
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of ai.stream(messages)) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}
```

#### 7. 前端调用

```typescript
// 使用不同的 AI
const useOpenAI = () => fetch('/api/chat/openai', ...);
const useClaude = () => fetch('/api/chat/anthropic', ...);
const useGemini = () => fetch('/api/chat/gemini', ...);

// 或者动态选择
const [provider, setProvider] = useState('openai');

const sendMessage = async (content: string) => {
  const response = await fetch(`/api/chat/${provider}`, {
    method: 'POST',
    body: JSON.stringify({ messages: [...] }),
  });
  // ...
};
```

---

## 常见问题

### Q1: API Key 如何保护？

**错误做法 ❌**
```typescript
// 前端直接使用（会暴露 Key！）
const openai = new OpenAI({
  apiKey: 'sk-proj-xxxxx', // 危险！
  dangerouslyAllowBrowser: true,
});
```

**正确做法 ✅**
```typescript
// 1. 存储在环境变量
// .env.local
OPENAI_API_KEY=sk-proj-xxxxx

// 2. 只在服务端使用
// src/app/api/chat/route.ts
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 安全
});

// 3. 前端通过 API 调用
// src/app/chat/page.tsx
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ messages }),
});
```

### Q2: 如何处理错误？

```typescript
// src/app/api/chat/route.ts
export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    });

    return Response.json({
      content: response.choices[0].message.content,
    });

  } catch (error: any) {
    // 1. API Key 错误
    if (error.status === 401) {
      return Response.json(
        { error: 'API Key 无效' },
        { status: 401 }
      );
    }

    // 2. 速率限制
    if (error.status === 429) {
      return Response.json(
        { error: '请求过于频繁，请稍后再试' },
        { status: 429 }
      );
    }

    // 3. 余额不足
    if (error.status === 402) {
      return Response.json(
        { error: '账户余额不足' },
        { status: 402 }
      );
    }

    // 4. 其他错误
    console.error('AI API Error:', error);
    return Response.json(
      { error: '服务暂时不可用' },
      { status: 500 }
    );
  }
}
```

### Q3: 如何计算成本？

```typescript
// src/lib/ai/cost-calculator.ts
export function calculateCost(
  tokens: number,
  model: string
): number {
  const prices: Record<string, number> = {
    'gpt-4': 0.03,           // $0.03 per 1K tokens
    'gpt-3.5-turbo': 0.002,  // $0.002 per 1K tokens
    'claude-3-opus': 0.015,  // $0.015 per 1K tokens
    'gemini-pro': 0.0005,    // $0.0005 per 1K tokens
  };

  const pricePerToken = (prices[model] || 0) / 1000;
  return tokens * pricePerToken;
}

// 使用
const tokens = 1500;
const cost = calculateCost(tokens, 'gpt-4');
console.log(`成本: $${cost.toFixed(4)}`); // 成本: $0.0450
```

### Q4: 如何实现重试？

```typescript
// src/lib/ai/retry.ts
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      // 最后一次重试失败，抛出错误
      if (i === maxRetries - 1) {
        throw error;
      }

      // 不可重试的错误，直接抛出
      if (error.status === 401 || error.status === 402) {
        throw error;
      }

      // 计算延迟时间（指数退避）
      const delay = baseDelay * Math.pow(2, i);
      console.log(`重试 ${i + 1}/${maxRetries}，等待 ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('不应该到达这里');
}

// 使用
const response = await retryWithBackoff(
  () => openai.chat.completions.create({ ... }),
  3,  // 最多重试 3 次
  1000  // 初始延迟 1 秒
);
```

### Q5: 如何实现超时控制？

```typescript
// src/lib/ai/timeout.ts
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('请求超时')), timeoutMs)
    ),
  ]);
}

// 使用
try {
  const response = await withTimeout(
    openai.chat.completions.create({ ... }),
    30000  // 30 秒超时
  );
} catch (error) {
  if (error.message === '请求超时') {
    console.error('AI 响应超时');
  }
}
```

---

## 面试要点

### 必须掌握的知识点

#### 1. 基本调用流程
```
获取 API Key → 安装 SDK → 配置环境变量 → 调用 API → 处理响应
```

#### 2. 流式 vs 非流式
```
非流式：等待完整响应，一次性返回
流式：边生成边返回，用户体验好
```

#### 3. 安全性
```
✅ API Key 存储在环境变量
✅ 只在服务端调用
✅ 不暴露给客户端
✅ 使用 HTTPS
```

#### 4. 错误处理
```
401: API Key 无效
429: 速率限制
402: 余额不足
500: 服务器错误
```

### 面试回答模板

**Q: 你是如何接入 AI 模型的？**

**回答：**
> "我使用了三层架构来接入 AI 模型：
> 
> **1. SDK 层**
> 安装官方 SDK（如 openai、@anthropic-ai/sdk），通过环境变量配置 API Key。
> 
> **2. 适配器层**
> 创建统一的接口，屏蔽不同 AI 提供商的差异。这样添加新模型时，只需要实现接口即可。
> 
> **3. API 层**
> 通过 Next.js API Routes 暴露接口给前端，实现流式响应，提升用户体验。
> 
> **安全方面：**
> - API Key 存储在环境变量，不提交到 Git
> - 只在服务端调用，不暴露给客户端
> - 实现了错误处理和重试机制
> 
> **性能方面：**
> - 使用流式响应，边生成边显示
> - 实现了超时控制和重试机制
> - 添加了成本追踪功能"

---

## 实战练习

### 练习 1：实现一个简单的聊天 API

```typescript
// src/app/api/simple-chat/route.ts
import OpenAI from 'openai';

export async function POST(req: Request) {
  // TODO: 实现聊天功能
  // 1. 获取用户消息
  // 2. 调用 OpenAI API
  // 3. 返回结果
}
```

### 练习 2：添加流式响应

```typescript
// src/app/api/stream-chat/route.ts
import OpenAI from 'openai';

export async function POST(req: Request) {
  // TODO: 实现流式聊天
  // 1. 开启 stream: true
  // 2. 创建 ReadableStream
  // 3. 逐块发送数据
}
```

### 练习 3：实现统一适配器

```typescript
// src/lib/ai/providers/custom.ts
export class CustomProvider implements AIProvider {
  // TODO: 实现自己的适配器
  async chat(messages: Message[]): Promise<string> {
    // ...
  }

  async *stream(messages: Message[]): AsyncIterator<string> {
    // ...
  }
}
```

---

## 总结

### 核心要点
1. ✅ **安全第一**：API Key 只在服务端使用
2. ✅ **用户体验**：使用流式响应
3. ✅ **架构设计**：适配器模式统一接口
4. ✅ **错误处理**：完善的错误处理和重试
5. ✅ **成本控制**：追踪 Token 使用量

### 推荐学习资源
- [OpenAI API 文档](https://platform.openai.com/docs)
- [Anthropic API 文档](https://docs.anthropic.com/)
- [Google AI 文档](https://ai.google.dev/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

### 下一步
- 实现图像生成功能
- 添加语音对话
- 实现 Function Calling
- 添加 RAG（检索增强生成）

**记住：AI 接入的核心是安全性和用户体验！** 🚀

