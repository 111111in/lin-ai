# 编排框架（Orchestration）

本目录包含 AgentDock 编排框架相关文档。

## Overview

AgentDock 的编排系统会基于对话上下文，控制智能体交互流程以及可用工具集合。它提供了一种结构化方式来定义复杂智能体行为，包括：

- 基于步骤（Step）的工作流
- 基于条件的工具访问控制
- 上下文感知的步骤跳转
- 工具序列强制执行
- 高内存效率的状态管理

## Documentation

- [编排总览](./orchestration-overview.md)
- [编排配置](./orchestration-config.md)
- [状态管理](./state-management.md)
- [步骤编排（序列）](./step-sequencing.md)
- [条件跳转](./conditional-transitions.md)
- [LLM 编排](./llm-orchestration.md)

## Documentation Files

- [orchestration-overview.md](./orchestration-overview.md) - 编排系统的核心概念与架构
- [orchestration-config.md](./orchestration-config.md) - 配置格式与选项说明
- [step-sequencing.md](./step-sequencing.md) - 工具序列强制与“下一步”约束
- [state-management.md](./state-management.md) - 面向编排的优化状态管理
- [conditional-transitions.md](./conditional-transitions.md) - 条件如何驱动步骤之间的切换