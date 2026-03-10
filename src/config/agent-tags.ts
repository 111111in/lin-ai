/**
 * @fileoverview Configuration file for agent tags and categories
 * Used for filtering and displaying agents by category
 */

export interface TagConfig {
  id: string; // URL-friendly identifier
  name: string; // Display name
  description?: string; // Optional description
  order: number; // Display order in sidebar (lower = higher)
  default?: boolean; // Is this a default category to show
  alwaysOnTop?: boolean; // Should agents in this category always be on top
}

export const AGENT_TAGS: TagConfig[] = [
  {
    id: 'featured',
    name: '精选',
    description: '精选智能体',
    order: 0,
    default: true,
    alwaysOnTop: true
  },
  {
    id: 'health',
    name: '健康',
    description: '健康与医疗助手',
    order: 3
  },
  {
    id: 'legal',
    name: '法律',
    description: '法律助手与顾问',
    order: 3
  },
  {
    id: 'characters',
    name: '角色',
    description: '人格/角色型助手',
    order: 4
  },
  {
    id: 'productivity',
    name: '效率',
    description: '提升效率的智能体',
    order: 2
  },
  {
    id: 'technical',
    name: '技术',
    description: '技术类助手与工具',
    order: 4
  },
  {
    id: 'research',
    name: '研究',
    description: '研究与分析助手',
    order: 1
  },
  {
    id: 'vision',
    name: '视觉',
    description: '图像与视觉相关助手',
    order: 5
  },
  {
    id: 'web3',
    name: '区块链',
    description: '区块链与 Web3 助手',
    order: 9
  },
  {
    id: 'codegen',
    name: '代码生成',
    description: '代码生成与编程助手',
    order: 7
  },
  {
    id: 'learning',
    name: '学习',
    description: '学习与辅导助手',
    order: 8
  },
  {
    id: 'marketing',
    name: '营销',
    description: '营销与运营助手',
    order: 9
  }
];
