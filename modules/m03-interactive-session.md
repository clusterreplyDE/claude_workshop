# Module 3 — Interactive Session Basics (35 min)

> *Mastering the daily workflow*

## Learning Objectives

By the end of this module, participants will be able to:

- Understand the agentic loop: Gather Context → Take Action → Verify Results
- Use built-in tools effectively (Read, Edit, Write, Bash, Grep, Glob, WebFetch, WebSearch, Agent)
- Reference files and folders with `@file` and `@folder` syntax
- Manage session context to stay under token budgets
- Switch models mid-session and use keyboard shortcuts
- Navigate checkpoints to undo changes
- Configure permission modes for different workflows
- Integrate with Git to find bugs and commit fixes

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

**Example walkthrough:**

```
You:    "Find the bug in my login service and fix it"

Claude: [GATHER] Reads service.js, tests/, and git log
        "Found it: the token refresh logic is missing a check"

Claude: [PLAN] "I'll add a null check in validateToken()"

Claude: [ACTION] Edits service.js
        Runs tests with `npm test`

Claude: [VERIFY] "Tests pass! Commit ready."

You:    "Run it against staging"

Claude: [GATHER] Checks staging environment variables
Claude: [ACTION] Deploys with `kubectl apply -f staging/`
Claude: [VERIFY] Checks pod logs for errors
        "Deployment successful. Ready for production review."
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

## 6. Keyboard Shortcuts

Master these to work faster:

| Shortcut | Action |
|----------|--------|
| `Esc` | Stop Claude mid-response |
| `Esc` `Esc` | Rewind to last checkpoint |
| `Shift+Tab` | Cycle permission modes |
| `Ctrl+C` | Cancel prompt input or current operation |
| `Ctrl+O` | Toggle verbose output (shows tool calls) |
| `Ctrl+B` | Move current task to background |
| `Ctrl+T` | Open task list (`/todo`) |
| `Ctrl+G` | Open editor for multi-line prompts |
| `!` (prefix) | Force bash mode (run command directly) |
| `/btw` (prefix) | Ask a side question (doesn't affect main task) |

**Examples:**

```bash
# Stop Claude if it's taking too long
Esc

# Rewind the last change
Esc Esc

# Ask a quick question without losing focus
/btw "What's the Node version?"

# Cycle through permission modes
Shift+Tab Shift+Tab

# Send a task to background and start a new one
Ctrl+B
"Now let's refactor the API"
```

---

## 7. Permission Modes

Control how much autonomy Claude has. Change with `Shift+Tab`.

| Mode | Behavior | Use Case |
|------|----------|----------|
| **default** | Claude shows diffs before editing files. Asks before running dangerous commands (rm, reset, deploy). | Safe, hands-on. Good for learning. |
| **acceptEdits** | Claude edits files directly, no confirmation. Safe commands auto-run. Dangerous commands still ask. | Trusted workflows. Faster iterations. |
| **plan** | Claude explains its approach before taking ANY action. You review and approve. | High-stakes changes. Code reviews. |
| **auto** | Claude runs everything without asking. Full autonomy. | Trusted automation, CI/CD environments. |
| **dangerously-skip-permissions** | Bypasses all safety checks. Use with extreme caution. | Advanced users only. Can break things. |

### Change Mode During Session

```bash
Shift+Tab Shift+Tab
# Cycles through: default → acceptEdits → plan → auto → dangerously-skip-permissions → default
```

Or set on startup:

```bash
claude --permissions auto
```

**Best practice:** Start with `default` or `plan`. Move to `acceptEdits` or `auto` only after confirming Claude's approach.

---

## 8. Checkpoints & Rewinding

Claude creates automatic snapshots before making edits. Roll back anytime.

### Automatic Checkpoints

Before Claude edits a file, it saves a checkpoint. You can restore it:

```bash
Esc Esc
# Rewind to the previous checkpoint
# Prompts: "Restore conversation only" or "Restore code and conversation"
```

### Checkpoint Viewer (VS Code)

In VS Code, the Claude extension shows checkpoints:
1. Open the Checkpoints panel in the Claude sidebar
2. Browse snapshots with diffs
3. Click to restore any checkpoint

### Manual Checkpoints

Create named snapshots for milestones:

```bash
/checkpoint "Refactoring complete, tests passing"
# Later:
/restore "Refactoring complete, tests passing"
```

---

## 9. Git Integration

Claude Code understands your Git history and can commit changes.

### What Claude Sees

When you start a session, Claude is aware of:
- Current branch
- Uncommitted changes (staged and unstaged)
- Recent commit history
- `.gitignore` rules

### Claude Makes Commits

```bash
claude "Find the memory leak in memory-manager.js and fix it"

# Claude edits the file, runs tests, then:
# "Commit ready. Commit message: Fix memory leak in memory-manager.js"
# claude> /commit "Fix memory leak by adding cleanup in destructor"
```

### Creating Pull Requests

```bash
claude "Refactor the auth middleware to use async/await"

# After changes:
# claude> /pr "Refactor auth middleware to async/await" \
#   "Improves readability and error handling. Tests pass."

# Output: "PR created: https://github.com/.../pull/123"
```

---

## 10. Session Management

| Command | Purpose |
|---------|---------|
| `claude` | Start a new session |
| `claude --continue` | Resume the last session |
| `claude --resume` | Pick a session to resume |
| `claude --fork-session <id>` | Branch from a previous session (parallel work) |
| `/list-sessions` | Show recent sessions and their IDs |

### Example: Resume and Branch

```bash
# Session A: Worked on authentication, stopped
claude --continue
# [Resume authentication work]

# Session B (parallel): Start a bug fix in a new session
claude
# [Work on bug fix independently]

# Later, merge changes from both sessions into main
```

---

> 🏢 **Reply Context:** For .NET projects on AKS:
>
> **Typical workflow:**
> 1. Clone the microservice repo: `git clone <repo>`
> 2. Load context: `claude @src/ @tests/ "Understand this service"`
> 3. Find issues: Claude reads C# code, searches tests, identifies bugs
> 4. Fix + Test: Claude edits files, runs `dotnet test`, verifies
> 5. Commit: `claude> /commit "Fix authentication token timeout"`
> 6. Deploy: Claude can run `kubectl apply -f manifests/` (with permission)
>
> **For Terraform modules:**
> 1. Load the module: `claude @main.tf @variables.tf`
> 2. Validate: Claude runs `terraform validate` and `terraform fmt`
> 3. Refactor: Claude reorganizes, updates docs, ensures compliance
> 4. Commit: `claude> /commit "Refactor networking module for consistency"`

---

## Hands-On Exercise (10 min)

### Clone a Real Repository and Find a Bug

**Setup:**

```bash
# Clone a small open-source project with known issues
git clone https://github.com/lodash/lodash.git
cd lodash

# Or use a sample provided in the workshop materials
cd /workshop-samples/bug-hunt-example
```

**Step 1: Load Context**

```bash
claude @. "What's this project? What are the main modules?"
# Claude scans the repo, reads README, package.json, key files
```

**Step 2: Ask Claude to Find a Bug**

```bash
claude @src @tests "Run the tests. Are there any failures? Find the root cause."
# Claude reads test files, runs tests (!npm test), identifies failures
```

**Step 3: Fix the Bug**

```bash
claude "Fix the bug we found. Make sure tests pass."
# Claude edits the code, runs tests iteratively, confirms fix
```

**Step 4: Commit the Fix**

```bash
claude> /commit "Fix [bug description] - now passes all tests"
# Check the commit:
!git log --oneline -5
```

**Step 5: Create a Pull Request (Simulation)**

```bash
# On GitHub (or in workshop simulation):
claude> /pr "Fix [bug]" "Resolves issue #42. All tests passing."
```

### Expected Output

```
✓ Project loaded (47 files scanned)
✓ Test suite identified: 3 failures
✓ Root cause found: Missing null check in utils.js line 42
✓ Bug fixed, tests now pass (187/187)
✓ Commit created: abc1234 "Fix null handling in utils.js"
✓ PR ready: https://github.com/.../pull/123
```

### Troubleshooting During Exercise

| Issue | Fix |
|-------|-----|
| `Too much context loaded` | Use `/compact` to refocus on one area |
| `Tests taking too long` | Use `Ctrl+B` to background the task, start another |
| `Want to undo a change` | Press `Esc` `Esc` to rewind to last checkpoint |
| `Stuck on a problem` | Ask `/btw "Can you try a different approach?"` |

---

## Summary

| Concept | Key Takeaway |
|---------|--------------|
| **Agentic Loop** | Gather → Plan → Act → Verify → Iterate (Claude handles all) |
| **Tools** | Read, Edit, Write, Bash, Grep, Glob, WebFetch, WebSearch used automatically |
| **Context** | Use `@file` and `@folder` to load relevant code efficiently |
| **Models** | Switch with `/model` or `Option+P`. Opus for hard problems, Haiku for speed. |
| **Checkpoints** | Automatic snapshots before edits. Rewind with `Esc` `Esc`. |
| **Permissions** | Start with `default` or `plan`. Move to `auto` when confident. |
| **Git** | Claude commits, creates PRs. Full history awareness. |

**Next step:** Module 4 shows how to make Claude "remember" your project conventions with CLAUDE.md.

