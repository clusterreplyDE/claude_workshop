# Module 6 — Subagents & Agent Teams (25 min)

> *Managing complexity through delegation*

## Learning Objectives

By the end of this module, participants will be able to:

- Understand what subagents are and when to use them for task delegation
- Define custom subagents using the `.claude/agents/<name>.md` format
- Configure subagent permissions, tools, and roles
- Invoke subagents naturally and via @-mentions
- Recognize the difference between subagents and agent teams
- Design Master-Clone and Lead-Specialist team patterns

---

## 1. Subagents: Isolated Context Windows

Subagents are **separate Claude instances with their own context windows, tools, and role definitions**. When you invoke a subagent, it:

- Receives a fresh, isolated context (not your current session)
- Has access only to the tools you've explicitly allowed
- Executes independently and returns a summary to you
- Preserves no memory of previous invocations unless explicitly shared

### Why Use Subagents?

| Reason | Example |
|--------|---------|
| **Role specialization** | Code reviewer (restricted to read-only), DevOps engineer (Bash + MCP only), QA analyst |
| **Tool isolation** | Prevent accidental writes, limit dangerous operations, enforce read-only audits |
| **Focused context** | Each agent tackles a specific problem without codebase noise |
| **Parallel work** | Multiple subagents can work on different parts simultaneously (future: agent teams) |
| **Cost efficiency** | Use faster/cheaper models (Haiku) for specific tasks |

---

## 2. Defining Subagents

Subagents are defined in `.claude/agents/<name>.md` files within your project or globally.

### File Format

Each subagent definition uses **YAML frontmatter** (at the top) followed by optional markdown content:

```markdown
---
name: code-reviewer
description: Reviews code for style, security, and best practices
tools:
  - Read
  - Grep
model: opus
permissionMode: auto
maxTurns: 5
---

# Code Review Agent

You are an expert code reviewer. Focus on:
- Security vulnerabilities
- Performance issues
- Code style and maintainability
- Test coverage

Provide constructive feedback and suggest improvements.
```

### Frontmatter Fields Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Unique identifier (used in @-mentions and CLI) |
| `description` | string | No | One-line summary shown in UI |
| `tools` | list | No | Allowlist of tool names. Example: `[Read, Grep, Bash]` |
| `disallowedTools` | list | No | Denylist of tools to block. Example: `[Write, Edit]` |
| `model` | string | No | Model override. Default: inherits from parent. Options: `haiku`, `sonnet`, `opus` |
| `permissionMode` | string | No | `auto` (allow all), `strict` (ask for each), `skip` (no prompts in CI). Default: `auto` |
| `maxTurns` | integer | No | Max conversation turns before auto-stop |
| `skills` | list | No | Preload skills for this agent. Example: `[git-log, branch-compare]` |
| `mcpServers` | list | No | Inline MCP definitions or references by name |
| `hooks` | list | No | Lifecycle hooks specific to this agent |
| `memory` | object | No | Scope settings: `{user: true, project: true, local: false}` |
| `background` | string | No | Background knowledge/context injected at start |
| `effort` | string | No | Guidance on effort level. Options: `low`, `medium`, `high` |
| `isolation` | object | No | Worktree settings: `{enabled: true, path: "path/to/dir"}` |
| `color` | string | No | Terminal UI color for this agent (hex or CSS color name) |
| `initialPrompt` | string | No | Custom system prompt prepended before role definition |

### Example: Code Review Agent (Read-Only)

```markdown
---
name: code-reviewer
description: Security and style reviewer, read-only
tools:
  - Read
  - Grep
  - Glob
model: opus
permissionMode: auto
---

You are a senior code reviewer with expertise in security, performance, and maintainability.

Your role:
1. Review code for security vulnerabilities
2. Check for performance anti-patterns
3. Assess code clarity and maintainability
4. Suggest improvements with rationale

Be concise and prioritize critical issues.
```

### Example: Infrastructure Specialist (Bash + MCP)

```markdown
---
name: infra-specialist
description: Terraform and Helm review
tools:
  - Read
  - Bash
disallowedTools:
  - Write
  - Edit
mcpServers:
  - type: stdio
    name: terraform-validator
    command: terraform-lint
---

You are a DevOps engineer specializing in infrastructure-as-code.

Your tasks:
1. Validate Terraform configurations
2. Check for security and compliance issues
3. Review Helm charts for best practices
4. Suggest optimizations

Use the terraform-validator MCP for advanced checks.
```

---

## 3. Built-In Subagents

Claude Code comes with three pre-configured subagents:

| Agent | Model | Tools | Use Case |
|-------|-------|-------|----------|
| **Explore** | Haiku | WebSearch, WebFetch, Read-only | Fast web research, documentation lookup |
| **Plan** | Inherits from parent | Read, Grep, Glob | Break down tasks, create specifications |
| **General-Purpose** | Inherits from parent | All tools | Fallback for general work when role isn't critical |

Access built-ins via:
```
@Explore "Research the latest React patterns"
@Plan "Break down this refactoring task"
```

---

## 4. Tool Access Patterns

### Allowlist Approach (Recommended)

Explicitly list tools the agent CAN use:

```yaml
tools:
  - Read
  - Grep
  - Glob
```

The agent has **only** Read, Grep, and Glob. Everything else is blocked.

### Denylist Approach

Explicitly list tools the agent CANNOT use (all others allowed):

```yaml
disallowedTools:
  - Write
  - Edit
  - Bash
```

The agent can use everything except Write, Edit, and Bash.

### Wildcards (Advanced)

Match tools with glob patterns:

```yaml
tools:
  - Bash(git *)         # Only git commands
  - Edit(*.ts)          # Only TypeScript files
  - Grep(src/**/*)      # Only in src/ directory
```

---

## 5. Invocation Patterns

### Natural Language (Most Flexible)

Invoke a subagent by name in your prompt:

```
Ask the code-reviewer to check this function for security issues.
```

Claude will automatically identify the task and delegate to `code-reviewer`.

### @-Mention Syntax

Explicitly invoke a subagent:

```
@"code-reviewer" Review the authentication module for vulnerabilities.
```

Use quotes if the agent name has spaces: `@"code review expert"`

### Session-Wide Assignment

Start a session with a specific subagent as primary:

```bash
claude --agent code-reviewer
# All subsequent prompts routed to code-reviewer
```

### Dynamic Task Spawning

Claude can autonomously spawn subagents for specific tasks:

```
I need this code reviewed AND the tests updated.
```

Claude might invoke `@code-reviewer` for code review and `@test-writer` for tests in parallel.

---

## 6. Team Patterns

### Master-Clone Pattern

One master coordinator spawns multiple identical workers for parallel tasks:

```markdown
---
name: parallel-worker
description: Generic worker for parallel tasks
tools: [Read, Bash, Edit]
---

You are a skilled developer. Execute the assigned task efficiently.
```

**When to use:** Parallel refactoring across multiple files, batch processing, distributed code generation.

### Lead-Specialist Pattern

A lead agent coordinates with specialist subagents:

```markdown
---
name: lead
description: Project lead coordinating specialists
---

You oversee the project. Delegate tasks to:
- @backend-engineer: Handles API and database work
- @frontend-engineer: Handles UI and client work
- @qa-engineer: Handles testing and validation
```

**When to use:** Cross-layer projects, complex architectures, teams with specialized roles.

---

## 7. MCP in Subagents

### Inline Definition

Define MCP servers directly in the subagent:

```yaml
---
name: github-reviewer
tools:
  - Read
  - Grep
mcpServers:
  - type: stdio
    name: github-mcp
    command: npx
    args:
      - "@modelcontextprotocol/server-github"
---
```

### Reference by Name

Use an MCP server defined globally or in project scope:

```yaml
---
name: github-reviewer
mcpServers:
  - name: github           # Defined in .mcp.json
---
```

---

## 8. Memory in Subagents

Subagents can access persistent memory at different scopes:

```yaml
---
name: code-reviewer
memory:
  user: true              # Access global user memory
  project: true           # Access project memory (CLAUDE.md)
  local: false            # Don't use local worktree memory
---
```

Use memory to provide context (team standards, project history) without cluttering the agent's session.

---

## 9. Output & Return

When a subagent completes, you receive:

- **Summary**: Concise result of what the agent did
- **Artifacts**: Generated code, documents, or reports
- **Context**: Key findings injected into your session for follow-up work

Subagents **do not** return raw tool outputs — only human-readable summaries.

---

> 🏢 **Reply Context:** At BMW Aftersales, subagents are valuable for:
> - **Terraform Reviewer**: Dedicated agent for infrastructure validation (read-only, no destructive Bash)
> - **Helm Chart Auditor**: Specialized agent for Kubernetes manifests and security checks
> - **PR Code Review**: Gate PRs with a read-only code-reviewer before merging to main
> - **Compliance Checker**: Specialized agent for EU/ISO compliance validation (read-only, can reference compliance documentation)

---

## Agent Teams (Experimental)

### What Are Agent Teams?

Agent teams enable **multiple independent Claude Code sessions coordinating in real-time**, each with their own context window and acting as equal peers. This is different from subagents (which are isolated but initiated by a parent).

### Enabling Agent Teams

Agent teams require an experimental feature flag:

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
claude
```

### Architecture

| Component | Description |
|-----------|-------------|
| **Team Lead** | Initiates the team and coordinates work |
| **Teammates** | Independent Claude Code sessions, full tool access |
| **Shared Task List** | Central work queue visible to all members |
| **Mailbox Messaging** | Peer-to-peer async communication between teammates |

### Display Modes

**In-Process (Default)**
- Press **Shift+Down** to cycle between active teammates
- All sessions in one terminal window

**Split Panes**
- Use **tmux** or **iTerm2** split panes for side-by-side view of multiple teammates
- Each pane is an independent session with its own context

### Use Cases

| Pattern | Example |
|---------|---------|
| **Parallel Research** | Frontend team researches React patterns while backend team researches API design |
| **Competing Hypotheses** | Two agents independently solve a problem, compare approaches, pick the best |
| **Cross-Layer Coordination** | Backend agent works on DB schema, frontend agent works on components, QA validates integration |
| **Parallel Testing** | Multiple agents test different features in parallel, consolidate results |

### Differences: Subagents vs. Teams

| Aspect | Subagents | Teams |
|--------|-----------|-------|
| **Initiator** | Called by a parent session | All peers, no hierarchy |
| **Session** | Shared context window | Fully independent sessions |
| **Token Cost** | Cheap (single context) | Higher (N independent contexts) |
| **Collaboration** | Request-response | Peer-to-peer messaging |
| **UI** | Inline in parent | Split panes or Shift+Down cycling |
| **Persistence** | Can be resumed by parent | No session resumption |

### Limitations

- **One team per session** — can't nest teams
- **No session resumption** — agent teams end when the lead session ends
- **Higher token cost** — each teammate is a full Claude instance
- **Experimental** — behavior may change in future releases

---

## Hands-On Exercise (5 min)

### Define and Test a Code Review Subagent

**Goal:** Create a read-only code-review agent and test it on your own project.

#### Step 1: Create the Subagent Definition

Create `.claude/agents/code-reviewer.md`:

```markdown
---
name: code-reviewer
description: Reviews code for security and maintainability
tools:
  - Read
  - Grep
  - Glob
model: opus
permissionMode: auto
---

You are an expert code reviewer. When reviewing code:

1. **Security**: Look for vulnerabilities, injection risks, authentication issues
2. **Performance**: Identify inefficiencies, N+1 queries, memory leaks
3. **Maintainability**: Check for clarity, test coverage, documentation
4. **Best Practices**: Enforce team standards and patterns

Be concise. Prioritize critical issues (security > performance > style).
Provide actionable suggestions with brief rationale.
```

#### Step 2: Test the Subagent

In a Claude Code session:

```
@code-reviewer Review the authentication module in src/auth.ts for security issues.
```

#### Step 3: Observe

- The agent reviews the file without write access
- You receive a summary of findings
- No changes are made to your codebase

#### Follow-Up

Try refining the agent:
- Restrict to specific file patterns: `tools: [Read(src/**/*.ts), Grep]`
- Add a `disallowedTools` list for extra safety
- Set `model: haiku` to make it faster for large codebases

---

## Summary

| Concept | Key Point |
|---------|-----------|
| **Subagents** | Isolated Claude instances with defined roles and tool restrictions |
| **Definition** | `.claude/agents/<name>.md` with YAML frontmatter |
| **Invocation** | Natural language, @-mention syntax, or CLI `--agent` flag |
| **Patterns** | Master-Clone (parallel workers), Lead-Specialist (coordinated roles) |
| **Tool Control** | Allowlist (safer) or denylist (flexible) |
| **Agent Teams** | Experimental: multiple equal peers coordinating (higher cost, full independence) |
| **Use Case** | Delegate specialized work, enforce permissions, reduce token cost with Haiku |

**Up next:** Module 7 — MCP: External Connections (connecting Claude to GitHub, Jira, databases, and more).
