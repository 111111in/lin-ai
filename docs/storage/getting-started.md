# 存储快速上手（Storage Setup Guide）

## 快速开始

### 本地开发

```bash
# 启动应用
pnpm dev

# 存储配置：
# - 自动注册 SQLite 适配器
# - 在 ./agentdock.db 创建数据库
# - 会话在服务重启后依然保留
```

本地开发 **无需配置 `.env.local`**，SQLite 会自动启用。

### 生产环境（PostgreSQL / Supabase）

#### 第一步：创建数据库
选择一个 PostgreSQL 提供商，例如：
- Supabase（托管 PostgreSQL）
- Neon
- Railway
- 自建 PostgreSQL 15+

#### 第二步：配置环境变量
在 `.env.local` 中添加：

```bash
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
ENABLE_PGVECTOR=true  # 可选：用于向量操作
KV_STORE_PROVIDER=postgresql
```

#### Step 3: Enable Vector Extension (Optional)
For vector search capabilities:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

#### Step 4: Deploy
```bash
pnpm build
pnpm start
```

**Current capabilities with this setup:**
- Session state persistence
- Storage API with PostgreSQL backend
- Vector operations (if pgvector enabled)

**Not yet implemented:**
- Server-side message persistence (messages remain in browser localStorage)
- User authentication system
- AI memory implementation

## Configuration Examples

### Minimal Local Development
```bash
# No storage configuration needed
# SQLite is automatically enabled in development
```

### Production with PostgreSQL
```bash
# PostgreSQL connection
DATABASE_URL=postgresql://postgres:password@host:5432/database
ENABLE_PGVECTOR=true
KV_STORE_PROVIDER=postgresql
```

## Common Questions

### Do I need Redis?
No. PostgreSQL can handle session storage directly. Redis is optional for caching.

### Do I need MongoDB?
No. MongoDB is not recommended for the memory system. Use PostgreSQL or SQLite.

### What about Vercel deployments?
Options:
- Use external PostgreSQL (Supabase, Neon)
- Use Vercel KV (auto-configured when added via Vercel dashboard)

### Data not persisting locally?
Ensure you're running `pnpm dev` which enables SQLite automatically.

### Can I use my own PostgreSQL?
Yes. Any PostgreSQL 15+ instance works. Add pgvector extension for vector operations.

## Using Additional Storage Adapters

Most applications don't need additional adapters. For specific requirements:

### Step 1: Configure Environment
```bash
# Example: MongoDB (not recommended for memory)
ENABLE_MONGODB=true
MONGODB_URI=mongodb://localhost:27017/agentdock
```

### Step 2: Register in API Route
```typescript
// app/api/route.ts
import { getStorageFactory } from 'agentdock-core';
import { registerMongoDBAdapter } from 'agentdock-core/storage';

export async function POST(req: Request) {
  const factory = getStorageFactory();
  await registerMongoDBAdapter(factory);
  
  const storage = factory.getProvider({ type: 'mongodb' });
  // Use storage...
}
```

## Summary

- **Local Development**: SQLite auto-configured
- **Production**: PostgreSQL recommended
- **Additional adapters**: Available but require manual registration 