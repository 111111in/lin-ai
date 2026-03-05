/**
 * LinAI - 核心配置文件
 *
 * 定义应用的基础配置信息，包括站点信息、SEO 配置等
 *
 * @author LinAI Team
 * @version 1.0.0
 */

export const siteConfig = {
  name: 'LinAI',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage:
    (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/api/og',
  description:
    'Your Personal AI Agent Platform - Build, Deploy, and Scale AI Agents',
  links: {
    twitter: 'https://twitter.com/yourhandle',
    github: 'https://github.com/yourusername/linai'
  }
} as const;

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: [
    'AI',
    'Artificial Intelligence',
    'AI Agents',
    'LLM',
    'Machine Learning',
    'Automation',
    'Natural Language Inference',
    'LinAI',
    'Agentic AI',
    'Workflows',
    'Agentic Framework',
    'ChatGPT',
    'Gemini'
  ],
  authors: [
    {
      name: 'LinAI',
      url: siteConfig.url
    }
  ],
  creator: 'LinAI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@linai'
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/site.webmanifest'
} as const;
