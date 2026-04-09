# Module 9 — Hooks: Guaranteeing Determinism (25 min)

> *Code that ALWAYS runs — independent of the LLM*

## Learning Objectives

By the end of this module, participants will be able to:

- Understand what hooks are and why they matter for determinism
- Identify the lifecycle events where hooks can run
- Configure hooks to enforce guardrails (block dangerous commands, auto-format)
- Distinguish between hooks (deterministic) and skills (LLM-driven)
- Debug and test hooks
- Design hooks for security, quality, and automation

---

## 1. What Are Hooks?

Hooks are **deterministic code that runs at specific lifecycle points in a Claude Code session, regardless of what Claude decides**. Unlike skills (which Claude chooses to invoke), hooks **always execute** at their configured trigger point.

### Key Principle

```
Claude generates a tool call (e.g., write to file)
         ↓
Hook fires (PreToolUse event) [DETERMINISTIC]
Hook decides: continue or block (exit code 0 or 2)
         ↓
If exit 0: Tool executes
If exit 2: Tool blocked, Claude sees error
```

### Hooks vs. Skills

| Aspect | Hooks | Skills |
|--------|-------|--------|
| **Trigger** | Lifecycle event (SessionStart, PostToolUse, etc.) | Claude chooses to invoke |
| **Determinism** | Always runs | Optional (Claude decides) |
| **Control** | You define what happens | Claude defines what to do |
| **Example** | "Run prettier after every file edit" | "Write a unit test for this function" |

---

## 2. Hook Types

Hooks can be implemented as:

| Type | Trigger | Response |
|------|---------|----------|
| **Command Hook** | Shell script (bash, zsh, python, etc.) | Exit code (0 = continue, 2 = block) + stdout |
| **HTTP Hook** | POST request to a URL | HTTP status (200 = continue, 400+ = block) + JSON response |

### Command Hook Example

```bash
#!/bin/bash
# Hook runs when Bash tool is invoked

# Check if command is rm -rf /
if [[ "$@" == "rm -rf /"* ]]; then
  echo "BLOCKED: Dangerous command detected"
  exit 2  # Block the command
fi

exit 0  # Allow the command
```

### HTTP Hook Example

```bash
curl -X POST https://your-company.com/claude-hooks \
  -H "Content-Type: application/json" \
  -d '{
    "event": "PreToolUse",
    "tool": "Bash",
    "args": ["rm", "-rf", "/"]
  }'

# Returns:
# {
#   "allow": false,
#   "block": true,
#   "message": "Dangerous command blocked"
# }
```

---

## 3. Lifecycle Events

Hooks can be triggered at these points in a Claude Code session:

| Event | Trigger | Typical Use |
|-------|---------|-------------|
| **SessionStart** | Session begins (before first prompt) | Initialize environment, inject context, load project settings |
| **UserPromptSubmit** | User submits a prompt | Validate input, apply prompt transformations |
| **PreToolUse** | Claude wants to invoke a tool | Validate tool call, block dangerous operations |
| **PostToolUse** | Tool execution completes | Auto-format, run tests, trigger side effects |
| **Stop** | User stops the session (Ctrl+C) | Clean up, save state, send notifications |
| **SubagentStop** | Subagent completes | Validate subagent output, aggregate results |
| **PreCompact** | Session context is about to be compacted | Save checkpoint, export state |
| **PermissionRequest** | Claude requests permission (file download, etc.) | Auto-approve/deny based on policy |
| **TaskCompleted** | Long-running task finishes | Send notification, trigger downstream actions |
| **WorktreeCreate** | New worktree spawned | Initialize worktree with config, environment |
| **WorktreeRemove** | Worktree is deleted | Clean up resources |
| **TeammateIdle** | Team member idle for N seconds (experimental) | Reassign work, notify |

---

## 4. Matchers

Hooks can filter on specific tools or file patterns:

### Tool Name Matchers

Trigger hook only for specific tools:

```json
{
  "event": "PreToolUse",
  "tools": ["Bash", "Write", "Edit"]  // Trigger for Bash, Write, Edit only
}
```

### File Pattern Matchers (Advanced)

Trigger on specific files:

```json
{
  "event": "PostToolUse",
  "tools": ["Write"],
  "filePatterns": ["**/*.ts", "**/*.js"]  // Only TypeScript/JS files
}
```

### Glob Patterns

```json
{
  "tools": ["Edit(*.ts)", "Edit(src/**/*)"]  // Only TS files in src/
}
```

---

## 5. Decision Control: Exit Codes & JSON

### Exit Code (For Command Hooks)

- **Exit 0**: Continue (allow tool to execute)
- **Exit 2**: Block (prevent tool execution, show error to Claude)
- **Other exits**: Treated as error (block with error message)

### JSON Response (Advanced)

A hook can output JSON to provide detailed feedback:

```json
{
  "block": false,
  "allow": true,
  "message": "Command validated",
  "feedback": "Command will be executed",
  "suppressOutput": false,
  "continue": true
}
```

| Field | Purpose |
|-------|---------|
| `block` | boolean — whether to block the tool |
| `allow` | boolean — whether to allow the tool |
| `message` | string — error/success message |
| `feedback` | string — explanation shown to Claude |
| `suppressOutput` | boolean — hide tool output from Claude |
| `continue` | boolean — continue session execution |

---

## 6. Hook Configuration

### Interactive Configuration

Use the `/hooks` command in a session:

```
/hooks
```

This opens an interactive menu to:
- Add a new hook
- Edit existing hooks
- Test hooks
- View hook logs

### Manual Configuration (.claude/settings.json)

Define hooks in `.claude/settings.json`:

```json
{
  "hooks": [
    {
      "name": "prettier-formatter",
      "event": "PostToolUse",
      "tools": ["Write", "Edit"],
      "type": "command",
      "command": "prettier --write {filepath}",
      "filePatterns": ["**/*.ts", "**/*.js", "**/*.json"]
    },
    {
      "name": "block-dangerous",
      "event": "PreToolUse",
      "tools": ["Bash"],
      "type": "command",
      "command": "./scripts/validate-bash.sh {args}"
    },
    {
      "name": "notify-completion",
      "event": "TaskCompleted",
      "type": "http",
      "url": "https://your-company.com/hooks/task-complete",
      "async": true
    }
  ]
}
```

### Environment Variables in Hooks

Hooks have access to:

```bash
# Tool-specific
$TOOL_NAME          # e.g., "Bash", "Write", "Edit"
$TOOL_ARGS          # Tool arguments as JSON
$FILEPATH           # File being read/written/edited (if applicable)
$EVENT_TYPE         # e.g., "PreToolUse", "PostToolUse"

# Session context
$SESSION_ID         # Current session ID
$PROJECT_ROOT       # Project root directory
$USER_NAME          # Current user
$MODEL              # Current model (opus, sonnet, haiku)
```

---

## 7. Hook Output & Side Effects

### stdout → Claude's Context

Whatever a hook outputs to stdout is **injected into Claude's context**:

```bash
#!/bin/bash
echo "Project last updated: $(git log -1 --format=%ai)"
exit 0
```

Claude sees:
```
[Hook: project-timestamp]
Project last updated: 2026-04-07 14:23:45 +0000
```

### Exit Code 2 → Block with Error

```bash
#!/bin/bash
echo "SECURITY: SSH key deletion blocked"
exit 2
```

Claude sees:
```
Tool blocked by policy hook: SECURITY: SSH key deletion blocked
```

### Async Hooks (Fire-and-Forget)

For logging/telemetry that shouldn't block:

```json
{
  "event": "TaskCompleted",
  "async": true,
  "type": "http",
  "url": "https://logging.company.com/events",
  "method": "POST"
}
```

Async hooks run in the background; Claude continues without waiting.

---

## 8. Hook Use Cases with Examples

### Use Case 1: Auto-Format After File Edit

**Goal:** Run prettier after every TypeScript file edit.

```bash
#!/bin/bash
# scripts/post-edit-format.sh

FILEPATH="$1"

# Only format TS/JS files
if [[ ! "$FILEPATH" =~ \.(ts|js|json)$ ]]; then
  exit 0
fi

# Run prettier
npx prettier --write "$FILEPATH" 2>&1

if [ $? -eq 0 ]; then
  echo "Formatted: $FILEPATH"
  exit 0
else
  echo "Format error: $FILEPATH"
  exit 0  # Don't block, but inform
fi
```

**Hook Config:**
```json
{
  "event": "PostToolUse",
  "tools": ["Write", "Edit"],
  "filePatterns": ["**/*.ts", "**/*.js"],
  "command": "./scripts/post-edit-format.sh {filepath}"
}
```

### Use Case 2: Block Dangerous Bash Commands

**Goal:** Prevent `rm -rf /` and similar destructive commands.

```bash
#!/bin/bash
# scripts/validate-bash.sh

COMMAND="$@"

# Block destructive commands
if [[ "$COMMAND" =~ ^rm.*-rf.*/ ]]; then
  echo "SECURITY: Recursive deletion of system directories is blocked"
  exit 2
fi

if [[ "$COMMAND" =~ ^sudo.*rm ]]; then
  echo "SECURITY: Sudo rm commands are blocked"
  exit 2
fi

exit 0
```

**Hook Config:**
```json
{
  "event": "PreToolUse",
  "tools": ["Bash"],
  "command": "./scripts/validate-bash.sh {args}"
}
```

### Use Case 3: Desktop Notification on Task Completion

**Goal:** Notify the user when a long task finishes.

```bash
#!/bin/bash
# scripts/notify-task-complete.sh

TASK_ID="$1"
STATUS="$2"

# macOS notification
osascript -e 'display notification "Task '$TASK_ID' completed with status: '$STATUS'" with title "Claude Code"'

exit 0
```

**Hook Config:**
```json
{
  "event": "TaskCompleted",
  "async": true,
  "command": "./scripts/notify-task-complete.sh {taskId} {status}"
}
```

### Use Case 4: Auto-Run Tests When Test Files Change

**Goal:** Run Jest when a `.test.ts` file is edited.

```bash
#!/bin/bash
# scripts/run-tests-on-save.sh

FILEPATH="$1"

if [[ ! "$FILEPATH" =~ \.test\.ts$ ]]; then
  exit 0
fi

echo "Running tests for $FILEPATH..."
npx jest "$FILEPATH" --passWithNoTests 2>&1

if [ $? -eq 0 ]; then
  echo "Tests passed"
  exit 0
else
  echo "Tests failed"
  exit 0  # Don't block editing, just inform
fi
```

**Hook Config:**
```json
{
  "event": "PostToolUse",
  "tools": ["Edit"],
  "filePatterns": ["**/*.test.ts"],
  "command": "./scripts/run-tests-on-save.sh {filepath}"
}
```

### Use Case 5: Context Injection at Session Start

**Goal:** Inject project metadata (date, branch, team) at session start.

```bash
#!/bin/bash
# scripts/inject-context.sh

echo "=== Session Context ==="
echo "Project: $(cat .project-name)"
echo "Branch: $(git branch --show-current)"
echo "Date: $(date)"
echo "Team Lead: $(git config team.lead)"
echo ""

exit 0
```

**Hook Config:**
```json
{
  "event": "SessionStart",
  "command": "./scripts/inject-context.sh"
}
```

---

## 9. Distinction: Hooks vs. Skills

| Aspect | Hooks | Skills |
|--------|-------|--------|
| **Trigger** | System event (SessionStart, PostToolUse) | Claude decides "I should use this skill" |
| **Guarantee** | Always runs at event | Only if Claude chooses |
| **Example** | "Run prettier after every edit" | "Write a unit test" |
| **Use** | Enforce policy, guarantee outcome | Augment Claude's capabilities |

**Best Practice:**
- Use **hooks** for guardrails, automation, and policy enforcement
- Use **skills** for optional workflows Claude might choose

### Official Hook Plugins

Anthropic provides ready-made hook plugins in the [Claude Code repo](https://github.com/anthropics/claude-code/tree/main/plugins):

- **`security-guidance`** — A PreToolUse hook monitoring 9 security patterns (command injection, XSS, eval usage, dangerous HTML, pickle deserialization, os.system calls). Install once and get automatic security warnings on every edit.
- **`hookify`** — Meta-tool: analyzes conversation patterns or explicit instructions to auto-generate hooks. Instead of writing hook scripts manually, describe what you want to prevent, and `hookify` creates the hook for you. Commands: `/hookify`, `/hookify:list`, `/hookify:configure`.
- **`explanatory-output-style`** — SessionStart hook that injects educational context, so Claude explains its reasoning and implementation choices.

> These plugins show how hooks scale from single scripts to full automation packages.

---

---

## Hands-On Exercise (5 min)

### Build a Hook That Runs Prettier After Every File Edit

**Goal:** Create a hook that auto-formats TypeScript files after editing.

#### Step 1: Create the Hook Script

Create `scripts/format-on-save.sh`:

```bash
#!/bin/bash
set -e

FILEPATH="$1"

# Skip non-code files
if [[ ! "$FILEPATH" =~ \.(ts|js|json|md)$ ]]; then
  exit 0
fi

echo "Formatting $FILEPATH..."

# Run prettier (assuming it's installed)
npx prettier --write "$FILEPATH" 2>/dev/null

echo "Formatted: $FILEPATH"
exit 0
```

Make it executable:
```bash
chmod +x scripts/format-on-save.sh
```

#### Step 2: Register the Hook

In a Claude Code session:

```
/hooks
→ Add Hook
→ Name: prettier-format
→ Event: PostToolUse
→ Tools: Write, Edit
→ Type: Command
→ Command: ./scripts/format-on-save.sh {filepath}
→ File Patterns: **/*.ts, **/*.js, **/*.json
→ Save
```

Or manually in `.claude/settings.json`:

```json
{
  "hooks": [
    {
      "name": "prettier-format",
      "event": "PostToolUse",
      "tools": ["Write", "Edit"],
      "filePatterns": ["**/*.ts", "**/*.js", "**/*.json"],
      "command": "./scripts/format-on-save.sh {filepath}"
    }
  ]
}
```

#### Step 3: Test the Hook

Edit a TypeScript file:

```
Edit src/index.ts and add a function with bad formatting
```

Claude edits the file. The hook automatically runs prettier. You'll see:

```
[Hook: prettier-format]
Formatted: src/index.ts
```

#### Step 4: Verify

Check the file — it should be automatically formatted.

#### Follow-Up

Try adding a second hook for Terraform validation or a pre-commit style check.

---

## Summary

| Concept | Key Point |
|---------|-----------|
| **Hooks** | Deterministic code at lifecycle events (always runs, not optional) |
| **Events** | SessionStart, PreToolUse, PostToolUse, Stop, TaskCompleted, etc. |
| **Control** | Exit code 0 (continue), exit 2 (block), JSON response (detailed) |
| **Configuration** | Interactive `/hooks` or manual `.claude/settings.json` |
| **Use Cases** | Auto-format, block dangerous commands, notify, run tests, inject context |
| **vs. Skills** | Hooks = guaranteed; Skills = optional (Claude decides) |

**Up next:** Module 10 — CLI & Headless Mode (running Claude Code in pipelines, CI/CD, and programmatically).
