# Claude Code Deep Dive Workshop — Outline v3.0

> **Audience:** Developers & Solution Architects at Reply, some with prior Claude Code experience
> **Duration:** ~6 hours (09:30–16:30, incl. breaks)
> **Format:** Guided presentation ("red thread") + hands-on at key points
> **Deliverable:** Markdown files (repo-ready)
> **Language:** English (technical terms in English)

---

## Prerequisites

Participants must complete these **before** the workshop:

- **Anthropic Account** with an active plan (Pro/Max/Team) — or an API Key
- **Node.js** (v18+) and **npm** installed
- **Git** installed
- **VS Code** installed (recommended, not mandatory)
- **GitHub Account** with Personal Access Token (for MCP module)
- Admin rights / permission for `npm install -g` on your machine

> **Done together on-site:** Claude Code installation, `claude doctor`, VS Code Extension setup, first session

---

## Schedule Overview

| Time | Unit | Theme | Modules |
|------|------|-------|---------|
| **09:30–11:00** | **Unit 1: Getting Started** | *From zero to first productive session* | M1 Ecosystem (20) · M2 Setup (15) · M3 Interactive Session (35) |
| 11:00–11:15 | ☕ Coffee Break | | |
| **11:15–12:30** | **Unit 2: Making Claude Yours** | *Project memory, workflows, delegation* | M4 CLAUDE.md & Rules (20) · M5 Skills & Commands (30) · M6 Subagents & Agent Teams (25) |
| 12:30–13:30 | 🍽️ Lunch Break | | |
| **13:30–15:00** | **Unit 3: Integration & Automation** | *External tools, quality gates, pipelines* | M7 MCP (35) · M8 Hooks (25) · M9 CLI & Headless (30) |
| 15:00–15:15 | ☕ Coffee Break | | |
| **15:15–16:30** | **Unit 4: The Big Picture** | *Remote, settings, best practices, capstone* | M10 Plugins (10) · M11 Remote & Web (15) · M12 Settings (10) · M13 Best Practices (15) · M14 Capstone (25) |

| | Content | Available | Buffer |
|---|---------|-----------|--------|
| Unit 1 | 70 min | 90 min | 20 min (setup troubleshooting) |
| Unit 2 | 75 min | 75 min | — |
| Unit 3 | 90 min | 90 min | — |
| Unit 4 | 75 min | 75 min | — |
| **Total** | **310 min** | **330 min** | **20 min** |

Each unit is **self-contained**:
1. → "I can use Claude Code"
2. → "I can customize Claude for my project"
3. → "I can connect Claude to external tools and automate"
4. → "I know the full picture and can build a complete setup"

---

## Module Overview

| # | Module | Duration | Format | Unit |
|---|--------|----------|--------|------|
| M1 | [The Claude Ecosystem](m01-claude-ecosystem.md) | 20 min | Hands-on | 1 |
| M2 | [Installation & Setup](m02-installation-setup.md) | 15 min | Hands-on | 1 |
| M3 | [Interactive Session Basics](m03-interactive-session.md) | 35 min | Hands-on | 1 |
| M4 | [CLAUDE.md & Rules](m04-claudemd-rules.md) | 20 min | Hands-on | 2 |
| M5 | [Skills & Commands](m05-skills-commands.md) | 30 min | Hands-on | 2 |
| M6 | [Subagents & Agent Teams](m06-subagents-teams.md) | 25 min | Hands-on | 2 |
| M7 | [MCP: External Connections](m07-mcp.md) | 35 min | Hands-on | 3 |
| M8 | [Hooks: Guaranteeing Determinism](m08-hooks.md) | 25 min | Hands-on | 3 |
| M9 | [CLI & Headless Mode](m09-cli-headless.md) | 30 min | Hands-on | 3 |
| M10 | [Plugins & Marketplace](m10-plugins.md) | 10 min | Demo | 4 |
| M11 | [Claude Code Remote & Web](m11-remote-web.md) | 15 min | Demo | 4 |
| M12 | [Settings, Configuration & Security](m12-settings.md) | 10 min | Overview | 4 |
| M13 | [Best Practices & Patterns](m13-best-practices.md) | 15 min | Discussion | 4 |
| M14 | [Capstone: Putting It All Together](m14-capstone.md) | 25 min | Hands-on | 4 |

---

## Module 1 — The Claude Ecosystem (20 min)

*Setting the stage: Claude is more than Code*

- Claude Web (claude.ai): Chat, Projects, Artifacts, Deep Research, Memory
- Claude Apps: Desktop, Mobile, Chrome Extension, Cowork
- Claude Code: CLI, VS Code, JetBrains, Desktop, Web
- Claude API: Messages API, Models (Opus/Sonnet/Haiku), mention Agent SDK
- **Advanced Model Features (Outlook):** Extended Thinking, Multimodal/Vision, PDF Support, Computer Use, Prompt Caching, Batch API
- How it all connects (Subscriptions: Pro, Max, Team, Enterprise)
- Decision guide: When to use what?
- 🏢 **Reply Context:** Which subscriptions are available to us?

**Hands-on:** Quick tour of claude.ai — create a Project, generate an Artifact, set Custom Instructions

---

## Module 2 — Installation & Setup (15 min)

*From zero to first session*

- Install Claude Code: `npm install -g @anthropic-ai/claude-code`
- Verify: `claude --version`, `claude doctor`
- Authentication: Anthropic Login, API Key, 3rd-party (Bedrock, Vertex)
- First launch, model selection
- VS Code Extension: install + overview
- JetBrains Plugin: brief mention
- 🏢 **Reply Context:** Corporate proxy settings, Bedrock/Vertex for BMW projects

**Hands-on:** Install together, verify with `claude doctor`, start first session, explore `/help`

---

## Module 3 — Interactive Session Basics (35 min)

*Mastering the daily workflow*

- The agentic loop: Input → Tool Selection → Execution → Review
- Built-in Tools: Read, Edit, Write, Bash, Grep, Glob, WebFetch, WebSearch
- Referencing files: `@file`, `@folder`, images, URLs
- Context management: `/compact`, `/clear`, `/cost`, **`/context`** (inspect what's loaded, token costs per feature)
- Model selection: `/model` (Opus, Sonnet, Haiku — when to use which?)
- Git integration: Commits, branches, PRs from within a session
- Checkpoints: Automatic snapshots, `/rewind`, Esc×2, three restore modes
- Permission system: default, acceptEdits, plan, auto mode, `--dangerously-skip-permissions`
- 🏢 **Reply Context:** Demo on a typical .NET/C# project or Terraform module

**Hands-on:** Clone a repo, let Claude find a bug, fix + commit in one session

---

## Module 4 — CLAUDE.md & Rules (20 min)

*Teaching Claude how YOUR project works*

### CLAUDE.md
- The three levels: `~/.claude/CLAUDE.md` (global), `./CLAUDE.md` (project), `./src/CLAUDE.md` (directory)
- What to include: Coding standards, architecture, build/test commands, conventions
- What NOT to include: No novels — token budget matters (keep under ~200 lines)
- `#` shortcut: Add conventions during work
- `/init` — auto-generate from codebase

### `.claude/rules/` (New)
- Path-specific rules as alternative to monolithic CLAUDE.md
- YAML frontmatter with `paths` field — rules only load when matching files are opened
- Saves context: language-specific or directory-specific guidelines load on demand
- When to use rules vs. CLAUDE.md vs. skills

### Best Practices
- Version-control your CLAUDE.md, maintain it as a team asset
- 🏢 **Reply Context:** What could a CLAUDE.md look like for a BMW VDPM project? (AKS, Helm, ArgoCD, .NET conventions)

**Hands-on:** Create a CLAUDE.md for a sample project (manual + `/init` comparison)

---

## Module 5 — Skills & Commands (30 min)

*Reusable workflows and knowledge*

### Skills (recommended approach)
- `.claude/skills/<name>/SKILL.md` with YAML frontmatter
- Two types: **Reference skills** (knowledge, style guides) and **Action skills** (invocable workflows with `/<name>`)
- Frontmatter fields: `name`, `description`, `context`, `agent`, `allowed-tools`
- `context: fork` — skill runs in isolated subagent context
- `disable-model-invocation: true` — manual-only, zero context cost until invoked
- Bundled skills: `/simplify`, `/batch`, `/debug`, `/powerup`, etc.
- Skill permissions: `/permissions` → `Skill(name)`, `Skill(name *)`
- Skill locations: `.claude/skills/` (project), `~/.claude/skills/` (personal)

### Commands (simple alternative)
- `.claude/commands/` (project) and `~/.claude/commands/` (global)
- Markdown files, `$ARGUMENTS` for parameters
- Example: `/review`, `/fix-issue 123`
- When to use commands vs. skills

**Hands-on:** Create a custom slash command + build a skill with auto-invocation

---

## Module 6 — Subagents & Agent Teams (25 min)

*Managing complexity through delegation*

### Subagents
- What are subagents? Isolated context, own tools, returns summary only
- `.claude/agents/` — definition as Markdown with frontmatter
- Built-in agents: Explore (read-only), Plan
- Custom agents: restrict tools, define role, preload specific skills
- `Task(...)` — dynamic spawning by Claude itself
- Patterns: Master-Clone vs. Lead-Specialist
- When subagents vs. CLAUDE.md context?
- 🏢 **Reply Context:** Subagent for Terraform validation or Helm chart review

### Agent Teams (Experimental — Outlook)
- Multiple independent Claude Code sessions coordinating via shared task list
- Peer-to-peer messaging between teammates
- Use cases: parallel research, competing hypotheses, feature development with ownership
- Difference to subagents: fully independent sessions, higher token cost, richer collaboration
- Currently experimental, disabled by default

**Hands-on:** Define and test a code review subagent

---

## Module 7 — MCP: External Connections (35 min)

*Connecting Claude to the outside world*

- What is MCP? (Model Context Protocol — open standard)
- `claude mcp add <name> -- <command>` — register a server
- Transport types: stdio, SSE/HTTP
- Local MCP servers: GitHub, Filesystem, databases
- Remote MCP servers: SSE/HTTP-based
- Org-managed connectors (Team/Enterprise)
- Configuration: `.mcp.json` (project, committed) vs. personal config
- MCP tool search: on by default, idle tools consume minimal context
- Debugging: `claude mcp serve`, `/mcp` to check status and token costs
- Scope hierarchy: local > project > user
- 🏢 **Reply Context:** GitHub Enterprise MCP for BMW repos, Azure DevOps potential

**Hands-on:** Set up GitHub MCP server, read/create issues from a repo

---

## Module 8 — Hooks: Guaranteeing Determinism (25 min)

*Code that ALWAYS runs — independent of the LLM*

- Hook types: Command hooks (shell), HTTP hooks (POST to URL)
- Lifecycle events: `PreToolUse`, `PostToolUse`, `SessionStart`, `UserPromptSubmit`, `Stop`, `SubagentStop`, `PreCompact`, `PermissionRequest`, `TaskCompleted`, `WorktreeCreate`, `WorktreeRemove`, `TeammateIdle`
- Matchers: Tool name matching (Bash, Edit, Write, Read, Glob, Grep, Agent, MCP tools)
- Decision control: block, allow, message, feedback, suppressOutput, continue
- Configuration: `/hooks` (interactive) or `.claude/settings.json`
- Hook output: stdout → Claude context, exit code 2 → block tool
- Async hooks: fire-and-forget for logging/telemetry
- Distinction: Hooks = deterministic, Skills = LLM-driven
- Use cases:
  - Linter/formatter after every edit
  - Block dangerous bash commands
  - Notification when task completes
  - Auto-test on test file changes
  - Inject date/context at session start

**Hands-on:** Build a hook that runs `prettier` after every file edit

---

## Module 9 — CLI & Headless Mode (30 min)

*Claude in the pipeline*

### Headless / Non-Interactive Mode
- `claude -p "prompt"` — one-shot execution
- `claude -p --output-format json|stream-json` — machine-readable output
- `--system-prompt` / `--append-system-prompt` — role specialization
- `--allowedTools` / `--disallowedTools` — tool filtering
- `--max-budget-usd` — cost control
- `--json-schema` — structured output with validation

### Session Management
- `--resume` / `--continue` — resume sessions
- `--session-id` / `--fork-session` — programmatic session control
- `-n, --name` — named sessions

### CI/CD Integration
- GitHub Actions: automated PR review
- `/install-github-app` — automatic PR reviews
- `--dangerously-skip-permissions` vs. auto mode in CI
- Security: API key management, minimal permissions

### Parallelization & Background
- Worktrees: `claude --worktree` for isolated parallel sessions
- `&` — background tasks (sessions in the background)
- `--tmux` — tmux integration for worktrees

### Dispatch & Scheduled Tasks
- Dispatch: trigger Claude Code tasks programmatically via API
- Scheduled Tasks: recurring jobs on Anthropic cloud infrastructure
- Use cases: automated daily code review, recurring report generation

### Messages API Essentials (Reference)
- SDK installation: Python (`anthropic`) + TypeScript (`@anthropic-ai/sdk`)
- Basic API call, Tool Use / Function Calling, Structured Output (JSON Schema)
- Extended Thinking API usage, Streaming, Prompt Caching
- Quick reference table: feature → parameter → model availability

### Outlook: Agent SDK
- `@anthropic-ai/claude-agent-sdk` — Node.js library for building custom agents
- Full access to tools, permissions, hooks, and subagents
- For teams embedding Claude Code into their own tools

- 🏢 **Reply Context:** GitHub Actions for Terraform PRs, automated reviews in BMW repos

**Hands-on:** Write a simple GitHub Action that uses Claude for PR reviews

---

## Module 10 — Plugins & Marketplace (10 min)

*Sharing and reusing workflows*

- What is a plugin? Bundle of skills, commands, hooks, agents, MCP servers
- Namespaced skills: `/my-plugin:review` — multiple plugins coexist
- `claude plugin install <name>` — install from marketplace
- Anthropic Marketplace: available plugins
- Creating your own marketplace (Git-based)
- Plugin structure: directory layout, manifest
- When to use plugins: reuse across repos, distribute to others/teams

**Demo:** Install and use a plugin (no hands-on needed)

---

## Module 11 — Claude Code Remote & Web (15 min)

*Claude Code without local installation*

- Claude Code in the browser: access via claude.ai (Max/Enterprise)
- When Remote vs. local? (Onboarding, pair-programming, no setup needed)
- Remote Control: share sessions, `--remote-control-session-name-prefix`
- Teleported Sessions: VS Code ↔ Remote
- Cowork: Desktop app for non-technical users (VM-based, local files)
- Limitations: permissions, performance, availability

**Demo:** Start a Claude Code Web session, show differences to CLI

---

## Module 12 — Settings, Configuration & Security (10 min)

*Fine-tuning and enterprise context*

- `.claude/settings.json` (project) vs. `~/.claude/settings.json` (global) vs. `settings.local.json` (personal)
- Managed settings: Enterprise policies
- Permission modes: default, acceptEdits, plan, auto
- Protected directories (`.husky`, etc.)
- Proxy & network configuration (corporate proxy, CA certificates)
- Cost awareness: `/cost`, token usage, subscription vs. API
- Privacy & compliance: What data is sent where?
- 🏢 **Reply Context:** Corporate proxy at BMW, data privacy requirements

**Brief overview**, no hands-on

---

## Module 13 — Best Practices & Patterns (15 min)

*Learning from experience*

- When `/clear`? (New task = new context)
- When `/compact`? (Long task, growing context)
- Understanding context costs: `/context` to inspect, feature loading overview
- Context rot: why AI gets worse the longer the conversation
- Plan mode first: plan complex features before executing
- Prompt hygiene: be specific, but don't micromanage
- Multi-agent patterns: parallel worktrees, background tasks
- Code review workflow: Claude + human in the loop
- CLAUDE.md as a team asset
- Feature comparison: CLAUDE.md vs. rules vs. skills vs. subagents — when to use what

---

## Module 14 — Capstone: Putting It All Together (25 min)

*From empty repo to productive setup*

Participants build a complete Claude Code setup:

1. Create a CLAUDE.md (+ rules)
2. Build a custom skill
3. Define a subagent
4. Connect an MCP server
5. Configure a hook
6. Sketch a CI/CD integration

**Goal:** Everyone leaves with a working, personalized setup.

**Evaluation criteria:**
- Does a new team member get a productive Claude Code experience just by cloning the repo?
- Are quality gates enforced automatically (hooks)?
- Can Claude access relevant external systems (MCP)?
- Are team conventions encoded, not just documented (skills)?

---

## Feature Coverage Matrix

| Feature | Module(s) | Depth |
|---------|-----------|-------|
| Claude.ai (Web, Projects, Artifacts, Memory) | M1 | Overview |
| Claude Apps (Desktop, Mobile, Chrome, Cowork) | M1, M11 | Overview |
| Installation & Auth | M2 | Hands-on |
| Interactive Session & Built-in Tools | M3 | Hands-on |
| Context Window & Token Management | M3, M13 | Practical |
| CLAUDE.md | M4 | Hands-on |
| `.claude/rules/` | M4 | Hands-on |
| Skills | M5 | Hands-on |
| Slash Commands | M5 | Hands-on |
| Subagents | M6 | Hands-on |
| Agent Teams | M6 | Outlook |
| MCP (Model Context Protocol) | M7 | Hands-on |
| Hooks | M8 | Hands-on |
| CLI & Headless Mode | M9 | Hands-on |
| Worktrees & Background Tasks | M9 | Practical |
| Dispatch & Scheduled Tasks | M9 | Overview |
| Messages API (SDK, Tool Use, Streaming) | M9 | Reference |
| Extended Thinking | M1, M9 | Overview + Reference |
| Multimodal / Vision / PDF | M1 | Overview |
| Prompt Caching & Batch API | M1, M9 | Overview + Reference |
| Computer Use | M1 | Overview |
| Agent SDK | M9 | Mention |
| Plugins & Marketplace | M10 | Demo |
| Claude Code Remote & Web | M11 | Demo |
| Settings & Configuration | M12 | Overview |
| Permission System | M3, M12 | Practical |
| Best Practices & Patterns | M13 | Discussion |
| Capstone (full setup) | M14 | Hands-on |

---

## TODOs

- [ ] Prepare sample repo for hands-on exercises (simple project with intentional bugs, missing tests, TODOs)
- [ ] Send participant email with prerequisites (Node.js, plan/API key, GitHub token, proxy check)
- [ ] Prepare BMW/Reply-specific CLAUDE.md examples
- [ ] Survey Plugin Marketplace: which plugins are currently relevant?
- [ ] Prepare GitHub Action template for PR review
- [ ] Create quick-reference handout (CLI commands, project file structure, keyboard shortcuts)
