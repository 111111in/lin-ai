# 使用 PostHog 的分析与统计集成

本文介绍 AgentDock Starter Kit 如何集成分析与统计（以 PostHog 为例）。主要目标是在部署后（例如在 AgentDock Hub 上）采集使用数据，以理解应用性能与用户交互模式，同时确保与 Vercel AI SDK 的工具调用等核心能力兼容。

## 实现概览

该集成同时使用客户端与服务端的 PostHog SDK：

1. **客户端（`posthog-js`）：** 用于自动采集一般 UI 交互（autocapture）以及手动 pageview 统计。配置位于 `src/components/providers/posthog-provider.tsx`。
2. **服务端（`posthog-node`）：** 用于采集由后端流程触发的关键事件，例如聊天请求成功完成。配置位于 `src/lib/analytics.ts`。

这种“双端”方式可以在不干扰敏感后端操作的前提下，采集广泛的 UI 交互，同时也覆盖关键的服务端事件。

## 客户端集成

* **Provider 组件：** `src/components/providers/posthog-provider.tsx` 会初始化 `posthog-js` 并包裹主应用布局（`src/components/layout/layout-content.tsx`）。
* **兼容性配置：** 为避免干扰 Vercel AI SDK 的工具调用机制，`posthog-js` 初始化时会使用一组谨慎选择的选项：
  * `capture_pageview: false`：关闭默认 pageview 采集；改为在路由变化后延迟手动采集（`posthog-provider.tsx` 的 `useEffect`），避免初次加载时的竞态问题。
  * `autocapture: true`：自动采集标准 UI 交互（点击、表单提交等）。
  * `capture_pageleave: false`：关闭。
  * `disable_session_recording: true`：关闭会话录制，降低性能影响与潜在冲突。
* **Context 与 Hook：** Provider 暴露 `usePostHog` hook 与 `capture` 方法，以便在需要时上报自定义客户端事件。

## 服务端集成

* **工具模块：** `src/lib/analytics.ts` 初始化 `posthog-node` 客户端的单例实例。
* **非阻塞采集：** 提供 `captureEvent` 方法，以异步方式采集事件（`Promise.resolve().then(...)`），确保分析上报不会阻塞主执行线程（例如 API 响应）。
* **函数导出：** 对外导出 `captureEvent`、`identifyUser`、`flushAnalytics` 供服务端使用。

## 已追踪事件

当前已确认追踪的关键事件包括：

1. **`$pageview`（客户端）：** `src/components/providers/posthog-provider.tsx` 在路由变化后延迟 1 秒手动上报，避免初始加载阶段的冲突。
2. **自动采集事件（客户端）：** `posthog-js` 自动采集标准 UI 交互（如按钮点击、表单提交），由 `src/components/providers/posthog-provider.tsx` 中的配置控制。
3. **`Chat Completion Success`（服务端）：** 在 `src/app/api/chat/[agentId]/route.ts` 中，当智能体成功生成响应后上报。确认包含的属性：
   * `agentId`：使用的智能体 ID
   * `sessionId`：掩码后的用户会话 ID
   * `durationMs`：API 请求/响应耗时
   * `provider`：LLM Provider（如 `'openai'`、`'groq'`）
   * `model`：具体模型
   * `environment`：Node 环境（如 `'development'`、`'production'`）
   * `timestamp`：事件时间戳
   * （注：该事件目前不包含 token 使用量相关属性）

## 配置

分析与统计集成由环境变量控制：

* `NEXT_PUBLIC_POSTHOG_API_KEY`：PostHog Project API Key。启用追踪所必需。
* `NEXT_PUBLIC_POSTHOG_HOST`：PostHog 实例地址（例如 `https://us.i.posthog.com` 或自建地址）。默认使用 PostHog Cloud US。
* `NEXT_PUBLIC_ANALYTICS_ENABLED`：设为 `true` 启用统计；默认仅在 `NODE_ENV=production` 时为 `true`。

## 未来考虑与定制

部署该 Starter Kit 的用户可能希望：

* **增加自定义事件：** 追踪具体工具使用（客户端/服务端）、设置变更、智能体创建/选择、错误等。
* **启用会话录制：** 在确认兼容或工具调用较少时，可开启会话录制以获得更深的 UX 洞察（需关注性能影响）。
* **用户识别：** 实现 `identifyUser`（例如接入登录后）将事件与具体用户关联，而不只是匿名会话。
* **特性开关：** 使用 PostHog Feature Flags 做 A/B 测试或灰度发布。

*默认情况下，目前不会追踪其它标准服务端事件（例如 `api_chat_request`、`api_chat_error`、`api_tool_execution_started`）。*

## 调试

在开发模式（`NODE_ENV=development`）下：

1. 客户端 PostHog 实例可通过 `window.posthog` 访问，便于调试
2. 服务端事件会被记录到服务端控制台日志

## 最佳实践

1. **个人信息：** 避免在事件中采集可识别个人身份的信息（PII）
2. **错误信息：** 只记录错误类型与概述信息，避免堆栈与敏感细节
3. **用户 ID：** 尽量使用匿名 ID，尤其是面向公众的应用
4. **属性命名：** 事件名与属性 key 使用 snake_case

## 参考资料

- [PostHog Documentation](https://posthog.com/docs)
- [Client API Reference](https://posthog.com/docs/api/js)
- [Node.js API Reference](https://posthog.com/docs/api/nodejs) 