# 🌊 天蓝绿色主题使用指南

## 配色方案

### 主色调（天蓝绿色系）
- **天蓝色**: `hsl(200, 90%, 55%)` - 主要品牌色
- **青色**: `hsl(180, 85%, 50%)` - 过渡色
- **青绿色**: `hsl(165, 80%, 50%)` - 强调色
- **清新绿**: `hsl(150, 75%, 50%)` - 次要色/成功状态
- **柠檬绿**: `hsl(140, 70%, 50%)` - 辅助色
- **黄色**: `hsl(45, 95%, 55%)` - 警告状态
- **红色**: `hsl(0, 85%, 60%)` - 错误状态

## 使用方法

### 1. 基础颜色类
```tsx
// 主色（天蓝色）
<button className="bg-primary text-primary-foreground">主按钮</button>

// 次要色（清新绿）
<button className="bg-secondary text-secondary-foreground">次要按钮</button>

// 强调色（青绿色）
<div className="bg-accent text-accent-foreground">强调内容</div>
```

### 2. 天蓝绿色调色板
```tsx
// 直接使用天蓝绿色系
<div className="bg-candy-blue">天蓝色</div>
<div className="bg-candy-cyan">青色</div>
<div className="bg-candy-teal">青绿色</div>
<div className="bg-candy-green">清新绿</div>
<div className="bg-candy-lime">柠檬绿</div>
```

### 3. 渐变效果
```tsx
// 蓝绿渐变
<div className="candy-gradient-pink">蓝绿渐变背景</div>

// 天蓝到绿色渐变
<div className="candy-gradient-blue">天蓝绿渐变</div>

// 多色渐变
<div className="candy-gradient-rainbow">彩虹渐变</div>

// 文字渐变
<h1 className="candy-text-gradient">渐变文字</h1>
```

### 4. 苹果风格效果
```tsx
// 玻璃态效果
<div className="glass-effect rounded-2xl p-6">
  玻璃态卡片
</div>

// 苹果风格阴影
<div className="apple-shadow rounded-xl p-4">
  轻阴影卡片
</div>

<div className="apple-shadow-lg rounded-2xl p-6">
  重阴影卡片
</div>

// 糖果按钮（带悬停效果）
<button className="candy-button bg-primary text-white rounded-xl px-6 py-3">
  糖果按钮
</button>

// 平滑过渡
<div className="apple-transition hover:scale-105">
  悬停放大
</div>
```

### 5. 圆角（苹果风格）
```tsx
// 基础圆角: 1rem (16px)
<div className="rounded-lg">标准圆角</div>

// 中等圆角: 0.75rem (12px)
<div className="rounded-md">中等圆角</div>

// 小圆角: 0.625rem (10px)
<div className="rounded-sm">小圆角</div>

// 大圆角: 1.25rem (20px)
<div className="rounded-xl">大圆角</div>

// 超大圆角: 1.5rem (24px)
<div className="rounded-2xl">超大圆角</div>
```

## 完整示例

### 糖果风格卡片
```tsx
<div className="glass-effect apple-shadow-lg rounded-2xl p-8 apple-transition hover:scale-[1.02]">
  <h2 className="candy-text-gradient text-3xl font-bold mb-4">
    糖果主题标题
  </h2>
  <p className="text-foreground/80 mb-6">
    这是一个结合了糖果配色和苹果简洁风格的卡片示例
  </p>
  <button className="candy-button candy-gradient-pink text-white rounded-xl px-6 py-3 font-medium">
    开始使用
  </button>
</div>
```

### 糖果风格按钮组
```tsx
<div className="flex gap-4">
  <button className="candy-button bg-candy-pink text-white rounded-xl px-6 py-3">
    糖果粉
  </button>
  <button className="candy-button bg-candy-purple text-white rounded-xl px-6 py-3">
    糖果紫
  </button>
  <button className="candy-button bg-candy-cyan text-white rounded-xl px-6 py-3">
    糖果青
  </button>
</div>
```

### 状态提示
```tsx
// 成功
<div className="bg-success text-success-foreground rounded-xl p-4 apple-shadow">
  ✓ 操作成功
</div>

// 警告
<div className="bg-warning text-warning-foreground rounded-xl p-4 apple-shadow">
  ⚠ 请注意
</div>

// 错误
<div className="bg-error text-error-foreground rounded-xl p-4 apple-shadow">
  ✕ 操作失败
</div>
```

## 设计原则

1. **简洁至上**: 保持界面干净，避免过度装饰
2. **留白充足**: 使用足够的内边距和外边距
3. **圆角统一**: 使用一致的圆角大小（推荐 rounded-xl 或 rounded-2xl）
4. **阴影轻柔**: 使用 apple-shadow 系列，避免过重的阴影
5. **过渡流畅**: 所有交互都应该有平滑的过渡效果
6. **色彩克制**: 虽然是糖果色，但不要在一个界面使用太多颜色
7. **对比清晰**: 确保文字和背景有足够的对比度

## 深色模式

所有颜色都已经配置了深色模式变体，会自动适配：

```tsx
// 自动适配深色模式
<div className="bg-card text-card-foreground">
  这个卡片在深色模式下会自动变色
</div>
```

## 注意事项

- 主色调是糖果粉（primary），适合用于主要操作按钮
- 避免在同一个视图中使用超过 3 种糖果色
- 大面积使用白色/浅灰背景，糖果色用于点缀
- 文字渐变效果适合用于标题，不要用于正文
- 玻璃态效果适合用于浮层和弹窗

