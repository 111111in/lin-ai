/**
 * LinAI - 常量定义
 * 
 * 集中管理项目中使用的常量
 * 
 * @author LinAI Team
 */

/**
 * 应用配置
 */
export const APP_CONFIG = {
  name: 'LinAI',
  version: '1.0.0',
  description: 'Your Personal AI Agent Platform',
  author: 'LinAI Team',
  repository: 'https://github.com/yourusername/linai'
} as const;

/**
 * 路由路径
 */
export const ROUTES = {
  HOME: '/',
  AGENTS: '/agents',
  HISTORY: '/history',
  COMPARE: '/compare',
  IMAGE_GEN: '/image-generation',
  DOCS: '/docs',
  SETTINGS: '/settings'
} as const;

/**
 * 本地存储键名
 */
export const STORAGE_KEYS = {
  THEME: 'linai_theme',
  LANGUAGE: 'linai_language',
  API_KEYS: 'linai_api_keys',
  CONVERSATIONS: 'linai_conversations',
  FAVORITES: 'linai_favorites',
  USER_PREFERENCES: 'linai_preferences'
} as const;

/**
 * AI 模型配置
 */
export const AI_MODELS = {
  GPT4: {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    color: 'from-green-500 to-emerald-500',
    maxTokens: 8192
  },
  GPT35: {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    color: 'from-blue-500 to-cyan-500',
    maxTokens: 4096
  },
  CLAUDE: {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    color: 'from-purple-500 to-pink-500',
    maxTokens: 200000
  },
  GEMINI: {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    color: 'from-orange-500 to-red-500',
    maxTokens: 32768
  }
} as const;

/**
 * 动画时长（毫秒）
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000
} as const;

/**
 * 断点（像素）
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
} as const;

/**
 * Z-Index 层级
 */
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070
} as const;

/**
 * 消息类型
 */
export const MESSAGE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
} as const;

/**
 * 文件大小限制（字节）
 */
export const FILE_SIZE_LIMITS = {
  IMAGE: 10 * 1024 * 1024, // 10MB
  DOCUMENT: 5 * 1024 * 1024, // 5MB
  AVATAR: 2 * 1024 * 1024 // 2MB
} as const;

/**
 * 支持的文件类型
 */
export const SUPPORTED_FILE_TYPES = {
  IMAGE: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  DOCUMENT: ['application/pdf', 'text/plain', 'text/markdown']
} as const;

/**
 * 默认配置
 */
export const DEFAULTS = {
  PAGE_SIZE: 20,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
  MAX_RETRIES: 3,
  TIMEOUT: 30000
} as const;

/**
 * 正则表达式
 */
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  PHONE: /^1[3-9]\d{9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
} as const;

/**
 * 错误消息
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  API_ERROR: 'API 请求失败，请稍后重试',
  AUTH_ERROR: '认证失败，请重新登录',
  VALIDATION_ERROR: '输入验证失败，请检查输入内容',
  FILE_TOO_LARGE: '文件大小超出限制',
  UNSUPPORTED_FILE: '不支持的文件类型',
  UNKNOWN_ERROR: '发生未知错误，请联系技术支持'
} as const;

/**
 * 成功消息
 */
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: '保存成功',
  DELETE_SUCCESS: '删除成功',
  UPDATE_SUCCESS: '更新成功',
  COPY_SUCCESS: '复制成功',
  EXPORT_SUCCESS: '导出成功'
} as const;

