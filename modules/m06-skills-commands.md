# Module 6 — Skills & Commands (30 min)

> *Reusable workflows and knowledge*



## Contents

- [Learning Objectives](#learning-objectives)
- [1. Commands & Skills — Overview](#1-commands-skills-overview)
- [2. Commands](#2-commands)
- [3. Skills — Structure & Frontmatter](#3-skills-structure-frontmatter)
- [4. Two Types of Skills](#4-two-types-of-skills)
- [5. String Substitutions & Dynamic Context](#5-string-substitutions-dynamic-context)
- [6. Bundled Skills](#6-bundled-skills)
- [7. Priority, Loading & Permissions](#7-priority-loading-permissions)
- [Hands-On Exercise (10 min)](#hands-on-exercise-10-min)
- [Summary](#summary)


## Learning Objectives

By the end of this module, participants will be able to:

- Understand the difference between commands and skills
- Create simple slash commands for quick shortcuts
- Create reference skills and action skills
- Use YAML frontmatter to configure skill behavior
- Use string substitutions and dynamic context injection
- Know when to use commands vs. skills vs. CLAUDE.md

---

## 1. Commands & Skills — Overview

CLAUDE.md teaches Claude *what to know* (Module 5). **Commands** and **skills** teach Claude *what to do*.

| | Commands | Skills |
|---|---|---|
| **What** | Simple prompt shortcuts | Complex, multi-file workflows |
| **Location** | `.claude/commands/name.md` | `.claude/skills/name/SKILL.md` |
| **Invoked with** | `/name` | `/name` |
| **Includes templates?** | No | Yes (examples, scripts, helpers) |
| **Fork context?** | No | Yes (with `context: fork`) |
| **Control model/tools?** | No | Yes (via frontmatter) |
| **Arguments** | Basic `$ARGUMENTS` | Full `$0`, `$1`, `${CLAUDE_*}` |
| **When to use** | Quick shortcuts | Repeatable automation |

**Rule of thumb:** Start with a command. If you need templates, tool restrictions, or isolated context — upgrade to a skill.

---

## 2. Commands

Commands are the simplest way to create reusable prompts. A single Markdown file in `.claude/commands/` becomes a slash command.

### Structure

```
.claude/commands/
├── review.md           →  /review
├── test-coverage.md    →  /test-coverage
└── deploy-check.md     →  /deploy-check
```

Also works at user level: `~/.claude/commands/` (available across all projects).

### Format

Just Markdown with optional YAML frontmatter:

```markdown
---
description: Review code for best practices
---

# Code Review

You are a senior engineer reviewing the provided code.
Check: readability, performance, security, test coverage.
Provide specific feedback with examples.
```

### Usage

```bash
claude> /review
claude> /review @src/api.ts
```

---

## 3. Skills — Structure & Frontmatter

Skills are more powerful: they live in a directory, can include templates, examples, scripts, and have fine-grained control via YAML frontmatter.

### Directory Layout

```
.claude/skills/
├── api-review/
│   ├── SKILL.md              (Main skill definition)
│   ├── checklist.md          (Reference doc)
│   ├── examples/             (Code examples)
│   └── scripts/              (Helper utilities)
├── refactor/
│   └── SKILL.md
└── batch-fix/
    └── SKILL.md
```

Skills can be project-level (`.claude/skills/`), personal (`~/.claude/skills/`), or enterprise-managed.

### Frontmatter Fields

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `name` | string | Required | Slug for `/skillname` |
| `description` | string | Required | One-line summary shown in `/help` |
| `user-invocable` | bool | true | Can be called with `/skillname`? |
| `disable-model-invocation` | bool | false | If true, only invokable manually |
| `allowed-tools` | list | all | Restrict to specific tools: `[Read, Edit, Bash, Grep]` |
| `context` | string | inherit | `fork`: isolated subagent. `inherit`: parent context |
| `model` | string | (inherit) | Force model: `opus`, `sonnet`, `haiku` |
| `paths` | list | (none) | Only load for matching files: `["src/**/*.ts"]` |
| `argument-hint` | string | (none) | Usage hint: `"[file-path]"` |
| `agent` | bool | false | Run as full agentic workflow |

See `exercises/m06-skills-commands/SKILL-FORMAT-REFERENCE.md` for a complete example with all frontmatter fields. The same folder contains example commands and a full skill.

---

## 4. Two Types of Skills

### Reference Skills (Knowledge)

Loaded automatically — never invoked by `/command`. Use for style guides, architecture patterns, checklists.

Key frontmatter: `user-invocable: false` and `disable-model-invocation: true`.

When Claude starts a session, it reads these and applies them throughout. Example use cases: testing patterns your team follows, API design conventions, security checklists.

### Action Skills (Workflows)

Invoked with `/skillname`. Can be complex, multi-step workflows with isolated context.

Key frontmatter: `user-invocable: true`, often with `context: fork` and `model: opus`.

Example use cases: code review with checklist + examples, refactoring with before/after templates, deployment checklists that run validation scripts.

---

## 5. String Substitutions & Dynamic Context

### String Substitutions

Inject dynamic values into skill content:

| Variable | Value |
|----------|-------|
| `$ARGUMENTS` | Everything after `/skillname` |
| `$1`, `$2`, etc. | Positional arguments |
| `${CLAUDE_SESSION_ID}` | Current session ID |
| `${CLAUDE_SKILL_DIR}` | Directory containing the skill |

Example: `/fix-issue 42 urgent` → `$1`=`42`, `$2`=`urgent`, `$ARGUMENTS`=`42 urgent`

### Dynamic Context Injection

Run shell commands before the skill loads using the `!` backtick syntax:

```markdown
# Deployment Status

Current pods: !`kubectl get pods -o wide`
Docker status: !`docker ps -a | grep myapp`

Based on the above, check for errors...
```

The command output is injected before Claude sees the skill content — useful for pulling live system state into a skill.

---

## 6. Bundled Skills

Claude Code comes with built-in skills you can use as templates:

| Skill | Purpose | Usage |
|-------|---------|-------|
| `/batch` | Refactor large codebases in parallel | `/batch "Convert all var to const"` |
| `/debug` | Troubleshoot errors with deep analysis | `/debug npm run build` |
| `/loop` | Run a task repeatedly until converged | `/loop "Run tests until all pass"` |
| `/simplify` | Refactor code for readability | `/simplify src/complex.js` |
| `/plan` | Show a multi-step plan before executing | `/plan "Migrate database schema"` |

---

## 7. Priority, Loading & Permissions

### Loading Order

When skills exist at multiple levels, higher priority wins for same-name conflicts:

Enterprise (highest) → Personal `~/.claude/skills/` → Project `.claude/skills/` → Plugin (lowest)

### Tool Permissions

Control what each skill can do with `allowed-tools` in frontmatter. A skill with `allowed-tools: [Read, Bash]` can read files and run commands but cannot edit code or delete anything. Users can grant additional permissions at runtime with `/permissions`.

---

## Hands-On Exercise (10 min)

> We continue working in `exercises/sample-project/`. Reference examples for commands and skills are in `exercises/m06-skills-commands/`.

### Create a Custom Slash Command

**Step 1: Create a Simple Command**

```bash
mkdir -p .claude/commands

cat > .claude/commands/review.md << 'EOF'
---
description: Review provided code for best practices
---

# Code Review

You are reviewing code for:
- Readability
- Performance
- Security
- Test coverage
- Maintainability

Provide specific feedback with examples.
EOF
```

**Step 2: Use the Command**

```bash
claude
# Then in session:
/review @src/main.js
```

### Build a Full Skill with Templates

**Step 3: Create a Multi-File Skill**

```bash
mkdir -p .claude/skills/refactor-class/{examples,scripts}

cat > .claude/skills/refactor-class/SKILL.md << 'EOF'
---
name: refactor-class
description: Refactor a class to use modern patterns
user-invocable: true
context: fork
model: opus
argument-hint: "[file-path]"
allowed-tools: [Read, Edit, Bash]
---

# Refactor Class to Modern Patterns

File to refactor: $ARGUMENTS

## Patterns to Apply

See ${CLAUDE_SKILL_DIR}/examples/before-after.md

## Steps
1. Read the current implementation
2. Identify improvement opportunities
3. Refactor using modern patterns
4. Ensure tests still pass

!`npm test $1`
EOF
```

**Step 4: Invoke and Verify**

```bash
claude> /refactor-class src/User.js
# Skill runs in isolated context, uses examples and scripts

ls -R .claude/skills/refactor-class/
```

### Expected Outcome

- Created a simple slash command (`/review`)
- Built a complex skill with examples and templates (`/refactor-class`)
- Both are reusable and team-shareable (checked into repo)

---

## Summary

| Concept | Key Takeaway |
|---------|--------------|
| **Commands** | Simple shortcuts — single Markdown file in `.claude/commands/` |
| **Skills** | Complex workflows — directory with SKILL.md, examples, scripts |
| **Reference skills** | Auto-loaded knowledge (`user-invocable: false`) |
| **Action skills** | On-demand workflows (`user-invocable: true`) |
| **Frontmatter** | Controls tools, context, model, paths |
| **Substitutions** | `$ARGUMENTS`, `$1`, `${CLAUDE_SKILL_DIR}` |
| **Dynamic context** | `!`backtick`` injects live shell output |
| **Priority** | Enterprise > Personal > Project > Plugin |

**Next module:** Module 7 covers Subagents — how to delegate and orchestrate multi-agent workflows.

