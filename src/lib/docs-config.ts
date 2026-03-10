/**
 * Documentation Sidebar Configuration
 *
 * This file controls:
 * 1. What sections appear in the sidebar
 * 2. The order of those sections
 * 3. Which files are loaded automatically vs. manually specified
 *
 * How to use:
 * - title: The heading displayed in the sidebar
 * - basePath: Folder to automatically load .md files from (titles extracted from markdown heading)
 * - items: Manually specify file locations and titles
 */

export interface DocSection {
  title: string; // Section heading shown in sidebar
  basePath?: string; // Auto-load .md files from this directory
  items?: {
    // Manually specify items
    path: string; // Path to file (without .md), relative to docs folder
    title: string; // Link text shown in sidebar
  }[];
}

// This array controls the order of sections in the sidebar
export const docSections: DocSection[] = [
  // Main page
  {
    title: '概览',
    items: [
      { path: '/', title: '简介' },
      { path: 'getting-started', title: '快速开始' },
      { path: 'agent-templates', title: '智能体模板' },
      { path: 'agentdock-pro', title: 'AgentDock Pro' },
      { path: 'roadmap/workflow-nodes', title: '工作流与节点类型' },
      { path: 'roadmap', title: '路线图' }
    ]
  },

  // Architecture section with specific items
  {
    title: '架构',
    items: [
      { path: 'architecture/', title: '架构总览' },
      { path: 'architecture/agent-node', title: 'Agent 节点' },
      {
        path: 'architecture/provider-agnostic-api',
        title: '多提供商统一 API'
      },
      {
        path: 'architecture/adding-new-provider',
        title: '新增 LLM 提供商'
      },
      { path: 'architecture/model-system', title: '模型架构' },
      { path: 'architecture/core/overview', title: '核心架构' },
      { path: 'architecture/core/request-flow', title: '请求流转' },
      { path: 'architecture/core/technology-stack', title: '技术栈' },
      {
        path: 'architecture/core/response-streaming',
        title: '流式响应'
      }
    ]
  },

  // Nodes section
  {
    title: '节点系统',
    items: [
      { path: 'nodes/', title: '节点系统总览' },
      {
        path: 'nodes/custom-node-development',
        title: '自定义节点开发'
      },
      {
        path: 'nodes/custom-tool-development',
        title: '自定义工具开发'
      }
    ]
  },

  // Storage section
  {
    title: '存储系统',
    items: [
      { path: 'storage/', title: '存储总览' },
      { path: 'storage/getting-started', title: '快速上手' },
      { path: 'storage/message-persistence', title: '消息持久化' },
      { path: 'storage/message-history', title: '历史记录管理' },
      {
        path: 'storage/storage-abstraction',
        title: '存储抽象层'
      },
      { path: 'storage/vector-storage', title: '向量存储集成' }
    ]
  },

  // Memory Systems section
  {
    title: '记忆系统',
    items: [
      { path: 'memory/', title: '记忆系统总览' },
      {
        path: 'memory/complete-configuration-guide',
        title: '配置指南'
      },
      { path: 'memory/architecture-overview', title: '架构概览' },
      {
        path: 'memory/retrieval-augmented-generation',
        title: '对话式 RAG'
      },
      { path: 'memory/memory-connections', title: '记忆连接' },
      { path: 'memory/graph-architecture', title: '图结构架构' },
      { path: 'memory/consolidation-guide', title: '记忆巩固' },
      { path: 'memory/research-foundations', title: '研究基础' }
    ]
  },

  // Evaluation Framework section - NEW
  {
    title: '评估框架',
    items: [
      { path: 'evaluations/', title: '框架总览' },
      { path: 'evaluations/custom-evaluators', title: '自定义评估器' },
      {
        path: 'evaluations/evaluators/llm-judge',
        title: 'LLM 裁判评估器'
      },
      {
        path: 'evaluations/evaluators/nlp-accuracy',
        title: 'NLP 准确率评估器'
      },
      {
        path: 'evaluations/evaluators/rule-based',
        title: '规则评估器'
      },
      {
        path: 'evaluations/evaluators/tool-usage',
        title: '工具使用评估器'
      },
      {
        path: 'evaluations/evaluators/lexical-evaluators',
        title: '词汇评估器总览'
      },
      {
        path: 'evaluations/evaluators/lexical-similarity',
        title: '词汇相似度'
      },
      {
        path: 'evaluations/evaluators/keyword-coverage',
        title: '关键词覆盖率'
      },
      { path: 'evaluations/evaluators/sentiment', title: '情感分析' },
      { path: 'evaluations/evaluators/toxicity', title: '毒性检测' }
    ]
  },

  // Error Handling section - Consolidated
  {
    title: '错误处理',
    items: [
      { path: 'error-handling/overview', title: '错误处理总览' },
      { path: 'error-handling/llm-errors', title: 'LLM 错误处理' },
      {
        path: 'error-handling/core-implementation',
        title: '实现细节'
      }
    ]
  },

  // Sessions & Orchestration combined
  {
    title: '会话与编排',
    items: [
      // Session Section
      {
        path: 'architecture/sessions/session-management',
        title: '会话管理'
      },
      {
        path: 'architecture/sessions/nextjs-integration',
        title: 'Next.js 集成'
      },
      // Orchestration Section
      {
        path: 'architecture/orchestration/orchestration-overview',
        title: '编排总览'
      },
      {
        path: 'architecture/orchestration/orchestration-config',
        title: '编排配置'
      },
      {
        path: 'architecture/orchestration/state-management',
        title: '状态管理'
      },
      {
        path: 'architecture/orchestration/conditional-transitions',
        title: '条件跳转'
      },
      {
        path: 'architecture/orchestration/step-sequencing',
        title: '步骤编排'
      },
      {
        path: 'architecture/orchestration/llm-orchestration',
        title: 'LLM 编排'
      }
    ]
  },

  // Request For Agents (RFA) section
  {
    title: 'Agent 招募（RFA）',
    items: [
      { path: 'rfa/', title: 'RFA 总览' },
      { path: 'rfa/add-agent', title: '贡献智能体' }
    ]
  },

  // Additional Features section
  {
    title: '更多特性',
    items: [
      { path: 'token-usage-tracking', title: 'Token 使用统计' },
      { path: 'analytics', title: '分析与统计' }
    ]
  },

  // Open Source Client section
  {
    title: '开源客户端',
    items: [
      {
        path: 'oss-client/nextjs-implementation',
        title: 'Next.js 实现'
      },
      { path: 'oss-client/byok-mode', title: 'BYOK 模式' },
      { path: 'oss-client/image-generation', title: '图像生成' },
      { path: 'oss-client/diagram-example', title: '流程图示例' }
    ]
  },

  // Roadmap Items section
  {
    title: '路线图特性',
    items: [
      { path: 'roadmap/evaluation-framework', title: '评估框架' },
      { path: 'roadmap/platform-integration', title: '平台集成' },
      {
        path: 'roadmap/multi-agent-collaboration',
        title: '多智能体协作'
      },
      { path: 'roadmap/mcp-integration', title: 'MCP 集成' },
      { path: 'roadmap/voice-agents', title: '语音智能体' },
      { path: 'roadmap/telemetry', title: '遥测与追踪' },
      {
        path: 'roadmap/workflow-nodes',
        title: '工作流运行时与节点类型'
      },
      { path: 'roadmap/code-playground', title: '代码演练场' },
      {
        path: 'roadmap/nl-agent-builder',
        title: 'Natural Language Agent Builder'
      },
      { path: 'roadmap/agent-marketplace', title: 'Agent Marketplace' }
    ]
  },

  // i18n Section
  {
    title: 'README Translations',
    items: [{ path: 'i18n/', title: 'Available Languages' }]
  }
];
