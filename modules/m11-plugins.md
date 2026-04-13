# Module 11 — Plugins & Marketplace (10 min)

> *Sharing and reusing workflows*



## Contents

- [Learning Objectives](#learning-objectives)
- [1. What Is a Plugin?](#1-what-is-a-plugin)
- [2. Plugin Structure](#2-plugin-structure)
- [3. Installation & Management](#3-installation-management)
- [4. Marketplace & Official Plugins](#4-marketplace-official-plugins)
- [Demo: Plugin in Action](#demo-plugin-in-action)
- [Summary](#summary)


## Learning Objectives

By the end of this module, participants will be able to:

- Understand what a plugin is and how it differs from skills
- Recognize the plugin structure and namespacing
- Install plugins from the marketplace or Git repos
- Know when to package workflows as plugins

---

## 1. What Is a Plugin?

A **plugin** is a self-contained package that bundles multiple Claude Code extensions together:

| Component | Purpose | Example |
|-----------|---------|---------|
| **Skills** | Reusable workflows | `/my-plugin:review` — code review |
| **Commands** | Slash invocations | `/my-plugin:format-all` |
| **Hooks** | Deterministic automation | Auto-lint on edit |
| **MCP Servers** | External connections | GitHub API, Slack |

### Plugins vs. Skills

| | Skill | Plugin |
|--|-------|--------|
| **Scope** | Single workflow | Multiple related workflows |
| **Namespace** | Global (can collide) | Namespaced: `/plugin:skill` |
| **Install** | Copy to `.claude/skills/` | `claude plugin install <name>` |
| **Distribution** | Share SKILL.md file | Marketplace or Git repo |

---

## 2. Plugin Structure

A plugin lives in a directory with a `plugin.json` manifest:

```
my-plugin/
├── plugin.json              # Manifest (name, version, components)
├── skills/
│   ├── review/SKILL.md
│   └── format/SKILL.md
├── hooks/
│   └── pre-commit.json
└── .mcp.json                # Optional MCP servers
```

```json
{
  "name": "code-review-toolkit",
  "version": "1.0.0",
  "description": "Code review and quality assurance workflows",
  "skills": { "path": "skills/" },
  "hooks": { "path": "hooks/" },
  "mcp": { "path": ".mcp.json" }
}
```

### Namespacing

Plugin skills are automatically namespaced to avoid collisions:

```bash
/code-review-toolkit:review      # From plugin A
/code-review-toolkit:format
/linter-suite:eslint             # From plugin B — no collision
```

---

## 3. Installation & Management

```bash
# Install from marketplace
claude plugin install code-review-toolkit

# Install from Git repo
claude plugin install git+https://github.com/my-org/my-plugin.git

# List, update, remove
claude plugin list
claude plugin update code-review-toolkit
claude plugin remove code-review-toolkit
```

---

## 4. Marketplace & Official Plugins

Anthropic maintains official plugins in the [Claude Code repository](https://github.com/anthropics/claude-code/tree/main/plugins):

| Plugin | What It Does |
|--------|-------------|
| **code-review** | 5 parallel Sonnet agents for PR review (bugs, security, CLAUDE.md compliance) |
| **commit-commands** | `/commit`, `/commit-push-pr` — streamlined git workflows |
| **hookify** | Auto-generate hooks from conversation patterns or descriptions |
| **security-guidance** | PreToolUse hook monitoring 9 security patterns |
| **plugin-dev** | Guided plugin development toolkit |

Teams can also host plugins in private Git repos (GitHub Enterprise, GitLab, Bitbucket) for internal distribution.

---

## Demo: Plugin in Action

*(Live demo — no hands-on)*

```bash
# Install
$ claude plugin install code-review-toolkit
✓ Installed code-review-toolkit v1.0.0

# Use in session
$ claude
> /code-review-toolkit:review src/payment.ts
Found 3 issues:
  1. Missing error handling on line 42
  2. Inefficient loop on line 67
  3. Security: SQL injection risk on line 89
```

---

## Summary

| Concept | Key Takeaway |
|---------|--------------|
| **Plugin** | Bundled skills, hooks, MCP servers — for team reuse |
| **Namespacing** | `/plugin-name:skill-name` prevents collisions |
| **Installation** | `claude plugin install <name>` from marketplace or Git |
| **When to use** | Team workflows, complex setups, distribution across repos |
| **When not to** | Single-project, experimental — keep as local skills |

**Up next:** Module 12 — Claude Code Remote & Web.
