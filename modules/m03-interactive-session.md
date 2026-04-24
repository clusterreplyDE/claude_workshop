# Module 3 — The Interactive Session (20 min)

> *Understanding how Claude thinks and acts*



## Contents

- [Learning Objectives](#learning-objectives)
- [1. The Agentic Loop](#1-the-agentic-loop)
- [2. Built-In Tools](#2-built-in-tools)
- [3. File & Folder Referencing](#3-file-folder-referencing)
- [4. Context Management](#4-context-management)
- [5. Model Selection](#5-model-selection)
- [Hands-On Exercise (5 min)](#hands-on-exercise-5-min)
- [Summary](#summary)


## Learning Objectives

By the end of this module, participants will be able to:

- Understand the agentic loop: Gather Context → Take Action → Verify Results
- Use built-in tools effectively (Read, Edit, Write, Bash, Grep, Glob, WebFetch, WebSearch, Agent)
- Reference files and folders with `@file` and `@folder` syntax
- Manage session context to stay under token budgets
- Switch models mid-session for different task needs

---

## 1. The Agentic Loop

Claude Code works in a continuous cycle. Understand this loop and you understand everything:

```
┌──────────────────────────────────────────────────────────┐
│                    Agentic Loop                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. GATHER CONTEXT                                       │
│     └─ Read files, explore folder structure             │
│     └─ Understand problem / requirements                │
│     └─ Ask clarifying questions                         │
│                                                          │
│  2. PLAN (implicit or explicit)                         │
│     └─ Analyze options                                  │
│     └─ In "plan" mode: show approach before executing   │
│                                                          │
│  3. TAKE ACTION                                          │
│     └─ Edit, create, or delete files                    │
│     └─ Run Bash commands (tests, builds, git)          │
│     └─ Search, fetch, or analyze web content           │
│                                                          │
│  4. VERIFY RESULTS                                       │
│     └─ Confirm no errors (check exit codes)            │
│     └─ Run tests or diffs                               │
│     └─ Ask user for feedback                            │
│                                                          │
│     ↻ ITERATE → Back to step 1 if needed               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Built-In Tools

Claude Code comes with a set of powerful tools. You don't invoke them directly — Claude uses them automatically based on what's needed.

| Tool | Purpose | Example |
|------|---------|---------|
| **Read** | Read file contents, code, configs, images, PDFs | Reads `main.py` to understand structure |
| **Edit** | Modify existing files with surgical precision | Changes function signature in `api.ts` |
| **Write** | Create new files from scratch | Writes `setup.py` for new package |
| **Bash** | Execute shell commands, tests, deployments | Runs `npm test`, `git commit`, `docker build` |
| **Grep** | Search text patterns across files (ripgrep) | Finds all `TODO` comments, unused variables |
| **Glob** | Match files by pattern (fast, doesn't shell out) | Finds all `.ts` files in `/src` |
| **WebFetch** | Download and parse web pages, documentation | Fetches API docs, error pages, blog posts |
| **WebSearch** | Search the internet (requires internet) | Finds latest Node.js docs, library comparisons |
| **Agent** | Delegate tasks to a subagent (isolated context) | Runs `/batch` for large refactors, `/loop` for iterations |

### Tools You Request vs. Tools Claude Uses

You can **suggest** tool use in your prompts:

```bash
claude @file.js "Find where we call the deprecated API"
# Claude will use Grep to search, then Read to show context

claude "Check if this pattern exists: TODO URGENT" !grep
# Claude will run grep for you

claude "Search the web for best practices on retry logic"
# Claude will use WebSearch
```

Or **let Claude decide:**

```bash
claude "Debug the test failures"
# Claude reads test output, finds relevant files, runs tests to verify fixes
```

---

## 3. File & Folder Referencing

Use the `@` syntax to load files and folders into context. This is more efficient than relying on Claude to search.

### Reference a Single File

```bash
claude @src/app.js "What does this module export?"
```

**What happens:**
- `app.js` is loaded into context
- Claude analyzes it and answers your question

### Reference a Folder

```bash
claude @src "Show me the overall structure and key components"
```

**What happens:**
- Claude scans the folder (respects `.gitignore` and `.claudeignore`)
- Reads key files (entry points, package.json, READMEs)
- Summarizes structure without loading everything

### Reference Multiple Files

```bash
claude @config.js @src/middleware.js "Are these compatible?"
```

### Reference Images & PDFs

```bash
claude @screenshot.png "What error is shown here?"
claude @architecture.pdf "Summarize the deployment diagram"
```

### Pipe Files Into Claude

```bash
cat src/tricky-function.js | claude "Explain this logic"
curl https://example.com/api/docs | claude "Extract the endpoint list"
```

### Load Context from URLs

Claude Code can fetch URLs automatically:

```bash
claude "Based on https://nodejs.org/api/events.html, explain EventEmitter"
```

---

## 4. Context Management

Each session has a token budget. Manage it wisely.

### Check Your Budget

```bash
/cost
# Output:
# Total tokens used: 45,234 / 1,000,000 available today
# Estimate: $0.23
```

```bash
/context
# Output:
# Loaded context:
#   @src/app.js: 1,203 tokens
#   @src/routes/: 4,550 tokens
#   @package.json: 89 tokens
# Available: 994,158 tokens
# Cost so far: $0.23
```

### Compact Your Context

If you're running low on tokens or need to refocus:

```bash
/compact database
# Claude summarizes the context, keeping only database-related information
# Saves 50-70% of tokens while maintaining focus
```

### Clear the Conversation

Start fresh without closing the session:

```bash
/clear
# Conversation history deleted, context files remain loaded
```

---

## 5. Model Selection

Claude Code supports multiple models. Switch based on your task.

| Model | Speed | Cost | Best For |
|-------|-------|------|----------|
| **Opus 4.6** | Slowest | ~$10/1M tokens | Complex reasoning, refactoring, debugging |
| **Sonnet 4.6** | Medium | ~$3/1M tokens | General coding, tests, documentation (default) |
| **Haiku 4.5** | Fastest | ~$0.80/1M tokens | Simple edits, quick questions, high volume |

### Switch Models Mid-Session

```bash
/model
# Interactive menu appears:
# 1. claude-opus-4.6
# 2. claude-sonnet-4.6 (current)
# 3. claude-haiku-4.5
```

### Set Default Model on Startup

```bash
claude --model opus
claude --model sonnet
claude --model haiku
```

### Keyboard Shortcut (Terminal)

In a session:
```
Option+P (macOS) or Alt+P (Linux/Windows)
# Same as /model — cycle through models
```

---

## Hands-On Exercise (5 min)

### Explore the Sample Project

**Objective:** Load the workshop project, check context, and experiment with model switching.

> Make sure you're in `exercises/sample-project/` (set up in M02 Step 6).

**Step 1: Start a Session in the Project**

```bash
cd exercises/sample-project
claude
> @. Describe what this project does and its structure
# Claude scans the repo, reads README, package.json, key files
```

**Step 2: Check Your Context Usage**

```bash
/context
# See how many tokens are loaded
```

**Step 3: Compact Context if Needed**

```bash
/compact
# Summarize loaded context to save tokens
```

**Step 4: Switch Models and Try a Query**

```bash
/model
# Pick Haiku for a quick response, or Opus for deeper analysis
> Identify the main entry point and explain the request flow
```

**Step 5: Return to Default Model**

```bash
/model
# Switch back to Sonnet 4.6
```

### Expected Outcomes

- Understand how `/context` shows you token consumption
- See firsthand the speed difference between models
- Practice the `@folder` syntax for loading entire projects

---

## Summary

| Concept | Key Takeaway |
|---------|--------------|
| **Agentic Loop** | Gather → Plan → Act → Verify → Iterate (Claude handles all) |
| **Tools** | Read, Edit, Write, Bash, Grep, Glob, WebFetch, WebSearch used automatically |
| **Context** | Use `@file` and `@folder` to load relevant code efficiently |
| **Token Budget** | Check with `/context`, compact with `/compact` |
| **Models** | Switch with `/model` or `Option+P`. Opus for hard problems, Haiku for speed. |

**Next step:** Module 4 — Interactive Session Extended covers keyboard shortcuts, permissions, checkpoints, Git integration, and session management.

