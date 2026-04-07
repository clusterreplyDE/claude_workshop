# Module 1 — The Claude Ecosystem (15 min)

> *Setting the stage: Claude is more than Code*

## Learning Objectives

By the end of this module, participants will be able to:

- Understand the full Claude product landscape and how the pieces fit together
- Identify when to use which Claude product (Web, Code, API, Apps)
- Navigate the subscription tiers and know what's available at each level
- Create a Project in Claude.ai with Custom Instructions and Artifacts

---

## 1. Claude Web (claude.ai)

Claude's primary web interface at [claude.ai](https://claude.ai) is where most users start. It's a conversational AI assistant for research, writing, analysis, and creative tasks.

### Core Features

| Feature | Description |
|---------|-------------|
| **Chat** | Conversational interface, supports text + image input, file uploads (PDF, CSV, code, images) |
| **Projects** | Persistent workspaces for long-running goals. Each project has its own context (up to 200K tokens), custom instructions, and uploaded knowledge files. Think of it as a "briefing" for Claude. |
| **Artifacts** | Interactive outputs generated alongside the chat — code snippets, documents, diagrams, charts, simple web UIs. Editable and iterable. |
| **Deep Research** | Multi-step research mode: Claude autonomously searches the web, reads sources, and synthesizes findings into a comprehensive report. Available on paid tiers. |
| **Memory** | Persistent memory across conversations. Claude remembers your name, preferences, ongoing projects, and communication style. Available on all tiers (including Free) since March 2026. |
| **Custom Instructions** | Per-project or global instructions that shape Claude's behavior (tone, role, industry focus, formatting preferences). |

### When to Use Claude Web

- Ad-hoc research and analysis
- Writing and content creation
- Document analysis (upload PDFs, spreadsheets, images)
- Brainstorming and ideation
- Quick prototyping with Artifacts

---

## 2. Claude Apps

Claude is available across multiple platforms beyond the web:

| App | Platform | Key Features |
|-----|----------|--------------|
| **Desktop App** | macOS, Windows | Native app, Claude Code built-in, app preview for web servers, file system access |
| **Mobile App** | iOS, Android | Chat on the go, voice input, camera for image analysis |
| **Claude in Chrome** | Chrome Extension (Beta) | Browser automation agent — navigates, clicks, fills forms. Works with Claude Code and Cowork. Supports workflow recording, scheduled tasks, multi-tab workflows. |
| **Cowork** | Desktop (Research Preview) | Desktop agent for knowledge workers. Reads local files, executes multi-step workflows, produces deliverables (documents, spreadsheets, presentations). VM-based sandbox. |

### Claude in Chrome — Highlights

- Navigate websites, click elements, fill forms autonomously
- Planning mode: review Claude's approach, then let it execute
- Workflow recording: Claude learns repeatable steps
- Pairs with Cowork for end-to-end workflows (research on web → polished deliverable on desktop)

---

## 3. Claude Code

The focus of this workshop. Claude Code is Anthropic's **agentic coding tool** — a terminal-native AI that understands your entire codebase.

### Available Environments

| Environment | Access |
|-------------|--------|
| **Terminal CLI** | `claude` command in any terminal |
| **VS Code Extension** | Inline diffs, checkpoint viewer, selection context sharing |
| **JetBrains Plugin** | IntelliJ, WebStorm, PyCharm, GoLand, Rider, etc. Native diff viewer integration |
| **Claude Code Web** | Browser-based at claude.ai — no local install needed (Max/Enterprise) |
| **Desktop App** | Built into the Claude Desktop application |

### What Makes It Different from Claude Web?

| Aspect | Claude Web | Claude Code |
|--------|-----------|-------------|
| **Context** | Uploaded files, conversation | Your entire codebase, terminal, git history |
| **Actions** | Chat, generate artifacts | Read, write, edit files, run shell commands, git operations, web search |
| **Integration** | Browser-based | Terminal, IDE, CI/CD pipelines |
| **Autonomy** | Responds to prompts | Plans and executes multi-step coding tasks |
| **Extensibility** | Limited | MCP servers, hooks, skills, subagents, plugins |

### Key Capabilities (Preview — Covered in Later Modules)

- **Built-in Tools**: Read, Edit, Write, Bash, Grep, Glob, WebFetch, WebSearch
- **CLAUDE.md**: Project memory that persists across sessions
- **Slash Commands & Skills**: Reusable workflows (custom and built-in)
- **Subagents**: Delegate subtasks to isolated agents
- **MCP**: Connect to external systems (GitHub, Jira, databases, etc.)
- **Hooks**: Deterministic automation (lint on save, block dangerous commands)
- **Plugins**: Bundle and share workflows across teams
- **Headless Mode**: Run in CI/CD pipelines (`claude -p "prompt"`)

---

## 4. Claude API

For developers building applications powered by Claude.

| Aspect | Details |
|--------|---------|
| **Messages API** | Core API for sending prompts and receiving responses |
| **Models** | Opus 4.6 (most capable), Sonnet 4.6 (balanced), Haiku 4.5 (fastest) |
| **Context Window** | Up to 1M tokens (Opus/Sonnet), 200K (Haiku) |
| **Features** | Tool use, vision, structured output (JSON), streaming, batches |
| **Providers** | Direct (api.anthropic.com), AWS Bedrock, Google Vertex AI |
| **Agent SDK** | `@anthropic-ai/claude-agent-sdk` — Node.js library for building custom agents with full access to tools, permissions, hooks, and subagents (covered briefly in Module 9) |

### When to Use the API vs. Claude Code

- **API**: Building your own products/tools powered by Claude, custom integrations, high-volume automation
- **Claude Code**: Day-to-day development work, codebase exploration, refactoring, debugging, CI/CD

---

## 5. How It All Connects

```
┌─────────────────────────────────────────────────────┐
│                   Claude Models                      │
│          (Opus 4.6 · Sonnet 4.6 · Haiku 4.5)       │
└──────────────┬──────────────┬───────────────┬───────┘
               │              │               │
        ┌──────▼──────┐ ┌────▼─────┐  ┌──────▼──────┐
        │  Claude.ai  │ │  Claude  │  │  Claude API │
        │   (Web)     │ │   Code   │  │  (Messages) │
        └──────┬──────┘ └────┬─────┘  └──────┬──────┘
               │              │               │
        ┌──────▼──────┐ ┌────▼─────┐  ┌──────▼──────┐
        │  Projects   │ │ Terminal │  │  Agent SDK  │
        │  Artifacts  │ │ VS Code  │  │  Custom     │
        │  Memory     │ │ JetBrains│  │  Apps       │
        │  Deep Res.  │ │ Web      │  │  Bedrock    │
        └─────────────┘ │ Desktop  │  │  Vertex     │
                        └──────────┘  └─────────────┘
               │              │
        ┌──────▼──────────────▼──────┐
        │     Claude Apps            │
        │  Desktop · Mobile · Chrome │
        │  Cowork                    │
        └────────────────────────────┘
```

### Decision Guide: When to Use What

| Scenario | Best Tool |
|----------|-----------|
| Quick question, research, writing | **Claude.ai** (Web/Mobile) |
| Analyze a document or dataset | **Claude.ai** (Projects + file upload) |
| Write, debug, or refactor code | **Claude Code** (Terminal/IDE) |
| Explore an unfamiliar codebase | **Claude Code** |
| Automate code review in CI/CD | **Claude Code** (Headless mode) |
| Build a custom AI-powered tool | **Claude API** (+ Agent SDK) |
| Automate browser tasks | **Claude in Chrome** |
| Create documents/presentations from files | **Cowork** |
| On-the-go quick tasks | **Claude Mobile** |

---

## 6. Subscription Tiers

| Plan | Price | Claude Code | Key Limits |
|------|-------|-------------|------------|
| **Free** | $0 | ❌ | Sonnet only, ~30-100 msgs/day |
| **Pro** | $20/mo | ✅ | All models, standard usage |
| **Max 5x** | $100/mo | ✅ | 5× Pro usage, priority access |
| **Max 20x** | $200/mo | ✅ | 20× Pro usage, priority access |
| **Team Standard** | $25/seat/mo (min 5) | ❌ | 1.25× Pro usage, admin tools |
| **Team Premium** | $125/seat/mo | ✅ | 6.25× Pro usage, admin tools |
| **Enterprise** | Custom | ✅ | Custom limits, SSO/SCIM, HIPAA-ready, 500K context |

### Important Notes

- **Claude Code requires a paid subscription** (Pro, Max, or Team Premium/Enterprise) — or an API key
- **API usage** is separate and pay-per-token (not included in subscriptions)
- **Third-party providers** (AWS Bedrock, Google Vertex AI) use their own billing
- For heavy Claude Code users, **Max 5x or 20x** is recommended to avoid rate limits

> 🏢 **Reply Context:** Check with your team which subscriptions are available. For BMW projects using Bedrock or Vertex, Claude Code can authenticate against these providers directly (covered in Module 2).

---

## Hands-On Exercise (5 min)

### Quick Tour of Claude.ai

> *If participants don't have access to claude.ai, this can be done as a live demo.*

1. **Open** [claude.ai](https://claude.ai) and log in
2. **Create a new Project** — name it "Workshop Sandbox"
3. **Set Custom Instructions** for the project:
   ```
   You are a senior .NET developer working on Azure Kubernetes Service.
   Always consider security best practices and infrastructure-as-code principles.
   Respond concisely with code examples where applicable.
   ```
4. **Ask Claude** in the project: "What are the key components I need for a .NET microservice running on AKS?"
5. **Observe the Artifact** — Claude should generate a structured overview, possibly as a diagram or document
6. **Edit the Artifact** — try modifying or extending it directly

### Takeaway

Notice how Projects + Custom Instructions shape Claude's responses. This same concept applies to Claude Code via `CLAUDE.md` (Module 4).

---

## Summary

| Product | Purpose | Key Differentiator |
|---------|---------|-------------------|
| **Claude.ai** | Research, writing, analysis | Projects, Artifacts, Deep Research, Memory |
| **Claude Apps** | Multi-platform access | Desktop (Code built-in), Mobile, Chrome (browser automation), Cowork |
| **Claude Code** | Agentic coding | Full codebase context, tools, extensibility, CI/CD |
| **Claude API** | Build custom apps | Programmatic access, Agent SDK |

**Up next:** Module 2 — Installing Claude Code and getting your first session running.
