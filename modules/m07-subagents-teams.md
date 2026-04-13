# Module 7 — Subagents (25 min)

> *Managing complexity through delegation*



## Contents

- [Learning Objectives](#learning-objectives)
- [1. Subagents: Isolated Context Windows](#1-subagents-isolated-context-windows)
- [2. Defining Subagents](#2-defining-subagents)
- [3. Built-In Subagents](#3-built-in-subagents)
- [4. Tool Access Patterns](#4-tool-access-patterns)
- [5. Invocation Patterns](#5-invocation-patterns)
- [6. Output & Return](#6-output-return)
- [Hands-On Exercise (5 min)](#hands-on-exercise-5-min)
- [Summary](#summary)


## Learning Objectives

By the end of this module, participants will be able to:

- Understand what subagents are and when to use them
- Define custom subagents with tool restrictions, MCP servers, and memory
- Invoke subagents naturally, via @-mentions, or CLI
- Use built-in subagents (Explore, Plan, General-Purpose)
- Control tool access with allowlists, denylists, and wildcards

---

## 1. Subagents: Isolated Context Windows

Subagents are **separate Claude instances with their own context, tools, and role**. When you invoke a subagent, it receives a fresh context, executes independently, and returns a summary to you.

### Why Use Subagents?

| Reason | Example |
|--------|---------|
| **Role specialization** | Code reviewer (read-only), DevOps engineer (Bash + MCP) |
| **Tool isolation** | Prevent accidental writes, enforce read-only audits |
| **Focused context** | Each agent tackles a specific problem without noise |
| **Cost efficiency** | Use Haiku for simple tasks, Opus for complex ones |

---

## 2. Defining Subagents

Subagents are defined in `.claude/agents/<name>.md` — YAML frontmatter plus a role prompt.

### Frontmatter Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Unique identifier (used in @-mentions and CLI) |
| `description` | string | One-line summary |
| `tools` | list | Allowlist: `[Read, Grep, Bash]` |
| `disallowedTools` | list | Denylist: `[Write, Edit]` |
| `model` | string | Override model: `haiku`, `sonnet`, `opus` |
| `permissionMode` | string | `auto`, `strict`, or `skip` (CI) |
| `maxTurns` | integer | Max turns before auto-stop |
| `mcpServers` | list | MCP servers (inline or by name) |
| `memory` | object | Scope: `{user: true, project: true, local: false}` |

### Example: Infrastructure Specialist

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
memory:
  user: false
  project: true
---

You are a DevOps engineer specializing in infrastructure-as-code.

Your tasks:
1. Validate Terraform configurations
2. Check for security and compliance issues
3. Review Helm charts for best practices
4. Suggest optimizations

Use the terraform-validator MCP for advanced checks.
```

This example shows the key capabilities combined: tool restrictions (`tools` + `disallowedTools`), an inline MCP server definition (`mcpServers`), and memory scoping (`memory`).

> **Note:** The `mcpServers` block connects this subagent to an external tool. MCP is covered in detail in Module 8 — for now, just know that it lets agents access external systems.

---

## 3. Built-In Subagents

Claude Code comes with three pre-configured subagents:

| Agent | Model | Tools | Use Case |
|-------|-------|-------|----------|
| **Explore** | Haiku | Read-only, WebSearch | Fast research, documentation lookup |
| **Plan** | Inherits | Read, Grep, Glob | Break down tasks, create specs |
| **General-Purpose** | Inherits | All tools | Fallback for general work |

---

## 4. Tool Access Patterns

### Allowlist (Recommended)

Explicitly list tools the agent CAN use — everything else is blocked:

```yaml
tools:
  - Read
  - Grep
  - Glob
```

### Denylist

Block specific tools — all others are allowed:

```yaml
disallowedTools:
  - Write
  - Edit
  - Bash
```

### Wildcards

Restrict tools to specific patterns:

```yaml
tools:
  - Bash(git *)         # Only git commands
  - Edit(*.ts)          # Only TypeScript files
  - Grep(src/**/*)      # Only in src/ directory
```

---

## 5. Invocation Patterns

**Natural language** — Claude auto-delegates:
```
Ask the code-reviewer to check this function for security issues.
```

**@-mention** — explicit invocation:
```
@"code-reviewer" Review the authentication module for vulnerabilities.
```

**CLI** — start a session with a specific agent:
```bash
claude --agent code-reviewer
```

**Dynamic** — Claude can autonomously spawn subagents when it identifies subtasks that benefit from specialization.

---

## 6. Output & Return

When a subagent completes, you receive a **summary** of what it did, any generated artifacts, and key findings injected into your session. Subagents return human-readable summaries, not raw tool outputs.

---

## Hands-On Exercise (5 min)

### Define and Test a Code Review Subagent

**Step 1: Create the Definition**

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

1. **Security**: Vulnerabilities, injection risks, auth issues
2. **Performance**: Inefficiencies, N+1 queries, memory leaks
3. **Maintainability**: Clarity, test coverage, documentation

Be concise. Prioritize: security > performance > style.
```

**Step 2: Test It**

```
@code-reviewer Review the authentication module in src/auth.ts
```

**Step 3: Refine**

- Restrict to file patterns: `tools: [Read(src/**/*.ts), Grep]`
- Set `model: haiku` for faster reviews on large codebases
- Add `disallowedTools: [Write, Edit]` for extra safety

---

## Summary

| Concept | Key Point |
|---------|-----------|
| **Subagents** | Isolated Claude instances with defined roles and tool restrictions |
| **Definition** | `.claude/agents/<name>.md` with YAML frontmatter |
| **Invocation** | Natural language, @-mention, or CLI `--agent` flag |
| **Tool control** | Allowlist (safer) or denylist (flexible), with wildcards |
| **MCP & Memory** | Attach MCP servers and scope memory directly in frontmatter |
| **Built-ins** | Explore (fast research), Plan (specs), General-Purpose (fallback) |

**Up next:** Module 8 — MCP: External Connections (connecting Claude to GitHub, Jira, databases, and more).
