# Module 10 — CLI & Headless Mode (15 min)

> *Claude in the pipeline*

## Learning Objectives

By the end of this module, participants will be able to:

- Run Claude Code in one-shot, non-interactive mode with `claude -p`
- Control output format and tool access
- Understand how headless mode enables CI/CD integration
- Write a basic GitHub Actions workflow using Claude Code

---

## 1. Headless / Non-Interactive Mode

### One-Shot Execution

Run Claude Code without the interactive REPL — it executes the task and exits:

```bash
claude -p "Analyze the test failures in test/ and suggest fixes"
```

This is the foundation for all automation: scripts, pipelines, cron jobs.

### Output Formats

| Format | Flag | Use Case |
|--------|------|----------|
| **Text** (default) | `--output-format text` | Human-readable output |
| **JSON** | `--output-format json` | Structured data for scripts |
| **Stream JSON** | `--output-format stream-json` | Line-by-line streaming for piping |

```bash
# Get structured JSON output
claude -p "List all TODO comments" --output-format json

# Force output to match a specific schema
claude -p "Extract issue metadata" \
  --json-schema '{"type":"object","properties":{"title":{"type":"string"},"priority":{"type":"string"}}}'
```

### Tool Restrictions

Control what Claude is allowed to do — critical for safety in automated pipelines:

```bash
# Read-only: only allow Read and Grep
claude -p "Search for security issues" --allowedTools Read,Grep

# Block file modifications
claude -p "Analyze code quality" --disallowedTools Write,Edit,Bash

# Wildcards: only git commands in Bash
claude -p "Check git history" --allowedTools "Bash(git *)"
```

### Other Useful Flags

```bash
# Custom system prompt for role specialization
claude -p "Review this code" --system-prompt "You are a security auditor."

# Append to default system prompt
claude -p "Review this PR" --append-system-prompt "Focus on performance."

# Cost cap for long-running tasks
claude -p "Full test suite analysis" --max-budget-usd 5
```

---

## 2. Permissions in Headless Mode

In non-interactive mode, Claude can't ask for permission (no human at the terminal). You have three options:

| Approach | Flag | Safety |
|----------|------|--------|
| **Skip all permissions** | `--dangerously-skip-permissions` | Low — use only in sandboxed CI |
| **Allowlist tools** | `--allowedTools Read,Grep` | High — explicit control |
| **Blocklist tools** | `--disallowedTools Bash,Write` | Medium — block specific risks |

**Best practice for CI/CD:** Combine `--dangerously-skip-permissions` with `--allowedTools` to auto-approve only safe operations.

---

## 3. Session Management (Overview)

Headless tasks can use sessions for continuity:

```bash
# Resume previous session
claude --resume <session-id>

# Continue last session
claude --continue

# Named sessions for scripting
claude --name "nightly-review" -p "Run security scan"
```

Sessions preserve full context — useful for multi-step automated workflows.

---

## 4. CI/CD Example: GitHub Actions PR Review

The most common headless use case — automated code review on every PR:

```yaml
# .github/workflows/claude-review.yml
name: Claude Code PR Review

on:
  pull_request:
    types: [opened, synchronize]

permissions:
  pull-requests: write
  contents: read

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Run Claude Review
        env:
          CLAUDE_API_KEY: ${{ secrets.CLAUDE_API_KEY }}
        run: |
          REVIEW=$(claude -p "Review the changes in this PR. 
            Focus on security, performance, and code quality. 
            Format as markdown." \
            --output-format text \
            --allowedTools Read,Grep \
            --dangerously-skip-permissions)
          echo "$REVIEW" > /tmp/review.txt

      - name: Post Comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('/tmp/review.txt', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## Claude Code Review\n\n${review}`
            });
```

**Key points:** Store `CLAUDE_API_KEY` as a GitHub Secret, use `--allowedTools` to restrict to read-only, and `--dangerously-skip-permissions` because there's no TTY.

---

## Hands-On Exercise (5 min)

### Try Headless Mode Locally

**Step 1: Basic one-shot**

```bash
claude -p "What files are in this project? Give a brief summary."
```

**Step 2: JSON output**

```bash
claude -p "List all markdown files and their line counts" --output-format json
```

**Step 3: Read-only mode**

```bash
claude -p "Find potential security issues in this codebase" \
  --allowedTools Read,Grep,Glob \
  --dangerously-skip-permissions
```

**Step 4: Pipe into other tools**

```bash
# Use Claude output in a script
RESULT=$(claude -p "What is the main entry point of this project?" --output-format text)
echo "Claude says: $RESULT"
```

#### Discussion

- What tasks in your team's workflow could benefit from headless Claude?
- How would you set up tool restrictions for a CI pipeline?
- What's the risk of `--dangerously-skip-permissions` without `--allowedTools`?

---

## Summary

| Concept | Key Point |
|---------|-----------|
| **Headless Mode** | `claude -p "prompt"` — execute and exit |
| **Output Formats** | text, json, stream-json, JSON schema validation |
| **Tool Control** | `--allowedTools` / `--disallowedTools` for safety |
| **Permissions** | `--dangerously-skip-permissions` + allowlist for CI/CD |
| **Sessions** | `--resume`, `--continue`, `--name` for multi-step automation |
| **CI/CD** | GitHub Actions example with read-only review |

**Up next:** Module 11 — Plugins & Marketplace.
