# Module 9 — Hooks: Deterministic Guardrails (15 min)

> *Code that ALWAYS runs — independent of the LLM*



## Contents

- [Learning Objectives](#learning-objectives)
- [1. What Are Hooks?](#1-what-are-hooks)
- [2. Lifecycle Events](#2-lifecycle-events)
- [3. Configuration](#3-configuration)
- [Hands-On Exercise (10 min)](#hands-on-exercise-10-min)
- [Summary](#summary)


## Learning Objectives

By the end of this module, participants will be able to:

- Understand what hooks are and how they differ from skills
- Know the most important lifecycle events
- Configure a hook in `.claude/settings.json`
- Build and test a simple hook hands-on

---

## 1. What Are Hooks?

Hooks are **shell scripts or commands that run automatically at specific points** in a Claude Code session. Unlike skills (which Claude *chooses* to use), hooks **always execute** when their trigger event fires.

### The Core Idea

```
Claude wants to run a Bash command
         ↓
  Hook fires (PreToolUse)          ← Your code, always runs
  Your script checks the command
         ↓
  Exit 0 → Tool executes normally
  Exit 2 → Tool BLOCKED, Claude sees error message
```

Think of hooks like **git hooks** (pre-commit, pre-push) — deterministic checks that run regardless of developer intent.

### Hooks vs. Skills

| | Hooks | Skills |
|--|-------|--------|
| **Who decides?** | Always runs at event | Claude chooses to invoke |
| **Purpose** | Guardrails, automation, policy | Augment Claude's capabilities |
| **Example** | "Block `rm -rf`" | "Write a unit test" |
| **Guarantee** | 100% deterministic | Probabilistic (LLM decides) |

**Rule of thumb:** If it *must* happen every time → Hook. If it *should* happen when useful → Skill.

---

## 2. Lifecycle Events

Hooks can trigger at various points. The most important ones:

| Event | When it fires | Example Use |
|-------|--------------|-------------|
| **PreToolUse** | Before Claude executes a tool | Block dangerous commands |
| **PostToolUse** | After a tool finishes | Auto-format code, run linter |
| **SessionStart** | Session begins | Inject project context |
| **Stop** | Session ends | Clean up, notify |

There are more events (SubagentStop, PreCompact, NotificationReceived, etc.), but these four cover the vast majority of use cases.

### Matchers: Filtering by Tool

You don't have to react to *every* tool call. Use `tools` to filter:

```json
"tools": ["Bash"]           // Only Bash commands
"tools": ["Write", "Edit"]  // Only file modifications
```

---

## 3. Configuration

Hooks are defined in `.claude/settings.json` (project or user level):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "/bin/bash ./scripts/validate-bash.sh $TOOL_INPUT"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "/bin/bash ./scripts/format-on-save.sh $TOOL_INPUT"
          }
        ]
      }
    ]
  }
}
```

### How Your Script Communicates Back

| Exit Code | Meaning |
|-----------|---------|
| **0** | Continue — allow the tool to execute |
| **2** | Block — prevent execution, show stdout as error to Claude |

Whatever your script prints to **stdout** is injected into Claude's context. This is how you give Claude feedback ("File formatted", "Command blocked because...").

### Hook Input: What Your Script Receives

When a hook fires, Claude passes **tool input as JSON via the `$TOOL_INPUT` environment variable**. For a Bash tool call, it looks like:

```json
{"command": "rm -rf /tmp/data", "timeout": 120000}
```

Your script can read this to decide whether to allow or block.

### Quick Setup via `/hooks`

In a running session, type `/hooks` to interactively add, edit, or inspect hooks.

> **Note:** Hooks configured in `.claude/settings.json` also run in headless mode (`claude -p`). This means your security guardrails apply in CI/CD pipelines too.

---

## Hands-On Exercise (10 min)

### Build a Security Hook That Blocks Dangerous Commands

**Goal:** Create a PreToolUse hook that prevents Claude from running destructive Bash commands.

#### Step 1: Start Simple — A Minimal Hook

Create `scripts/validate-bash.sh`:

```bash
#!/bin/bash
# Simplest possible hook: block "rm -rf /"
# $TOOL_INPUT contains JSON like: {"command": "rm -rf /", ...}

if echo "$TOOL_INPUT" | grep -q '"command".*rm.*-rf.*/'; then
  echo "BLOCKED: Dangerous rm command detected."
  exit 2  # Block
fi

exit 0  # Allow everything else
```

Make it executable:

```bash
chmod +x scripts/validate-bash.sh
```

#### Step 2: Register the Hook

Add to your `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "/bin/bash ./scripts/validate-bash.sh"
          }
        ]
      }
    ]
  }
}
```

Note: `$TOOL_INPUT` is automatically available as an environment variable — no need to pass it as argument.

#### Step 3: Test It

Start a Claude Code session and try:

```
> Run: rm -rf /tmp/important-data
```

Expected: Hook fires → Script detects `rm -rf` → **Exit 2** → Claude sees "BLOCKED" message.

Now try a safe command:

```
> Run: ls -la
```

Expected: Hook fires → No match → **Exit 0** → Command runs normally.

#### Step 4: Make It Smarter (Bonus)

Enhance the script with more patterns:

```bash
#!/bin/bash
# Enhanced version with multiple checks

# Block rm -rf on important paths
if echo "$TOOL_INPUT" | grep -q '"command".*rm.*-rf.*/'; then
  echo "BLOCKED: Recursive deletion of important directories."
  exit 2
fi

# Block sudo rm
if echo "$TOOL_INPUT" | grep -q '"command".*sudo.*rm'; then
  echo "BLOCKED: sudo rm is not allowed."
  exit 2
fi

# Block git force-push to main
if echo "$TOOL_INPUT" | grep -q '"command".*git.*push.*--force.*main'; then
  echo "BLOCKED: Force-push to main is not allowed."
  exit 2
fi

exit 0
```

#### Discussion

- What other commands would you want to block in your team?
- How could you use a **PostToolUse** hook to auto-format code after every edit?
- Where would you store hooks — per project or globally?

---

## Summary

| Concept | Key Point |
|---------|-----------|
| **Hooks** | Deterministic code at lifecycle events — always runs, not optional |
| **Key Events** | PreToolUse (block), PostToolUse (react), SessionStart (init) |
| **Exit Codes** | 0 = continue, 2 = block |
| **Config** | `.claude/settings.json` under `"hooks"` key, or `/hooks` interactively |
| **vs. Skills** | Hooks = guaranteed guardrails; Skills = optional LLM-driven workflows |

**Up next:** Module 10 — CLI & Headless Mode (running Claude Code in pipelines, CI/CD, and programmatically).
