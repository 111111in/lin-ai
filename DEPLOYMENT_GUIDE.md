# LinAI - Vercel 部署指南

## 🚀 快速部署到 Vercel

### 方法一：通过 Vercel Dashboard（推荐）

#### 步骤 1：准备 Git 仓库

1. **创建 GitHub 仓库**
   ```bash
   # 初始化 Git（如果还没有）
   git init
   
   # 添加所有文件
   git add .
   
   # 提交
   git commit -m "Initial commit: LinAI project"
   
   # 添加远程仓库（替换为你的仓库地址）
   git remote add origin https://github.com/yourusername/linai.git
   
   # 推送到 GitHub
   git push -u origin main
   ```

#### 步骤 2：连接 Vercel

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **"Add New Project"**
3. 选择 **"Import Git Repository"**
4. 选择你的 LinAI 仓库
5. 点击 **"Import"**

#### 步骤 3：配置项目

Vercel 会自动检测到 Next.js 项目，使用以下配置：

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

#### 步骤 4：配置环境变量

在 Vercel Dashboard 中添加环境变量：

1. 进入项目设置
2. 点击 **"Environment Variables"**
3. 添加以下变量：

```env
# 必需的 API 密钥
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# 可选的 API 密钥
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
GROQ_API_KEY=your_groq_api_key
CEREBRAS_API_KEY=your_cerebras_api_key

# 应用配置
NEXT_PUBLIC_APP_NAME=LinAI
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# 可选：分析工具
NEXT_PUBLIC_POSTHOG_API_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

#### 步骤 5：部署

1. 点击 **"Deploy"**
2. 等待构建完成（通常 2-3 分钟）
3. 部署成功后，你会获得一个 `.vercel.app` 域名

---

### 方法二：通过 Vercel CLI

#### 步骤 1：安装 Vercel CLI

```bash
npm install -g vercel
```

#### 步骤 2：登录 Vercel

```bash
vercel login
```

#### 步骤 3：部署

```bash
# 在项目根目录运行
vercel

# 首次部署会询问：
# ? Set up and deploy "~/linai"? [Y/n] y
# ? Which scope do you want to deploy to? Your Account
# ? Link to existing project? [y/N] n
# ? What's your project's name? linai
# ? In which directory is your code located? ./
```

#### 步骤 4：添加环境变量

```bash
# 添加生产环境变量
vercel env add OPENAI_API_KEY production
vercel env add ANTHROPIC_API_KEY production

# 或者通过 Dashboard 添加
```

#### 步骤 5：生产部署

```bash
# 部署到生产环境
vercel --prod
```

---

## 📋 部署前检查清单

### ✅ 代码准备

- [ ] 所有代码已提交到 Git
- [ ] 删除了敏感信息（API 密钥等）
- [ ] 更新了 README.md
- [ ] 测试了本地构建 `npm run build`

### ✅ 环境变量

- [ ] 准备好所有 API 密钥
- [ ] 确认密钥有效且有足够额度
- [ ] 在 Vercel 中配置了环境变量

### ✅ 配置文件

- [ ] `next.config.ts` 配置正确
- [ ] `package.json` 依赖完整
- [ ] `.gitignore` 包含必要的忽略项

### ✅ 性能优化

- [ ] 图片已优化
- [ ] 代码已压缩
- [ ] 启用了缓存策略

---

## 🔧 常见问题解决

### 问题 1：构建失败

**错误信息**：`Build failed`

**解决方案**：
```bash
# 本地测试构建
npm run build

# 检查错误日志
# 修复所有 TypeScript 错误
# 确保所有依赖已安装
```

### 问题 2：环境变量未生效

**错误信息**：API 调用失败

**解决方案**：
1. 检查环境变量名称是否正确
2. 确认变量已添加到 **Production** 环境
3. 重新部署项目

### 问题 3：404 错误

**错误信息**：页面显示 404

**解决方案**：
1. 检查路由配置
2. 确认文件路径正确
3. 清除 Vercel 缓存并重新部署

### 问题 4：API 路由超时

**错误信息**：`Function execution timed out`

**解决方案**：
```typescript
// 在 API 路由中设置超时
export const maxDuration = 60; // 60 秒

// 或升级到 Vercel Pro（更长的超时时间）
```

---

## 🌐 自定义域名

### 添加自定义域名

1. 进入 Vercel 项目设置
2. 点击 **"Domains"**
3. 输入你的域名（例如：`linai.com`）
4. 按照提示配置 DNS 记录

### DNS 配置示例

**A 记录**：
```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAME 记录**：
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 📊 性能监控

### 启用 Vercel Analytics

1. 进入项目设置
2. 点击 **"Analytics"**
3. 启用 **Web Analytics**

### 启用 Speed Insights

已在代码中集成：
```typescript
// src/app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## 🔒 安全配置

### 环境变量安全

- ✅ 永远不要在代码中硬编码 API 密钥
- ✅ 使用 `NEXT_PUBLIC_` 前缀暴露给客户端的变量
- ✅ 定期轮换 API 密钥
- ✅ 设置 API 密钥的使用限制

### CORS 配置

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://your-domain.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
        ],
      },
    ];
  },
};
```

---

## 🚀 持续部署

### 自动部署

Vercel 会自动部署：
- ✅ **主分支推送** → 生产环境
- ✅ **其他分支推送** → 预览环境
- ✅ **Pull Request** → 预览环境

### 部署钩子

```bash
# 在 Git 推送时自动部署
git push origin main

# Vercel 会自动：
# 1. 检测到推送
# 2. 拉取最新代码
# 3. 运行构建
# 4. 部署到生产环境
```

---

## 📈 优化建议

### 1. 启用边缘函数

```typescript
// app/api/chat/route.ts
export const runtime = 'edge';
```

### 2. 配置缓存

```typescript
// next.config.ts
const nextConfig = {
  images: {
    domains: ['your-cdn.com'],
    formats: ['image/avif', 'image/webp'],
  },
};
```

### 3. 预渲染静态页面

```typescript
// app/page.tsx
export const revalidate = 3600; // 1 小时重新验证
```

---

## 🎯 部署后检查

### ✅ 功能测试

- [ ] 首页加载正常
- [ ] AI 对话功能正常
- [ ] 历史记录保存正常
- [ ] 模型对比功能正常
- [ ] 图像生成功能正常

### ✅ 性能测试

- [ ] 首屏加载时间 < 3 秒
- [ ] Lighthouse 分数 > 90
- [ ] 移动端体验良好

### ✅ SEO 检查

- [ ] Meta 标签正确
- [ ] Open Graph 图片显示
- [ ] Sitemap 可访问
- [ ] Robots.txt 配置正确

---

## 📞 获取帮助

### Vercel 文档
- [Next.js 部署](https://vercel.com/docs/frameworks/nextjs)
- [环境变量](https://vercel.com/docs/concepts/projects/environment-variables)
- [自定义域名](https://vercel.com/docs/concepts/projects/domains)

### 社区支持
- [Vercel Discord](https://vercel.com/discord)
- [GitHub Discussions](https://github.com/vercel/next.js/discussions)

---

## 🎉 部署成功！

恭喜！你的 LinAI 项目已成功部署到 Vercel。

**下一步**：
1. 分享你的项目链接
2. 收集用户反馈
3. 持续优化和迭代

**项目链接示例**：
- 生产环境：`https://linai.vercel.app`
- 自定义域名：`https://linai.com`

---

## 📝 部署记录模板

```markdown
## 部署信息

- **部署日期**：2026-02-09
- **部署环境**：Vercel
- **项目名称**：LinAI
- **域名**：https://linai.vercel.app
- **Git 提交**：abc1234
- **构建时间**：2 分 30 秒
- **部署状态**：✅ 成功

## 环境变量
- ✅ OPENAI_API_KEY
- ✅ ANTHROPIC_API_KEY
- ✅ GOOGLE_GENERATIVE_AI_API_KEY

## 测试结果
- ✅ 首页加载正常
- ✅ AI 对话功能正常
- ✅ 所有 API 路由正常

## 性能指标
- Lighthouse 分数：95
- 首屏加载：2.1s
- 交互时间：1.8s
```

---

**祝部署顺利！🚀**

