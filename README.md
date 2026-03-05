<div align="center">
  <img src="./public/linai-logo.svg" alt="LinAI Logo" width="120" height="120" />
  <h1>LinAI</h1>
  <p><strong>Your Personal AI Agent Platform</strong></p>
  <p>Build, Deploy, and Scale AI Agents with Ease</p>
</div>

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)](https://tailwindcss.com/)

</div>

---

## 🌟 Overview

**LinAI** is a modern, full-stack AI agent platform built with cutting-edge technologies. It provides a beautiful, intuitive interface for interacting with multiple AI models, managing conversation history, comparing model responses, and generating images.

This project showcases:
- 🎨 **Modern UI/UX Design** - Gradient-based design system with smooth animations
- 🤖 **Multi-Model Support** - GPT-4, Claude, Gemini, and more
- 📊 **Advanced Features** - History management, model comparison, image generation
- 🛠️ **Clean Architecture** - Custom hooks, utilities, and design tokens
- 📱 **Responsive Design** - Optimized for all devices

Built on top of the AgentDock framework, LinAI demonstrates how to create a production-ready AI application with a focus on user experience and code quality.

---

## ✨ Features

### 🎯 Core Features

- **🤖 AI Agents** - Interact with 20+ pre-configured AI agents for various tasks
- **💬 Smart Chat** - Real-time streaming responses with markdown support
- **📊 Model Comparison** - Compare responses from multiple AI models side-by-side
- **📜 History Management** - Full conversation history with search, filter, and export
- **🖼️ Image Generation** - AI-powered image creation and editing
- **📚 Documentation** - Comprehensive docs with search functionality

### 🎨 Design Highlights

- **Modern Gradient UI** - Beautiful cyan-purple-pink gradient color scheme
- **Smooth Animations** - Carefully crafted transitions and micro-interactions
- **Glass Morphism** - Backdrop blur effects for depth and elegance
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Dark/Light Mode** - Seamless theme switching with smooth transitions
- **Custom Logo** - Unique LinAI branding with animated effects

### 🛠️ Technical Highlights

- **Next.js 15** - Latest App Router with Server Components
- **TypeScript** - Full type safety throughout the codebase
- **Tailwind CSS** - Custom design system with design tokens
- **Zustand** - Lightweight state management
- **Vercel AI SDK** - Streaming AI responses
- **Custom Hooks** - 8+ reusable React hooks
- **Utility Libraries** - 800+ lines of custom utilities

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- API keys for AI providers (OpenAI, Anthropic, etc.)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/linai.git
cd linai

# Install dependencies
npm install
# or
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Environment Variables

```env
# Required
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Optional
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
DEEPSEEK_API_KEY=your_deepseek_key
GROQ_API_KEY=your_groq_key
```

---

## 📁 Project Structure

```
linai/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── agents/            # AI Agents page
│   │   ├── compare/           # Model comparison tool
│   │   ├── history/           # Conversation history
│   │   ├── image-generation/  # Image generation
│   │   ├── docs/              # Documentation
│   │   └── page.tsx           # Welcome page
│   ├── components/            # React components
│   │   ├── agents/           # Agent-related components
│   │   ├── chat/             # Chat interface
│   │   ├── layout/           # Layout components
│   │   └── ui/               # UI primitives
│   ├── lib/                   # Utilities and helpers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Utility functions
│   │   ├── constants.ts      # App constants
│   │   └── design-tokens.ts  # Design system tokens
│   └── styles/               # Global styles
├── public/                    # Static assets
├── docs/                      # Documentation files
└── agents/                    # Agent configurations
```

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--primary: 200 90% 50%;    /* Cyan */
--secondary: 150 75% 45%;  /* Green */
--accent: 165 80% 45%;     /* Teal */

/* Gradients */
from-primary via-secondary to-accent
from-blue-500 to-cyan-500
from-purple-500 to-pink-500
```

### Typography

- **Headings**: Inter (Bold/Black)
- **Body**: Inter (Regular/Medium)
- **Code**: Geist Mono

### Spacing & Sizing

- **Border Radius**: 0.5rem - 2rem (8px - 32px)
- **Shadows**: Multi-layer shadows for depth
- **Animations**: 150ms - 500ms transitions

---

## 🔧 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.0
- **UI Components**: Radix UI + Custom components
- **State Management**: Zustand
- **Animations**: CSS animations + Framer Motion

### Backend
- **API Routes**: Next.js API routes
- **AI Integration**: Vercel AI SDK
- **Storage**: Local storage + IndexedDB

### Development
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript strict mode

---

## 📸 Screenshots

### Welcome Page
Beautiful landing page with feature showcase and quick navigation.

### AI Agents
Interact with 20+ specialized AI agents for different tasks.

### Model Comparison
Compare responses from multiple AI models side-by-side.

### History Management
Full conversation history with search and filter capabilities.

---

## 🎯 Key Features Explained

### 1. AI Agents
Pre-configured agents with specialized prompts for:
- Code review and debugging
- Content writing and editing
- Research and analysis
- Creative brainstorming
- And many more...

### 2. Model Comparison
- Send the same prompt to multiple models
- Compare response quality and speed
- Vote for the best answer
- Real-time streaming responses

### 3. History Management
- Save all conversations automatically
- Search by content or date
- Filter by agent or model
- Export conversations
- Delete or archive old chats

### 4. Image Generation
- Text-to-image generation
- Image editing and enhancement
- Multiple style options
- Gallery view with history

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build image
docker build -t linai .

# Run container
docker run -p 3000:3000 linai
```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built on top of [AgentDock](https://github.com/agentdock/agentdock) framework
- UI inspired by modern design trends
- Icons from [Lucide](https://lucide.dev/)
- Fonts from [Google Fonts](https://fonts.google.com/)

---

## 📞 Contact

**Your Name** - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/linai](https://github.com/yourusername/linai)

---

<div align="center">
  <p>Made with ❤️ using Next.js</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>

**[History Mentor](https://github.com/AgentDock/AgentDock/tree/main/agents/history-mentor):** Immersive educational agent combining vectorized historical knowledge with **`search`** capabilities and dynamic Mermaid diagram rendering to create authentic learning experiences that visualize complex historical relationships and timelines on demand.

https://github.com/user-attachments/assets/56e80a15-eac3-452b-aa8b-efe7b7f3360c

</br>

**[Calorie Vision](https://github.com/AgentDock/AgentDock/tree/main/agents/calorie-vision):** Vision-based nutritional analysis system that combines computer vision with structured data extraction to deliver precise macro and micronutrient breakdowns from food images, functioning like a nutritionist that can instantly quantify meal composition without relying on manual input.

https://github.com/user-attachments/assets/6b4e71cf-accc-4c18-bb42-7bc5ad2f37e4





## 🌐 README Translations

[Français](./docs/i18n/french/README.md) • [日本語](./docs/i18n/japanese/README.md) • [한국어](./docs/i18n/korean/README.md) • [中文](./docs/i18n/chinese/README.md) • [Español](./docs/i18n/spanish/README.md) • [Deutsch](./docs/i18n/deutsch/README.md) • [Italiano](./docs/i18n/italian/README.md) • [Nederlands](./docs/i18n/dutch/README.md) • [Polski](./docs/i18n/polish/README.md) • [Türkçe](./docs/i18n/turkish/README.md) • [Українська](./docs/i18n/ukrainian/README.md) • [Ελληνικά](./docs/i18n/greek/README.md) • [Русский](./docs/i18n/russian/README.md) • [العربية](./docs/i18n/arabic/README.md)

## 🧠 Design Principles

AgentDock is built on these core principles:

- **Simplicity First**: Minimal code required to create functional agents
- **Node-Based Architecture**: All capabilities implemented as nodes
- **Tools as Specialized Nodes**: Tools extend the node system for agent capabilities
- **Configurable Determinism**: Control the predictability of agent behavior
- **Type Safety**: Comprehensive TypeScript types throughout

### Configurable Determinism

***Configurable determinism*** is a cornerstone of AgentDock's design philosophy, enabling you to balance creative AI capabilities with predictable system behavior:

- AgentNodes are inherently non-deterministic as LLMs may generate different responses each time
- Workflows can be made more deterministic through *defined tool execution paths*
- Developers can **control the level of determinism** by configuring which parts of the system use LLM inference
- Even with LLM components, the overall system behavior remains **predictable** through structured tool interactions
- This balanced approach enables both *creativity* and **reliability** in your AI applications

#### Deterministic Workflows

AgentDock fully supports the deterministic workflows you're familiar with from typical workflow builders. All the predictable execution paths and reliable outcomes you expect are available, with or without LLM inference:

```mermaid
flowchart LR
  Input[Input] --> Process[Process]
  Process --> Database[(Database)]
  Process --> Output[Output]
  
  style Input fill:#f9f9f9,stroke:#333,stroke-width:1px
  style Output fill:#f9f9f9,stroke:#333,stroke-width:1px
  style Process fill:#d4f1f9,stroke:#333,stroke-width:1px
  style Database fill:#e8e8e8,stroke:#333,stroke-width:1px
```

#### Non-Deterministic Agent Behavior

With AgentDock, you can also leverage AgentNodes with LLMs when you need more adaptability. The creative outputs may vary based on your needs, while maintaining structured interaction patterns:

```mermaid
flowchart TD
  Input[User Query] --> Agent[AgentNode]
  Agent -->|"LLM Reasoning (Non-Deterministic)"| ToolChoice{Tool Selection}
  ToolChoice -->|"Option A"| ToolA[Deep Research Tool]
  ToolChoice -->|"Option B"| ToolB[Data Analysis Tool]
  ToolChoice -->|"Option C"| ToolC[Direct Response]
  ToolA --> Response[Final Response]
  ToolB --> Response
  ToolC --> Response
  
  style Input fill:#f9f9f9,stroke:#333,stroke-width:1px
  style Agent fill:#ffdfba,stroke:#333,stroke-width:1px
  style ToolChoice fill:#ffdfba,stroke:#333,stroke-width:1px
  style ToolA fill:#d4f1f9,stroke:#333,stroke-width:1px
  style ToolB fill:#d4f1f9,stroke:#333,stroke-width:1px
  style ToolC fill:#d4f1f9,stroke:#333,stroke-width:1px
  style Response fill:#f9f9f9,stroke:#333,stroke-width:1px
```

#### Non-Deterministic Agents with Deterministic Sub-Workflows

AgentDock gives you the ***best of both worlds*** by combining non-deterministic agent intelligence with deterministic workflow execution:

```mermaid
flowchart TD
  Input[User Query] --> Agent[AgentNode]
  Agent -->|"LLM Reasoning (Non-Deterministic)"| FlowChoice{Sub-Workflow Selection}
  FlowChoice -->|"Decision A"| Flow1[Deterministic Workflow 1]
  FlowChoice -->|"Decision B"| Flow2[Deterministic Workflow 2]
  FlowChoice -->|"Decision C"| DirectResponse[Generate Response]
  
  Flow1 --> |"Step 1 → 2 → 3 → ... → 200"| Flow1Result[Workflow 1 Result]
  Flow2 --> |"Step 1 → 2 → 3 → ... → 100"| Flow2Result[Workflow 2 Result]
  
  Flow1Result --> Response[Final Response]
  Flow2Result --> Response
  DirectResponse --> Response
  
  style Input fill:#f9f9f9,stroke:#333,stroke-width:1px
  style Agent fill:#ffdfba,stroke:#333,stroke-width:1px
  style FlowChoice fill:#ffdfba,stroke:#333,stroke-width:1px
  style Flow1 fill:#c9e4ca,stroke:#333,stroke-width:1px
  style Flow2 fill:#c9e4ca,stroke:#333,stroke-width:1px
  style Flow1Result fill:#c9e4ca,stroke:#333,stroke-width:1px
  style Flow2Result fill:#c9e4ca,stroke:#333,stroke-width:1px
  style DirectResponse fill:#ffdfba,stroke:#333,stroke-width:1px
  style Response fill:#f9f9f9,stroke:#333,stroke-width:1px
```

This approach enables complex multi-step workflows (potentially involving hundreds of deterministic steps implemented within tools or as connected node sequences) to be invoked by intelligent agent decisions. Each workflow executes predictably despite being triggered by non-deterministic agent reasoning.

For more advanced AI agent workflows and multi-stage processing pipelines, we're building [AgentDock Pro](docs/agentdock-pro.md) - a powerful platform for creating, visualizing, and running complex agent systems.

#### TL;DR on Configurable Determinism 

Think of it like driving. Sometimes you need the AI's creativity (like navigating city streets - non-deterministic), and sometimes you need reliable, step-by-step processes (like following highway signs - deterministic). AgentDock lets you build systems that use *both*, choosing the right approach for each part of a task. You get the AI's smarts *and* predictable results where needed.


## 🏗️ Core Architecture

The framework is built around a powerful, modular node-based system, serving as the foundation for all agent functionality. This architecture uses distinct node types as building blocks:

-   **`BaseNode`**: The fundamental class establishing the core interface and capabilities for all nodes.
-   **`AgentNode`**: A specialized core node orchestrating LLM interactions, tool usage, and agent logic.
-   **Tools & Custom Nodes**: Developers implement agent capabilities and custom logic as nodes extending `BaseNode`.

These nodes interact through managed registries and can be connected (leveraging the core architecture's ports and potential message bus) to enable complex, configurable, and potentially deterministic agent behaviors and workflows.

For a detailed explanation of the node system's components and capabilities, please see the [Node System Documentation](docs/nodes/README.md).

## 🚀 Getting Started

For a comprehensive guide, see the [Getting Started Guide](docs/getting-started.md).

### Requirements

* Node.js ≥ 20.11.0 (LTS)
* pnpm ≥ 9.15.0 (Required)
* API keys for LLM providers (Anthropic, OpenAI, etc.)

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/AgentDock/AgentDock.git
   cd AgentDock
   ```

2. **Install pnpm**:

   ```bash
   corepack enable
   corepack prepare pnpm@latest --activate
   ```

3. **Install Dependencies**:

   ```bash
   pnpm install
   ```
   
   For a clean reinstallation (when you need to rebuild from scratch):
   ```bash
   pnpm run clean-install
   ```
   This script removes all node_modules, lock files, and reinstalls dependencies correctly.

4. **Configure Environment**:
   
   Create an environment file (`.env` or `.env.local`) based on `.env.example`:
   
   ```bash
   # Option 1: Create .env.local
   cp .env.example .env.local
   
   # Option 2: Create .env
   cp .env.example .env
   ```
   
   Then add your API keys to the environment file.

5. **Start Development Server**:

   ```bash
   pnpm dev
   ```
## Deploy the Open Source Client

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAgentDock%2FAgentDock)

Click the button above to deploy the AgentDock Open Source Client directly to your Vercel account. 

### Advanced Capabilities

| Capability             | Description                                                                    | Documentation                                                        |
|------------------------|--------------------------------------------------------------------------------|----------------------------------------------------------------------|
| **Session Management** | Isolated, performant state management for conversations                        | [Session Documentation](./docs/architecture/sessions/README.md)      |
| **Orchestration Framework** | Control agent behavior and tool availability based on context                  | [Orchestration Documentation](./docs/architecture/orchestration/README.md) |
| **Storage Abstraction**  | Flexible storage system with pluggable providers for KV, Vector, and Secure storage | [Storage Documentation](./docs/storage/README.md)                    |
| **Evaluation Framework** | Systematically measure and improve agent quality with diverse evaluators       | [Evaluation Documentation](./docs/evaluations/README.md)             |

The storage system is currently evolving with key-value storage (Memory, Redis, Vercel KV providers) and secure client-side storage, while vector storage and additional backends are in development.

## 📕 Documentation

Documentation for the AgentDock framework is available at [hub.agentdock.ai/docs](https://hub.agentdock.ai/docs) and in the `/docs/` folder of this repository. The documentation includes:

- Getting started guides
- API references
- Node creation tutorials
- Integration examples

For comprehensive ecosystem documentation and guides, visit [agentdock.ai/docs](https://agentdock.ai/docs).

## 📂 Repository Structure

This repository contains:

1.  **AgentDock Core**: The core framework located in `agentdock-core/`
2.  **Open Source Client**: A complete reference implementation built with Next.js, serving as a consumer of the AgentDock Core framework.
3.  **Example Agents**: Ready-to-use agent configurations in the `agents/` directory
4.  **AI Agents Book**: Comprehensive guide content in the `content/ai-agents-book/` directory

You can use AgentDock Core independently in your own applications, or use this repository as a starting point for building your own agent-powered applications.

## 📝 Agent Templates

AgentDock includes several pre-configured agent templates. Explore them in the `agents/` directory or read the [Agent Templates Documentation](docs/agent-templates.md) for details on configuration.

## 🔧 Example Implementations

Example implementations showcase specialized use cases and advanced functionality:

| Implementation | Description | Status |
|----------------|-------------|--------|
| **Orchestrated Agent** | Example agent using orchestration to adapt behavior based on context | Available |
| **Cognitive Reasoner** | Tackles complex problems using structured reasoning & cognitive tools | Available |
| **Agent Planner** | Specialized agent for designing and implementing other AI agents | Available |
| [**Code Playground**](docs/roadmap/code-playground.md) | Sandboxed code generation and execution with rich visualization capabilities | Planned |



## 🔐 Environment Configuration Details

The AgentDock Open Source Client requires API keys for LLM providers to function. These are configured in an environment file (`.env` or `.env.local`) which you create based on the provided `.env.example` file.

### LLM Provider API Keys

Add your LLM provider API keys (at least one is required):

```bash
# LLM Provider API Keys - at least one is required
ANTHROPIC_API_KEY=sk-ant-xxxxxxx  # Anthropic API key
OPENAI_API_KEY=sk-xxxxxxx         # OpenAI API key
GEMINI_API_KEY=xxxxxxx            # Google Gemini API key
DEEPSEEK_API_KEY=xxxxxxx          # DeepSeek API key
GROQ_API_KEY=xxxxxxx              # Groq API key
```

### API Key Resolution

The AgentDock Open Source Client follows a priority order when resolving which API key to use:

1. **Per-agent custom API key** (set via agent settings in the UI)
2. **Global settings API key** (set via the settings page in the UI)
3. **Environment variable** (from .env.local or deployment platform)

### Tool-specific API Keys

Some tools also require their own API keys:

```bash
# Tool-specific API Keys
SERPER_API_KEY=                  # Required for search functionality
FIRECRAWL_API_KEY=               # Required for deeper web search
```

For more details about environment configuration, see the implementation in [`src/types/env.ts`](src/types/env.ts).

### Using Your Own API Keys (BYOK)

AgentDock follows a BYOK (Bring Your Own Key) model:

1. Add your API keys in the settings page of the application
2. Alternatively, provide keys via request headers for direct API usage
3. Keys are securely stored using the built-in encryption system
4. No API keys are shared or stored on our servers

## 📦 Package Manager

This project *requires* the use of `pnpm` for consistent dependency management. `npm` and `yarn` are not supported.

## 💡 What You Can Build

1. **AI-Powered Applications**
   - Custom chatbots with any frontend
   - Command-line AI assistants
   - Automated data processing pipelines
   - Backend service integrations

2. **Integration Capabilities**
   - Any AI provider (OpenAI, Anthropic, etc.)
   - Any frontend framework
   - Any backend service
   - Custom data sources and APIs

3. **Automation Systems**
   - Data processing workflows
   - Document analysis pipelines
   - Automated reporting systems
   - Task automation agents

## Key Features

| Feature                 | Description                                                               |
|-------------------------|---------------------------------------------------------------------------|
| 🔌 **Framework Agnostic (Node.js Backend)** | Core library integrates with Node.js backend stacks.                      |
| 🧩 **Modular Design**     | Build complex systems from simple nodes                                   |
| 🛠️ **Extensible**         | Create custom nodes for any functionality                                 |
| 🔒 **Secure**             | Built-in security features for API keys and data                          |
| 🔑 **BYOK**               | Use your *own API keys* for LLM providers                                 |
| 📦 **Self-Contained**     | Core framework has minimal dependencies                                   |
| ⚙️ **Multi-Step Tool Calls** | Support for *complex reasoning chains*                                    |
| 📊 **Structured Logging** | Detailed insights into agent execution                                    |
| 🛡️ **Robust Error Handling**| Predictable behavior and simplified debugging                            |
| 📝 **TypeScript First**   | Type safety and enhanced developer experience                             |
| 🌐 **Open Source Client** | Complete Next.js reference implementation included                       |
| 🔄 **Orchestration**      | *Dynamic control* of agent behavior based on context                      |
| 💾 **Session Management** | Isolated state for concurrent conversations                               |
| 🎮 **Configurable Determinism** | Balance AI creativity & predictability via node logic/workflows        |
| 📊 **Evaluation Framework** | Robust tools to define, run, and analyze agent performance evaluations   |

## 🧰 Components

AgentDock's modular architecture is built upon these key components:

*   **BaseNode**: The foundation for all nodes in the system
*   **AgentNode**: The primary abstraction for agent functionality
*   **Tools & Custom Nodes**: Callable capabilities and custom logic implemented as nodes.
*   **Node Registry**: Manages the registration and retrieval of all node types
*   **Tool Registry**: Manages tool availability for agents
*   **CoreLLM**: Unified interface for interacting with LLM providers
*   **Provider Registry**: Manages LLM provider configurations
*   **Evaluation Framework**: Core components for agent assessment
*   **Error Handling**: System for handling errors and ensuring predictable behavior
*   **Logging**: Structured logging system for monitoring and debugging
*   **Orchestration**: Controls tool availability and behavior based on conversation context
*   **Sessions**: Manages state isolation between concurrent conversations

For detailed technical documentation on these components, see the [Architecture Overview](docs/architecture/README.md).



## 🗺️ Roadmap

Below is our development roadmap for AgentDock. Most improvements listed here relate to the core AgentDock framework (`agentdock-core`), which is currently developed locally and will be published as a versioned NPM package upon reaching a stable release. Some roadmap items may also involve enhancements to the open-source client implementation.

| Feature | Description | Category |
|---------|-------------|--------|
| [**Storage Abstraction Layer**](docs/roadmap/storage-abstraction.md) | Flexible storage system with pluggable providers | **In Progress** |
| [**Advanced Memory Systems**](docs/roadmap/advanced-memory.md) | Long-term context management | **In Progress** |
| [**Vector Storage Integration**](docs/roadmap/vector-storage.md) | Embedding-based retrieval for documents and memory | **In Progress** |
| [**Evaluation for AI Agents**](docs/roadmap/evaluation-framework.md) | Comprehensive testing and evaluation framework | **In Progress** |
| [**Platform Integration**](docs/roadmap/platform-integration.md) | Support for Telegram, WhatsApp, and other messaging platforms | **Planned** |
| [**Multi-Agent Collaboration**](docs/roadmap/multi-agent-collaboration.md) | Enable agents to work together | **Planned** |
| [**Model Context Protocol (MCP) Integration**](docs/roadmap/mcp-integration.md) | Support for discovering and using external tools via MCP | **Planned** |
| [**Voice AI Agents**](docs/roadmap/voice-agents.md) | AI agents using voice interfaces and phone numbers via AgentNode | **Planned** |
| [**Telemetry and Traceability**](docs/roadmap/telemetry.md) | Advanced logging and performance tracking | **Planned** |
| [**Workflow Runtime & Nodes**](docs/roadmap/workflow-nodes.md) | Core runtime, node types, and orchestration logic for complex automations | **Planned** |
| [**AgentDock Pro**](docs/agentdock-pro.md) | Comprehensive enterprise cloud platform for scaling AI agents & workflows | **Cloud** |
| [**Natural Language AI Agent Builder**](docs/roadmap/nl-agent-builder.md) | Visual builder + natural language agent and workflow construction | **Cloud** |
| [**Agent Marketplace**](docs/roadmap/agent-marketplace.md) | Monetizable agent templates | **Cloud** |

## 👥 Contributing

We welcome contributions to AgentDock! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## 📜 License

AgentDock is released under the [MIT License](LICENSE).

## ✨ Build Anything!

AgentDock provides the foundation to build almost any AI-powered application or automation you can imagine. We encourage you to explore the framework, build innovative agents, and contribute back to the community. Let's build the future of AI interaction together!
