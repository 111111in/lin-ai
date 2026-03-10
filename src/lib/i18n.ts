'use client';

export type Locale = 'zh';

export const DEFAULT_LOCALE: Locale = 'zh';

type Messages = Record<string, string>;

const en: Messages = {
  'nav.home': 'Home',
  'nav.agents': 'Agents',
  'nav.agents.featured': 'Featured',
  'nav.agents.all': 'All Agents',
  'nav.settings': 'Settings',
  'nav.docs': 'Docs',
  'nav.imageGeneration': 'Image Generation',
  'nav.compare': 'AI Compare',
  'nav.history': 'History',

  'header.github.tooltip': 'View on GitHub',
  'header.theme.toggle': 'Toggle theme',
  'header.language.toggle': 'Toggle language',
  'header.language.en': 'EN',
  'header.language.zh': '中',

  'home.hero.title': 'Welcome to LinAI',
  'home.hero.subtitle.main': 'Your Personal AI Agent Platform',
  'home.hero.subtitle.sub': 'Build, Deploy, and Scale AI Agents with Ease',
  'home.hero.cta.primary': 'Start Exploring',
  'home.hero.cta.secondary': 'View Documentation',
  'home.features.title': 'Core Features',
  'home.features.learnMore': 'Learn more',
  'home.stats.models': 'AI Models',
  'home.stats.features': 'Features',
  'home.stats.agents': 'Agents',

  'chat.error.title': 'Error Loading Chat',
  'chat.error.retry': 'Try Again',
  'chat.header.reset': 'Reset Chat',
  'chat.header.sessionId': 'Show Session ID',

  // Settings page
  'settings.title': 'Settings',
  'settings.subtitle': 'Manage your API keys and application preferences',
  'settings.save': 'Save Changes',
  'settings.saving': 'Saving...',
  'settings.error.title': 'Error Saving Settings',

  'settings.core.title': 'Core Settings',
  'settings.core.subtitle': 'Configure core application behavior',
  'settings.core.byok.label': 'Bring Your Own Keys Mode',
  'settings.core.byok.description':
    'Use only user-provided API keys (no fallback to environment variables)',
  'settings.core.byok.warning':
    "Warning: With BYOK mode enabled, agents will fail if you haven't provided your own API keys in settings.",
  'settings.core.debug.label': 'Debug Mode',
  'settings.core.debug.description': 'Show additional debugging information',

  'settings.font.title': 'Font Settings',
  'settings.font.subtitle': 'Customize the application typography',
  'settings.font.primary.label': 'Primary Font',
  'settings.font.primary.description':
    'The main font used throughout the application',
  'settings.font.primary.current': 'Current font',
  'settings.font.mono.label': 'Code Font',
  'settings.font.mono.description':
    'Font used for code blocks and monospace content',
  'settings.font.mono.placeholder': 'Select a monospace font',
  'settings.font.mono.default': 'Default Monospace',
  'settings.font.mono.current': 'Current font',

  'settings.api.title': 'API Keys',
  'settings.api.subtitle':
    'Configure API keys for language models and other services',
  'settings.api.clear': 'Clear',
  'settings.api.placeholder': 'Enter your {provider} API key',
  'settings.models.badge': 'models available',
  'settings.models.refresh': 'Refresh',
  'settings.models.refreshing': 'Refreshing',

  // Agents page
  'agents.title': 'AI Agents',
  'agents.subtitle': 'Discover powerful open source AI agents',
  'agents.search.placeholder': 'Search agents...',
  'agents.add': 'Add Agent',
  'agents.badge.removeCategory': 'Remove category filter',
  'agents.empty.title': 'No agents found',
  'agents.empty.withSearch': 'No agents matching "{search}"{category}.',
  'agents.empty.noSearch': 'No agents{category} yet.',
  'agents.card.model': 'Model',
  'agents.card.categories': 'Categories',
  'agents.card.tools': 'Tools',
  'agents.card.chat': 'Chat',
  'nav.category.health': 'Health',
  'nav.category.legal': 'Legal',
  'nav.category.characters': 'Characters',
  'nav.category.productivity': 'Productivity',
  'nav.category.technical': 'Technical',
  'nav.category.research': 'Research',
  'nav.category.vision': 'Vision',
  'nav.category.web3': '区块链',
  'nav.category.codegen': 'CodeGen',
  'nav.category.learning': 'Learning',
  'nav.category.marketing': 'Marketing',
  // Agent-specific labels
  'agent.calorieVision.name': 'Calorie Vision',
  'agent.calorieVision.description':
    'Advanced food image analysis with precise calorie and nutrient breakdowns',
  'agent.drHouse.name': 'Dr. Gregory House',
  'agent.drHouse.description':
    'Medical diagnostic AI that provides differential diagnoses for complex cases.',
  'agent.sigmundFreud.name': 'Dr. Sigmund Freud',
  'agent.sigmundFreud.description':
    'Psychoanalytic AI agent modeled after Sigmund Freud and his theories.',
  'agent.cognitive-reasoner.name': 'Cognitive Reasoner',
  'agent.cognitive-reasoner.description':
    'An advanced reasoning agent that uses structured thinking and research tools to solve complex problems.',
  'agent.research-agent.name': 'Research Assistant',
  'agent.research-agent.description':
    'A research agent with deep research capabilities for comprehensive, well-documented information.',
  'agent.science-translator.name': 'Science Translator',
  'agent.science-translator.description':
    'Translates complex scientific papers into clear explanations using multiple academic databases.',
  'agent.deepseek-distill-agent.name': 'DeepSeek Distill Agent',
  'agent.deepseek-distill-agent.description':
    "Advanced reasoning and knowledge agent powered by DeepSeek's distilled Llama 70B model.",
  'agent.deepseek-reasoner.name': 'DeepSeek Reasoner Agent',
  'agent.deepseek-reasoner.description':
    'A powerful reasoning agent using DeepSeek-R1 for chain-of-thought and complex analysis.',
  'agent.gemini-deep-research.name': 'Gemini Deep Research',
  'agent.gemini-deep-research.description':
    'A specialized Gemini agent with deep research capabilities for comprehensive information gathering.',
  'agent.agent-planner.name': 'AI Agent Planner',
  'agent.agent-planner.description':
    'Sophisticated agent for complex planning and strategic decision making using the AgentDock framework and RFA system.',
  'agent.prd-creator.name': 'PRD Creator',
  'agent.prd-creator.description':
    'Transforms product ideas into complete Product Requirements Documents with prioritized features and clear specifications.',
  'agent.science-mentor.name': 'Science Mentor',
  'agent.science-mentor.description':
    'Educational science agent that explains scientific concepts in simple, engaging conversations.',
  'agent.scout-research.name': 'Scout Research',
  'agent.scout-research.description':
    'Focused research agent powered by Llama 4 Scout 17B with strong web search capabilities.',
  'agent.gemini-search.name': 'Gemini Web Search Tool',
  'agent.gemini-search.description':
    'Gemini-powered agent specialized in web search for finding specific, up-to-date information.',
  'agent.code-assistant.name': 'Code Assistant',
  'agent.code-assistant.description':
    'Professional coding assistant for writing, refactoring, debugging code and generating documentation.',
  'agent.consumer-rights.name': 'Consumer Rights Defender',
  'agent.consumer-rights.description':
    'Helps resolve consumer issues with refunds, billing disputes, and defective products.',
  'agent.small-claims.name': 'Small Claims Court Guide',
  'agent.small-claims.description':
    'Guides you through small claims court processes, paperwork, evidence preparation, and hearings.',
  'agent.tenant-rights.name': 'Tenant Rights Advisor',
  'agent.tenant-rights.description':
    'Assists renters with housing issues, documentation templates, and repair or eviction disputes.',
  // Tool labels (Agent card "工具" 区域)
  'tool.search': 'search',
  'tool.think': 'think',
  'tool.reflect': 'reflect',
  'tool.compare': 'compare',
  'tool.critique': 'critique',
  'tool.brainstorm': 'brainstorm',
  'tool.debate': 'debate',
  'tool.deep_research': 'deep_research',
  'tool.pubmed_search': 'pubmed_search',
  'tool.pubmed_fetch': 'pubmed_fetch',
  'tool.openalex_search': 'openalex_search',
  'tool.openalex_fetch': 'openalex_fetch',
  'tool.arxiv_search': 'arxiv_search',
  'tool.arxiv_fetch': 'arxiv_fetch',
  'tool.semantic_scholar_search': 'semantic_scholar_search',
  'tool.semantic_scholar_paper': 'semantic_scholar_paper',
  'tool.semantic_scholar_author': 'semantic_scholar_author',
  // Generic tag labels for non-sidebar categories
  'tag.science': 'Science',
  'tag.education': 'Education',
  'tag.translation': 'Translation',
  'tag.web3': 'Web3',
  'tag.blockchain': 'Blockchain',
  'tag.development': 'Development'
};

const zh: Messages = {
  'nav.home': '首页',
  'nav.agents': '智能体',
  'nav.agents.featured': '精选',
  'nav.agents.all': '全部智能体',
  'nav.settings': '设置',
  'nav.docs': '文档',
  'nav.imageGeneration': '图像生成',
  'nav.compare': '模型对比',
  'nav.history': '历史记录',

  'header.github.tooltip': '在 GitHub 上查看',
  'header.theme.toggle': '切换主题',
  'header.language.toggle': '切换语言',
  'header.language.en': '英',
  'header.language.zh': '中',

  'home.hero.title': '欢迎来到 LinAI',
  'home.hero.subtitle.main': '你的个人 AI 智能体平台',
  'home.hero.subtitle.sub': '轻松构建、部署并扩展 AI Agents',
  'home.hero.cta.primary': '开始探索',
  'home.hero.cta.secondary': '查看文档',
  'home.features.title': '核心功能',
  'home.features.learnMore': '了解更多',
  'home.stats.models': 'AI 模型',
  'home.stats.features': '功能模块',
  'home.stats.agents': '预置智能体',

  'chat.error.title': '聊天加载出错',
  'chat.error.retry': '重试',
  'chat.header.reset': '重置对话',
  'chat.header.sessionId': '查看会话 ID',

  // Settings page
  'settings.title': '设置',
  'settings.subtitle': '管理你的 API 密钥和应用偏好',
  'settings.save': '保存更改',
  'settings.saving': '保存中...',
  'settings.error.title': '保存设置出错',

  'settings.core.title': '核心设置',
  'settings.core.subtitle': '配置应用的核心行为',
  'settings.core.byok.label': '仅使用自有密钥模式（BYOK）',
  'settings.core.byok.description':
    '只使用你在设置中填写的 API Key，不再回退到环境变量',
  'settings.core.byok.warning':
    '警告：开启 BYOK 模式后，如果你没有提供 API Key，智能体将无法正常工作。',
  'settings.core.debug.label': '调试模式',
  'settings.core.debug.description': '显示额外的调试信息',

  'settings.font.title': '字体设置',
  'settings.font.subtitle': '自定义应用的字体样式',
  'settings.font.primary.label': '主字体',
  'settings.font.primary.description': '整个应用中主要使用的字体',
  'settings.font.primary.current': '当前字体',
  'settings.font.mono.label': '代码字体',
  'settings.font.mono.description': '用于代码块和等宽内容的字体',
  'settings.font.mono.placeholder': '选择一个等宽字体',
  'settings.font.mono.default': '默认等宽字体',
  'settings.font.mono.current': '当前字体',

  'settings.api.title': 'API 密钥',
  'settings.api.subtitle': '为各家语言模型和其他服务配置 API 密钥',
  'settings.api.clear': '清空',
  'settings.api.placeholder': '请输入 {provider} 的 API Key',
  'settings.models.badge': '个可用模型',
  'settings.models.refresh': '刷新',
  'settings.models.refreshing': '刷新中',

  // Agents page
  'agents.title': 'AI 智能体',
  'agents.subtitle': '探索强大的开源 AI 智能体',
  'agents.search.placeholder': '搜索智能体...',
  'agents.add': '创建/添加智能体',
  'agents.badge.removeCategory': '移除分类筛选',
  'agents.empty.title': '没有找到智能体',
  'agents.empty.withSearch': '没有找到匹配 “{search}”{category} 的智能体。',
  'agents.empty.noSearch': '当前分类{category}下还没有智能体。',
  'agents.card.model': '模型',
  'agents.card.categories': '分类',
  'agents.card.tools': '工具',
  'agents.card.chat': '对话',
  'nav.category.health': '健康',
  'nav.category.legal': '法律',
  'nav.category.characters': '角色',
  'nav.category.productivity': '效率',
  'nav.category.technical': '技术',
  'nav.category.research': '研究',
  'nav.category.vision': '视觉',
  'nav.category.web3': '区块链',
  'nav.category.codegen': '代码生成',
  'nav.category.learning': '学习',
  'nav.category.marketing': '营销',
  // Agent-specific labels
  'agent.calorieVision.name': '卡路里视觉助手',
  'agent.calorieVision.description':
    '高级食物图像分析助手，为你精确拆解卡路里与营养成分',
  'agent.drHouse.name': '格雷戈里·豪斯医生',
  'agent.drHouse.description':
    '医疗诊断类 AI，像《豪斯医生》一样为疑难复杂病例提供鉴别诊断建议。',
  'agent.sigmundFreud.name': '西格蒙德·弗洛伊德医生',
  'agent.sigmundFreud.description':
    '基于弗洛伊德人格与精神分析理论的心理分析 AI 助手。',
  'agent.cognitive-reasoner.name': '认知推理助手',
  'agent.cognitive-reasoner.description':
    '使用结构化思维、反思和头脑风暴等工具解决复杂问题的高级推理智能体。',
  'agent.research-agent.name': '研究助理',
  'agent.research-agent.description':
    '具备深度研究能力的 AI 研究助手，可提供结构清晰、引用完整的综合信息。',
  'agent.science-translator.name': '科学论文翻译助手',
  'agent.science-translator.description':
    '连接多种学术数据库，把晦涩的科学论文翻译成通俗易懂的解释。',
  'agent.deepseek-distill-agent.name': 'DeepSeek 精炼助手',
  'agent.deepseek-distill-agent.description':
    '基于 DeepSeek R1 Distill Llama 70B 的高级推理智能体，擅长复杂问题分析与知识问答。',
  'agent.deepseek-reasoner.name': 'DeepSeek 推理助手',
  'agent.deepseek-reasoner.description':
    '使用 DeepSeek-R1 进行链式推理与复杂分析的高性能推理智能体。',
  'agent.gemini-deep-research.name': 'Gemini 深度研究助手',
  'agent.gemini-deep-research.description':
    '基于 Gemini 的深度研究智能体，适合做全面信息收集与多角度分析。',
  'agent.agent-planner.name': 'AI 智能体规划师',
  'agent.agent-planner.description':
    '基于 AgentDock 与 RFA 体系，专注于复杂规划与策略决策设计的高级智能体。',
  'agent.prd-creator.name': 'PRD 需求文档生成器',
  'agent.prd-creator.description':
    '把产品想法自动整理为结构清晰、优先级明确的产品需求文档（PRD）。',
  'agent.science-mentor.name': '科学学习导师',
  'agent.science-mentor.description':
    '用通俗、有趣的方式讲解各类科学概念的教育型智能体。',
  'agent.history-mentor.name': '历史对话导师',
  'agent.history-mentor.description':
    '通过与历史人物的沉浸式对话，帮助你轻松、有趣地学习历史知识。',
  'agent.scout-research.name': 'Scout 研究助手',
  'agent.scout-research.description':
    '基于 Llama 4 Scout 17B 的检索型研究助手，擅长查找并汇总最新信息。',
  'agent.gemini-search.name': 'Gemini 网络搜索助手',
  'agent.gemini-search.description':
    '专注于网络检索的 Gemini 智能体，用于查找最新、具体的事实信息。',
  'agent.avalanche-builder.name': 'Avalanche AI 构建助手',
  'agent.avalanche-builder.description':
    '专注利用 AgentDock 框架在 Avalanche 区块链上开发和维护 AI 应用的专家级智能体。',
  'agent.avalanche-explorer.name': 'Avalanche 链上数据探索助手',
  'agent.avalanche-explorer.description':
    '帮助你查询和分析 Avalanche 区块链上的地址、交易和合约数据的专业链上分析智能体。',
  'agent.marketing-prompt-library.name': '营销提示词库生成器',
  'agent.marketing-prompt-library.description':
    '根据不同营销方向，一键生成系统化的 AI 提示词库，复用头部营销人的实战策略。',
  'agent.code-assistant.name': '代码助手',
  'agent.code-assistant.description':
    '专注于代码编写、重构、调试与文档生成的专业编程助手。',
  'agent.consumer-rights.name': '消费者维权助手',
  'agent.consumer-rights.description':
    '帮助处理退款、账单争议、商品质量问题等各类消费者维权场景。',
  'agent.small-claims.name': '小额诉讼向导',
  'agent.small-claims.description':
    '指导你完成小额诉讼的流程、材料准备、证据整理与开庭要点。',
  'agent.tenant-rights.name': '租客权益助手',
  'agent.tenant-rights.description':
    '为租房纠纷提供咨询，包含维修、押金、解约与驱逐等常见问题与文书模板。',
  // Tool labels (Agent card "工具" 区域)
  'tool.search': '搜索',
  'tool.think': '思考',
  'tool.reflect': '反思',
  'tool.compare': '对比',
  'tool.critique': '批判',
  'tool.brainstorm': '头脑风暴',
  'tool.debate': '辩论',
  'tool.deep_research': '深度研究',
  'tool.pubmed_search': 'PubMed 检索',
  'tool.pubmed_fetch': 'PubMed 论文获取',
  'tool.openalex_search': 'OpenAlex 检索',
  'tool.openalex_fetch': 'OpenAlex 论文获取',
  'tool.arxiv_search': 'arXiv 检索',
  'tool.arxiv_fetch': 'arXiv 论文获取',
  'tool.semantic_scholar_search': 'Semantic Scholar 检索',
  'tool.semantic_scholar_paper': 'Semantic Scholar 论文',
  'tool.semantic_scholar_author': 'Semantic Scholar 作者',
  // Generic tag labels for non-sidebar categories
  'tag.science': '科学',
  'tag.education': '教育',
  'tag.translation': '翻译',
  'tag.web3': '区块链',
  'tag.blockchain': '区块链',
  'tag.development': '开发'
};

const messages: Record<Locale, Messages> = {
  zh
};

export function translate(locale: Locale, key: string): string {
  const localeMessages = messages[locale] ?? messages[DEFAULT_LOCALE];
  return localeMessages[key] ?? messages[DEFAULT_LOCALE][key] ?? key;
}
