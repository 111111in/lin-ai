# 开源客户端中的图表示例

本页演示如何在 AgentDock 开源客户端中使用 Mermaid 创建并渲染多种类型的图表。这些示例可用于可视化你在使用 AgentDock 构建应用时的架构、工作流与组件等不同方面。

## AgentDock 架构流程图

```mermaid
graph TD
    A[User Request] --> B{Is session active?}
    B -->|Yes| C[Create Agent Node]
    B -->|No| D[Initialize Session]
    D --> C
    C --> E[Process Request]
    E --> F{Success?}
    F -->|Yes| G[Return Result]
    F -->|No| H[Handle Error]
    H --> G
    G --> I[End]
```

## 请求时序图

```mermaid
sequenceDiagram
    participant User
    participant App
    participant AgentDock
    participant LLM

    User->>App: Make request
    App->>AgentDock: Initialize session
    AgentDock->>LLM: Send prompt
    LLM-->>AgentDock: Return response
    AgentDock->>App: Process response
    App->>User: Display result
```

## AgentDock Core 类图

```mermaid
classDiagram
    class BaseNode {
        +String id
        +String name
        +execute()
    }
    class AgentNode {
        +LLMContext context
        +processMessage()
    }
    class ToolNode {
        +Object parameters
        +executeWithContext()
    }
    BaseNode <|-- AgentNode
    BaseNode <|-- ToolNode
```

## AgentDock 状态图

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: receive_request
    Processing --> Responding: generate_response
    Processing --> Error: throw_error
    Responding --> Idle: complete_response
    Error --> Idle: handle_error
    Idle --> [*]: shutdown
```

## AgentDock 数据模型 ER 图

```mermaid
erDiagram
    SESSION ||--o{ MESSAGE : contains
    SESSION {
        string id
        string userId
        timestamp created
    }
    MESSAGE {
        string id
        string content
        string role
        timestamp created
    }
    SESSION ||--|| USER : belongs_to
    USER {
        string id
        string name
        string email
    }
```

## AgentDock 开发路线图

```mermaid
gantt
    title AgentDock Development Roadmap
    dateFormat  YYYY-MM-DD
    
    section Core Framework
    Provider-Agnostic API     :done,    des1, 2023-01-01, 2023-03-01
    Node System               :done,    des2, 2023-02-15, 2023-05-01
    Storage Abstraction       :active,  des3, 2023-04-01, 2023-08-01
    
    section Features
    Error Handling            :done,    des4, 2023-03-01, 2023-04-15
    BYOK Mode                 :active,  des5, 2023-05-01, 2023-07-01
    Advanced Memory           :         des6, 2023-06-01, 2023-09-01
    Vector Storage            :         des7, 2023-08-01, 2023-10-01
```

## 节点分布图

```mermaid
pie title AgentDock Node Usage
    "Agent Nodes" : 42
    "Tool Nodes" : 28
    "Custom Nodes" : 30
```

## 用户旅程图

```mermaid
journey
    title User Request Journey
    section Request Phase
      Receive Request: 5: User, App
      Parse Parameters: 3: App
      Initialize Session: 3: App, AgentDock
    section Processing Phase
      Agent Node Execution: 5: AgentDock
      Tool Node Execution: 4: AgentDock
      Error Handling: 2: AgentDock
    section Response Phase
      Format Response: 3: AgentDock
      Return Result: 5: App, User
```

## 在你的应用中添加图表

这些图表展示了 AgentDock 开源客户端支持的可视化能力，便于你在构建应用时呈现复杂概念。要在应用的任意 Markdown 内容中添加 Mermaid 图表，可以使用如下语法：

```
```mermaid
graph TD
    A[Start] --> B[End]
```

更多 Mermaid 语法请参考 [Mermaid 官方文档](https://mermaid.js.org/syntax/flowchart.html)。

## 开源客户端渲染

AgentDock 开源客户端内置 Mermaid 渲染支持，并可在浅色/深色模式下自动渲染。你可以直接把这些示例作为模板，用于在基于 AgentDock 的应用中可视化组件与工作流。