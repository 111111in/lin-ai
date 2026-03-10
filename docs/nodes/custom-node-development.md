# 自定义节点开发（Custom Node Development）

本指南介绍如何在 AgentDock Core 中开发**自定义节点**。

## 总览

在节点层面扩展能力，大致有两种方式：

1. **扩展 Core**：在 AgentDock Core 中继承 `BaseNode` 实现新节点（本页主要讲这个）；  
2. **实现工具**：在参考实现（Next.js 客户端）中编写自定义工具，见[自定义工具开发](./custom-tool-development.md)。

## 高级节点开发：继承 `BaseNode`

如果希望直接在 Core 层增加新的节点类型，可以按下面的方式继承 `BaseNode`：
```typescript
import { BaseNode, NodeMetadata, NodePort } from 'agentdock-core';
import { NodeCategory } from 'agentdock-core/types/node-category';

interface MyNodeConfig {
  parameter: string;
}

export class MyCustomNode extends BaseNode<MyNodeConfig> {
  readonly type = 'custom.myNode';
  
  constructor(id: string, config: MyNodeConfig) {
    super(id, config);
  }
  
  protected getCategory(): NodeCategory {
    return NodeCategory.CUSTOM;
  }
  
  protected getLabel(): string {
    return 'My Custom Node';
  }
  
  protected getDescription(): string {
    return 'Description of what my node does';
  }
  
  protected getVersion(): string {
    return '1.0.0';
  }
  
  protected getCompatibility() {
    return {
      core: true,
      pro: false,
      custom: true
    };
  }
  
  protected getInputs(): NodePort[] {
    return [
      {
        id: 'input',
        type: 'string',
        label: 'Input',
        required: true
      }
    ];
  }
  
  protected getOutputs(): NodePort[] {
    return [
      {
        id: 'output',
        type: 'string',
        label: 'Output'
      }
    ];
  }
  
  async execute(input: unknown): Promise<unknown> {
    // Implementation goes here
    return `Processed: ${input}`;
  }
}
```

### 注册自定义节点

```typescript
import { getNodeRegistry } from 'agentdock-core';
import { MyCustomNode } from './my-custom-node';

// Register your custom node
getNodeRegistry().registerNode(MyCustomNode);

// Create an instance
const myNode = getNodeRegistry().createNode('custom.myNode', 'instance-id', {
  parameter: 'value'
});
```

## 与自定义工具的关系

在日常使用中，更常见的扩展方式其实是**编写自定义工具**，供智能体调用。  
如果你的目标是为 Agent 增加某种「功能按钮」或「API 集成」，建议优先参考  
[自定义工具开发](./custom-tool-development.md)，其中包含：

- 工具实现模式；  
- 使用 Zod 定义参数 Schema；  
- 错误处理与 API 访问；  
- 前端组件化输出格式；  
- 多个完整示例。 