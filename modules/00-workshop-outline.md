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
| **09:30–11:00** | **Unit 1: Getting Started** | *From zero to first productive session* | M1 Ecosystem (20) · M2 Setup (15) · M3 Interactive Session (20) · M4 Interactive Session Extended (15) |
| 11:00–11:15 | ☕ Coffee Break | | |
| **11:15–12:30** | **Unit 2: Making Claude Yours** | *Project memory, workflows, delegation* | M5 CLAUDE.md & Rules (20) · M6 Skills & Commands (30) · M7 Subagents (25) |
| 12:30–13:30 | 🍽️ Lunch Break | | |
| **13:30–15:00** | **Unit 3: Integration & Automation** | *External tools, quality gates, pipelines* | M8 MCP (35) · M9 Hooks (15) · M10 CLI & Headless (15) |
| 15:00–15:15 | ☕ Coffee Break | | |
| **15:15–16:30** | **Unit 4: The Big Picture** | *Remote, settings, best practices, capstone* | M11 Plugins (10) · M12 Remote & Web (10) · M13 Settings (10) · M14 Best Practices (15) · M15 Capstone (30) |

| | Content | Available | Buffer |
|---|---------|-----------|--------|
| Unit 1 | 70 min | 90 min | 20 min (setup troubleshooting) |
| Unit 2 | 75 min | 75 min | — |
| Unit 3 | 65 min | 90 min | 25 min |
| Unit 4 | 75 min | 75 min | — |
| **Total** | **285 min** | **330 min** | **45 min** |
| (Modules) | **15 modules** | — | — |

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
| M3 | [The Interactive Session](m03-interactive-session.md) | 20 min | Hands-on | 1 |
| M4 | [Interactive Session Extended](m04-interactive-session-extended.md) | 15 min | Hands-on | 1 |
| M5 | [CLAUDE.md & Rules](m05-claudemd-rules.md) | 20 min | Hands-on | 2 |
| M6 | [Skills & Commands](m06-skills-commands.md) | 30 min | Hands-on | 2 |
| M7 | [Subagents](m07-subagents-teams.md) | 25 min | Hands-on | 2 |
| M8 | [MCP: External Connections](m08-mcp.md) | 35 min | Hands-on | 3 |
| M9 | [Hooks: Deterministic Guardrails](m09-hooks.md) | 15 min | Hands-on | 3 |
| M10 | [CLI & Headless Mode](m10-cli-headless.md) | 15 min | Hands-on | 3 |
| M11 | [Plugins & Marketplace](m11-plugins.md) | 10 min | Demo | 4 |
| M12 | [Claude Code Remote & Web](m12-remote-web.md) | 10 min | Overview | 4 |
| M13 | [Settings, Configuration & Security](m13-settings.md) | 10 min | Overview | 4 |
| M14 | [Best Practices & Patterns](m14-best-practices.md) | 15 min | Discussion | 4 |
| M15 | [Capstone: Putting It All Together](m15-capstone.md) | 30 min | Hands-on | 4 |

---

## Module 1 — The Claude Ecosystem (20 min)

*Setting the stage: Claude is more than Code*

- Claude Web (claude.ai): Chat, Projects, Artifacts, Deep Research, Memory
- Claude Apps: Desktop, Mobile, Chrome Extension, Cowork
- Claude Code: CLI, VS Code, Desktop, Web
- Claude API: Messages API, Models (Opus/Sonnet/Haiku), mention Agent SDK
- **Advanced Model Features (Outlook):** Extended Thinking, Multimodal/Vision, PDF Support, Computer Use, Prompt Caching, Batch API
- How it all connects (Subscriptions: Pro, Max, Team, Enterprise)
- Decision guide: When to use what?

**Hands-on:** Quick tour of claude.ai — create a Project, generate an Artifact, set Custom Instructions

---

## Module 2 — Installation & Setup (15 min)

*From zero to first session*

- Install Claude Code: Native installer (`curl -fsSL https://claude.ai/install.sh | bash`), Homebrew, or npm
- Verify: `claude --version`, `claude doctor`
- Authentication: Anthropic Login, API Key, 3rd-party (Bedrock, Vertex)
- First launch, model selection
- VS Code Extension: install + overview

**Hands-on:** Install together, verify with `claude doctor`, start first session, explore `/help`

---

## Module 3 — The Interactive Session (20 min)

*Understanding how Claude Code works*

- The agentic loop: Input → Tool Selection → Execution → Review
- Built-in Tools: Read, Edit, Write, Bash, Grep, Glob, WebFetch, WebSearch
- Referencing files: `@file`, `@folder`, images, URLs
- Context management: `/compact`, `/clear`, `/cost`, **`/context`** (inspect what's loaded, token costs per feature)
- Model selection: `/model` (Opus, Sonnet, Haiku — when to use which?)

**Hands-on:** Let Claude find a bug in a cloned repo, explore tool selection and context

---

## Module 4 — Interactive Session Extended (15 min)

*Mastering the daily workflow*

- Keyboard shortcuts: Navigation, tool invocation, permissions
- Permission system: default, acceptEdits, plan, auto mode, `--dangerously-skip-permissions`
- Git integration: Commits, branches, PRs from within a session
- Checkpoints: Automatic snapshots, `/rewind`, Esc×2, three restore modes
- Session management: named sessions, session history, resuming work

**Hands-on:** Fix + commit a bug in one session, practice keyboard shortcuts

---

## Module 5 — CLAUDE.md & Rules (20 min)

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

**Hands-on:** Create a CLAUDE.md for a sample project (manual + `/init` comparison)

---

## Module 6 — Skills & Commands (30 min)

*Reusable workflows and knowledge*

### Commands (start simple)
- `.claude/commands/<name>.md` — single Markdown file becomes a `/slash-command`
- Project-level (`.claude/commands/`) or personal (`~/.claude/commands/`)
- `$ARGUMENTS` for parameters — e.g. `/review @src/api.ts`

### Skills (complex workflows)
- `.claude/skills/<name>/SKILL.md` with YAML frontmatter
- Two types: **Reference skills** (auto-loaded knowledge) and **Action skills** (invoked with `/name`)
- Frontmatter: `allowed-tools`, `context: fork`, `model`, `paths`
- Can include templates, examples, scripts in the skill directory
- String substitutions (`$1`, `${CLAUDE_SKILL_DIR}`) and dynamic context (`!`backtick``)
- Bundled skills: `/batch`, `/debug`, `/loop`, `/simplify`, `/plan`
- Priority: Enterprise > Personal > Project > Plugin

**Hands-on:** Create a custom slash command + build a skill with auto-invocation

---

## Module 7 — Subagents (25 min)

*Managing complexity through delegation*

### Subagents
- What are subagents? Isolated context, own tools, returns summary only
- `.claude/agents/` — definition as Markdown with frontmatter
- Built-in agents: Explore (read-only), Plan
- Custom agents: restrict tools, define role, preload specific skills
- `Task(...)` — dynamic spawning by Claude itself
- When subagents vs. CLAUDE.md context?

### Tool Control & MCP in Subagents
- Restrict tool access in agent definitions
- MCP servers and memory scoped to subagent context
- Subagents as specialized workers with specific tool access

**Hands-on:** Define and test a code review subagent

---

## Module 8 — MCP: External Connections (35 min)

*Connecting Claude to the outside world*

- What is MCP? (Model Context Protocol — open standard)
- Where do MCP servers come from? (npm packages, plugins, custom, cloud endpoints)
- Transport types: stdio (local processes), HTTP (cloud services)
- `claude mcp add` — register a server (HTTP and stdio examples)
- Configuration: `.mcp.json` (project, committed) vs. personal config
- Scope hierarchy: local > project > user
- Management: `claude mcp list/get/remove`, `/mcp` in session

**Hands-on:** Set up a local Filesystem MCP server, read/write files through Claude

---

## Module 9 — Hooks: Deterministic Guardrails (15 min)

*Code that ALWAYS runs — independent of the LLM*

- What are hooks? Shell commands at lifecycle events — always execute, not optional
- Key lifecycle events: `PreToolUse`, `PostToolUse`, `SessionStart`, `Stop`
- Matchers: Filter by tool name (Bash, Edit, Write, etc.)
- Exit codes: 0 = continue, 2 = block tool execution
- Hook input: `$TOOL_INPUT` environment variable (JSON)
- Hook output: stdout → injected into Claude's context
- Configuration: `.claude/settings.json` under `"hooks"` key, or `/hooks` interactively
- Hooks vs. Skills: Hooks = deterministic guardrails, Skills = LLM-driven workflows
- Hooks also run in headless mode (`claude -p`) — guardrails apply in CI/CD too

**Hands-on:** Build a security hook that blocks dangerous Bash commands (PreToolUse)

---

## Module 10 — CLI & Headless Mode (15 min)

*Claude in the pipeline*

### Headless / Non-Interactive Mode
- `claude -p "prompt"` — one-shot execution
- `--output-format text|json|stream-json` — machine-readable output
- `--system-prompt` / `--append-system-prompt` — role specialization
- `--allowedTools` / `--disallowedTools` — tool filtering
- `--max-budget-usd` — cost control

### Session Management
- `--resume` / `--continue` — resume sessions
- `-n, --name` — named sessions

### CI/CD Integration
- GitHub Actions: automated PR review
- `/install-github-app` — automatic PR reviews
- `--dangerously-skip-permissions` — permissions in CI
- Security: API key management, minimal tool access

**Hands-on:** Write a simple GitHub Action that uses Claude for PR reviews

---

## Module 11 — Plugins & Marketplace (10 min)

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

## Module 12 — Claude Code Remote & Web (10 min)

*Claude Code without local installation*

- Claude Code in the browser: access via claude.ai (Max/Enterprise)
- When Remote vs. local? (Onboarding, pair-programming, no setup needed)
- Cowork: Desktop app for non-technical users (VM-based, local files)
- Limitations: permissions, performance, availability

**Overview:** Show Claude Code Web, compare with CLI experience

---

## Module 13 — Settings, Configuration & Security (10 min)

*Fine-tuning and enterprise context*

- `.claude/settings.json` (project) vs. `~/.claude/settings.json` (global) vs. `settings.local.json` (personal)
- Managed settings: Enterprise policies
- Permission modes: default, acceptEdits, plan, auto
- Protected directories (`.husky`, etc.)
- Proxy & network configuration (corporate proxy, CA certificates)
- Cost awareness: `/cost`, token usage, subscription vs. API
- Privacy & compliance: What data is sent where?

**Brief overview**, no hands-on

---

## Module 14 — Best Practices & Patterns (15 min)

*Learning from experience*

- When `/clear`? (New task = new context)
- When `/compact`? (Long task, growing context)
- Understanding context costs: `/context` to inspect, feature loading overview
- Context rot: why AI gets worse the longer the conversation
- Plan mode first: plan complex features before executing
- Prompt hygiene: be specific, but don't micromanage
- Delegation: use subagents for focused, isolated work
- Code review workflow: Claude + human in the loop
- CLAUDE.md as a team asset
- Feature comparison: CLAUDE.md vs. rules vs. skills vs. subagents — when to use what

---

## Module 15 — Capstone: Putting It All Together (30 min)

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
| Claude Apps (Desktop, Mobile, Chrome, Cowork) | M1, M12 | Overview |
| Installation & Auth | M2 | Hands-on |
| Agentic Loop & Built-in Tools | M3 | Hands-on |
| Context Window & Token Management | M3, M14 | Practical |
| Keyboard Shortcuts & Permissions | M4 | Hands-on |
| Git Integration & Checkpoints | M4 | Hands-on |
| Session Management | M4 | Hands-on |
| CLAUDE.md | M5 | Hands-on |
| `.claude/rules/` | M5 | Hands-on |
| Skills | M6 | Hands-on |
| Slash Commands | M6 | Hands-on |
| Subagents | M7 | Hands-on |
| MCP (Model Context Protocol) | M8 | Hands-on |
| Hooks | M9 | Hands-on |
| CLI & Headless Mode | M10 | Hands-on |
| CI/CD Integration | M10 | Hands-on |
| Extended Thinking | M1 | Overview |
| Multimodal / Vision / PDF | M1 | Overview |
| Computer Use | M1 | Overview |
| Plugins & Marketplace | M11 | Demo |
| Claude Code Remote & Web | M12 | Overview |
| Settings & Configuration | M13 | Overview |
| Permission System | M4, M13 | Practical |
| Best Practices & Patterns | M14 | Discussion |
| Capstone (full setup) | M15 | Hands-on |

---

## TODOs

- [ ] Prepare sample repo for hands-on exercises (simple project with intentional bugs, missing tests, TODOs)
- [ ] Send participant email with prerequisites (Node.js, plan/API key, GitHub token, proxy check)
- [ ] Survey Plugin Marketplace: which plugins are currently relevant?
- [ ] Prepare GitHub Action template for PR review
- [ ] Create quick-reference handout (CLI commands, project file structure, keyboard shortcuts)
