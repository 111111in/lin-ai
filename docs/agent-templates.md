# 智能体模板（Agent Templates）

智能体模板是 AgentDock 中最核心的配置机制，你可以通过一个声明式的 JSON 文件，定义智能体的身份、能力和行为。

## 概览

`/agents` 目录下的每个智能体都有一个对应的 `template.json` 文件。这个文件主要包含：

*   基本信息（ID、名称、描述）
*   LLM 提供商与模型选择，以及模型参数
*   系统提示词与性格设定（personality）
*   可用工具列表
*   编排规则（步骤、条件、执行序列）

通过这一套模板机制，你可以在几乎不写代码的情况下，快速创建、分享和修改智能体。

如何向官方公共仓库贡献自己的智能体模板，可参考：[贡献社区智能体](./rfa/add-agent.md)。

## 模板结构示例（`template.json`）

`template.json` 大致遵循如下结构：

```json
{
  "version": "1.0", // Optional: Version of the template format
  "agentId": "unique-agent-id", // Required: Unique identifier
  "name": "Display Name", // Required: Name shown in UI
  "description": "Brief description of the agent.", // Required: Description for UI
  "tags": ["Example", "Research"], // Optional: Tags for categorization
  "priority": 10, // Optional: Lower numbers appear higher in lists
  "personality": [ // Required: System prompt broken into lines/paragraphs
    "Personality trait 1",
    "Personality trait 2"
  ],
  "nodes": [ // Required: List of node types used by the agent
    "llm.openai", // Example: Specify the LLM node provider
    "search"      // Example: Include necessary tool nodes
  ],
  "nodeConfigurations": { // Required: Configuration for specific nodes
    "llm.openai": { // Key matches the node type from the "nodes" list
      "model": "YOUR_CHOSEN_MODEL", // Required: Specify the model ID
      "temperature": 0.7, // Optional: Controls randomness (0=deterministic, >0=more random). Range varies by provider.
      "maxTokens": 4096, // Optional: Max tokens for the response.
      "topP": 0.9, // Optional: Nucleus sampling (0-1). Consider only top P% probability mass. Use temperature OR topP.
      "topK": 50, // Optional: Consider only the top K most likely tokens.
      "frequencyPenalty": 0.2, // Optional: Penalizes frequently used tokens (0=no penalty). Range varies.
      "presencePenalty": 0.1, // Optional: Penalizes tokens already present in prompt/response (0=no penalty). Range varies.
      "stopSequences": ["\nUser:"], // Optional: Sequences that stop generation.
      "seed": 12345, // Optional: Integer for deterministic results (if supported).
      "useCustomApiKey": false // Optional: If true, requires user to provide API key in settings.
    },
    "search": { // Example: Configuration for a tool node (if needed)
      "maxResults": 5 
    }
  },
  "chatSettings": { // Required: Settings for the chat interface
    "historyPolicy": "lastN", // Optional: 'none', 'lastN', 'all' (default: 'lastN')
    "historyLength": 20, // Optional: Number of messages if policy is 'lastN' (default: 50)
    "initialMessages": [ // Optional: Messages shown when chat starts
      "Hello! How can I help?"
    ],
    "chatPrompts": [ // Optional: Suggested prompts shown in UI
      "What can you do?"
    ]
  },
  "options": { // Optional: Additional agent-level options
    "maxSteps": 10 // Example: Max tool execution steps per turn
  }
}
```

### 关键配置字段说明

*   **`agentId`, `name`, `description`**：智能体的基本身份信息。
*   **`personality`**：定义系统提示词与核心行为，是引导 LLM 表现的关键。
*   **`nodes`**：列出该智能体所需的全部能力节点（LLM 提供商节点、各类工具节点）。
*   **`nodeConfigurations`**：为 `nodes` 中的每个节点配置具体参数。
    *   对 LLM 节点（如 `llm.openai`），**必须**指定 `model`。
    *   可以通过 `temperature`、`maxTokens`、`topP`、`topK`、`frequencyPenalty`、`presencePenalty`、`stopSequences`、`seed` 等参数覆盖默认行为。不同 LLM 提供商对这些参数的支持范围可能略有差异。
*   **`chatSettings`**：控制聊天界面的行为、初始状态以及推荐提示词。

关于这些通用 LLM 参数（如 `temperature`、`topP`、`maxTokens` 等）的详细解释及影响，可以参考 [Vercel AI SDK 设置文档](https://sdk.vercel.ai/docs/ai-sdk-core/settings)。

## 推荐内置智能体示例

| Agent                                                    | Description                                                                                                                                                                                                                                                         | GitHub                                                                                        |
| :------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------- |
| [Cognitive Reasoner](/chat?agent=cognitive-reasoner)     | Tackles complex problems using a suite of cognitive enhancement tools and structured reasoning. Features different operational modes including Research, Problem-Solving, Evaluation, Comparison, Ideation, and Debate. Uses the think tool for step-by-step reasoning. | [View Code](https://github.com/agentdock/agentdock/tree/main/agents/cognitive-reasoner)     |
| [Dr. House](/chat?agent=dr-house)                       | Medical diagnostician inspired by the TV character, specializing in advanced medical diagnostics and rare disease identification. Leverages comprehensive medical knowledge and medical databases.                                                                         | [View Code](https://github.com/agentdock/agentdock/tree/main/agents/dr-house)               |
| [Science Translator](/chat?agent=science-translator)     | Makes complex scientific papers accessible by finding and translating them into simple language without sacrificing accuracy. Utilizes PubMed access and multi-database scientific research capabilities.                                                                    | [View Code](https://github.com/agentdock/agentdock/tree/main/agents/science-translator)   |
| [Calorie Vision](/chat?agent=calorie-vision)             | Analyzes food images to provide precise calorie and nutrient breakdowns using visual recognition technology. Integrates with visual analysis tools to process and evaluate food content from photos.                                                                    | [View Code](https://github.com/agentdock/agentdock/tree/main/agents/calorie-vision)         |
| [Harvey Specter](/chat?agent=harvey-specter)             | Legal strategist and negotiator inspired by the Suits character, specializing in contract review, case strategy, and negotiation tactics. Accesses legal databases to provide accurate and actionable legal insights.                                                      | [View Code](https://github.com/agentdock/agentdock/tree/main/agents/harvey-specter)         |
| [Orchestrated Agent](/chat?agent=orchestrated-agent)     | Demonstrates advanced agent orchestration by combining multiple specialized agents and tools in a cohesive workflow with dynamic branching. Shows how different agents can be combined and orchestrated.                                                                  | [View Code](https://github.com/agentdock/agentdock/tree/main/agents/orchestrated-agent)   |
| [Agent Planner](/chat?agent=agent-planner)               | Specialized agent for designing and implementing AI agents using the AgentDock framework and RFA system. Provides agent ideation, architecture design, implementation guidance, and RFA system integration.                                                             | [View Code](https://github.com/agentdock/agentdock/tree/main/agents/agent-planner)           |
| [Tenant Rights Advisor](/chat?agent=tenant-rights)       | Guides renters through housing issues like repairs, evictions, and deposit disputes based on general housing regulations.                                                                                                                                               | [View Code](https://github.com/agentdock/agentdock/tree/main/agents/tenant-rights)         |
| [Consumer Rights Defender](/chat?agent=consumer-rights) | Helps consumers navigate issues with refunds, warranties, defective products, and unfair billing practices.                                                                                                                                                       | [View Code](https://github.com/agentdock/agentdock/tree/main/agents/consumer-rights)     |
| [Small Claims Court Guide](/chat?agent=small-claims)   | Assists with small claims court navigation including filing paperwork, preparing evidence, and collecting judgments.                                                                                                                                              | [View Code](https://github.com/agentdock/agentdock/tree/main/agents/small-claims)         |

## 智能体目录结构

如需查看更完整的实现示例，可以克隆 AgentDock 仓库并查看 `agents/` 目录：

```
agents/
└── agent-name/
    ├── template.json     # Core configuration (required)
    ├── README.md         # Documentation (recommended)
    └── assets/           # Optional assets (e.g., avatar.png)
```

## 如何使用这些模板

这些模板主要可以：

1.  **直接体验**：在本地运行客户端时，点击上面的智能体链接，通过聊天界面直接体验。
2.  **学习范式**：阅读这些模板配置，学习不同场景下的配置技巧与模式。
3.  **作为起点二次开发**：复制一个现有模板并按需修改，快速创建你自己的专用智能体。 