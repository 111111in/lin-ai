# 模型架构（Model Architecture）

本文档介绍 AgentDock 参考实现中的**模型架构设计**。

## 概览

模型相关代码遵循一个简洁、统一的模式，通过清晰的分层来避免重复实现：

1. **API 路由（API Routes）**：负责从各个提供商拉取模型列表并做校验；  
2. **模型注册表（Model Registry）**：在内存中保存模型元信息；  
3. **模型服务（Model Service）**：提供统一的接口，供前端/其他模块查询与使用模型。

## 目录结构

```text
src/
├── app/
│   └── api/
│       └── providers/
│           ├── models/         # 通用模型列表接口
│           ├── anthropic/
│           │   └── models/     # Anthropic 专用模型接口
│           ├── openai/
│           │   └── models/     # OpenAI 专用模型接口
│           ├── gemini/
│           │   └── models/     # Gemini 专用模型接口
│           └── deepseek/
│               └── models/     # DeepSeek 专用模型接口
└── lib/
    ├── models/
    │   └── registry.ts         # 核心模型注册表
    └── services/
        └── model-service.ts    # 统一模型服务
```

## 关键组件

### API 路由

1. **提供商专用路由**（`/api/providers/{provider}/models`）：  
   - 调用对应提供商的 API 拉取模型列表；  
   - 校验用户提供的 API Key 是否有效；  
   - 将拉取到的模型注册到 `ModelRegistry` 中。

2. **通用模型路由**（`/api/providers/models`）：  
   - 从内部的模型注册表中读取模型列表并返回；  
   - 不会直接与外部提供商 API 通信。

### 模型注册表（Model Registry）

`src/lib/models/registry.ts` 中的 `ModelRegistry` 负责：

- 以**内存**方式存储模型元数据；  
- 按提供商维度组织模型；  
- 提供「注册、查询、重置」等操作方法。

### 模型服务（Model Service）

`src/lib/services/model-service.ts` 中的 `ModelService`：

- 对外提供统一的模型访问接口；  
- 调用 API 路由以拉取并注册模型；  
- 管理模型的获取与刷新逻辑。

## 工作流

1. **初始化阶段**  
   - 应用启动时，模型注册表为空；  
2. **配置 API Key**  
   - 用户为某个提供商输入 API Key；  
   - 应用通过该提供商专用的 `/models` 接口校验 Key 并拉取模型；  
   - 若校验通过，则将模型元信息写入 `ModelRegistry`；  
3. **模型使用阶段**  
   - 业务代码通过 `ModelService` 从注册表中读取模型信息；  
   - 除非主动刷新，一般不会再次请求外部提供商 API。

## 与 agentdock-core 的集成

参考实现会依赖 `agentdock-core` 包，该包提供：

- 提供商类型定义（`anthropic`, `openai`, `gemini`, `deepseek` 等）；  
- `ProviderRegistry`，用于维护提供商元信息；  
- 针对各提供商的模型创建函数；  
- 可对任意提供商工作的统一 `CoreLLM` 抽象。

在此基础上，参考实现新增：

- 运行时动态模型注册；  
- 从提供商 API 拉取模型的 API 路由；  
- 一层简化交互的服务层（`ModelService`）。

## 最佳实践

1. **单一数据源（Single Source of Truth）**  
   - `ModelRegistry` 是模型元数据的唯一权威来源；  
   - 只有提供商专用 API 路由负责真正访问外部模型列表接口。

2. **关注点分离（Separation of Concerns）**  
   - API 路由仅处理 HTTP 输入/输出；  
   - `ModelRegistry` 专注模型数据存储与组织；  
   - `ModelService` 向业务层提供干净、易用的调用接口。

3. **避免重复（DRY）**  
   - 通用逻辑集中放在 `ModelService` 中复用；  
   - 各提供商只在自己对应的 API 路由内实现差异化逻辑。

4. **保持简单（KISS）**  
   - 整体架构尽量保持直观、容易理解；  
   - 每个组件只负责一件事情，职责明确；  
   - 所有与提供商相关的路由都在统一的路径层级下组织，便于维护与扩展。