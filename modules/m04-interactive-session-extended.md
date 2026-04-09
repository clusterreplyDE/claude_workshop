# Module 4 — Interactive Session Extended (15 min)

> *Mastering shortcuts, permissions, and version control*

## Learning Objectives

By the end of this module, participants will be able to:

- Master keyboard shortcuts for fast navigation and workflow
- Understand and switch between permission modes for different safety levels
- Navigate checkpoints to undo changes and rewind to previous states
- Integrate with Git to find bugs, commit fixes, and create pull requests
- Manage multiple sessions for parallel work and efficient context handling

---

## 1. Keyboard Shortcuts

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

## 2. Permission Modes

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

## 3. Checkpoints & Rewinding

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

## 4. Git Integration

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

## 5. Session Management

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
| **Shortcuts** | `Esc Esc` to rewind, `Shift+Tab` to change permissions, `Ctrl+O` for verbose mode |
| **Permissions** | Start with `default` or `plan`. Move to `acceptEdits` or `auto` when confident. |
| **Checkpoints** | Automatic snapshots before edits. Rewind with `Esc Esc`. Name milestones with `/checkpoint`. |
| **Git** | Claude commits, creates PRs. Full history awareness. `/commit` and `/pr` commands. |
| **Sessions** | `claude --continue` to resume, `/list-sessions` to browse, `--fork-session` for parallel work |

**Next step:** Module 5 — CLAUDE.md & Rules explores the CLAUDE.md configuration file for project-specific conventions and behaviors.

