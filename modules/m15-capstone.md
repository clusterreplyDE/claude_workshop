# Module 15 — Capstone: Putting It All Together (30 min)

> *From empty repo to productive setup*



## Contents

- [Learning Objectives](#learning-objectives)
- [1. The Capstone Challenge](#1-the-capstone-challenge)
- [2. Task 1: Create CLAUDE.md (5 min)](#2-task-1-create-claudemd-5-min)
- [3. Task 2: Build a Custom Skill (5 min)](#3-task-2-build-a-custom-skill-5-min)
- [4. Task 3: Define a Subagent Role (3 min)](#4-task-3-define-a-subagent-role-3-min)
- [5. Task 4: Connect MCP Server (3 min)](#5-task-4-connect-mcp-server-3-min)
- [6. Task 5: Configure a Hook (3 min)](#6-task-5-configure-a-hook-3-min)
- [7. Task 6: Sketch CI/CD (3 min)](#7-task-6-sketch-cicd-3-min)
- [8. Final Project Structure](#8-final-project-structure)
- [9. Evaluation Checklist](#9-evaluation-checklist)
- [10. Workshop Wrap-Up](#10-workshop-wrap-up)


## Learning Objectives

By the end of this module, participants will be able to:

- Create a complete Claude Code setup in a repository
- Apply all workshop concepts together
- Evaluate setup quality for team readiness

---

## 1. The Capstone Challenge

**Goal:** Build a team-ready Claude Code setup so a new team member clones the repo and is immediately productive.

**Starting point:** The sample project from M04 (`exercises/sample-project/`) — or an empty repository.

### The 6 Tasks

| # | Task | Deliverable | Time | Approach |
|---|------|-------------|------|----------|
| 1 | Create CLAUDE.md | Project guide with context | 5 min | Write from template |
| 2 | Build a custom skill | Review skill with SKILL.md | 5 min | Write from template |
| 3 | Define a subagent | Code-reviewer agent file | 3 min | Create in `.claude/agents/` |
| 4 | Connect MCP server | Filesystem MCP config | 3 min | Copy + adapt from M8 |
| 5 | Configure a hook | Auto-format on edit | 3 min | Copy + adapt from M9 |
| 6 | Sketch CI/CD integration | GitHub Action YAML | 3 min | Copy + adapt from M10 |

**Tip:** Tasks 3-6 are intentionally "copy + adapt" — the goal is applying what you learned, not writing from scratch. Refer back to M7-M10 exercises.

Work through each task below.

---

## 2. Task 1: Create CLAUDE.md (5 min)

Create `CLAUDE.md` in the project root:

```markdown
# Claude Code Guide for [Project Name]

## Project Overview
[1-2 sentences about what this project does]
- Tech stack: Node.js, Express, PostgreSQL
- Purpose: REST API for user management

## Quick Start
- `claude` — start a session
- `/plan your task` — plan before executing
- `/code-review:review <file>` — get feedback

## Architecture
src/
├── controllers/    # Request handlers
├── models/         # Database models
├── routes/         # API routes
└── services/       # Business logic

## Key Decisions
- Sequelize ORM for type-safe database access
- Jest + Supertest for testing
- All errors inherit from AppError class

## Common Issues
- DB connection timeouts: increase timeout to 30s
- Jest fails in CI: set NODE_ENV=test explicitly
```

**Tip:** Keep it concise (200-500 lines). Focus on what Claude needs to know, not general documentation.

---

## 3. Task 2: Build a Custom Skill (5 min)

Create `.claude/skills/code-review/SKILL.md`:

```markdown
---
name: code-review
description: Review code for bugs, security, and quality
user-invocable: true
context: fork
allowed-tools: [Read, Grep, Glob]
argument-hint: "[file-path]"
---

# Code Review

Review the provided code ($ARGUMENTS) for the following:

1. **Bugs** — null checks, race conditions, logic errors
2. **Security** — injection, hardcoded secrets, auth bypass
3. **Performance** — N+1 queries, inefficient loops
4. **Style** — follow project conventions from CLAUDE.md

## Output Format
Rate each finding: CRITICAL / HIGH / MEDIUM / LOW
Include file path, line number, and suggested fix.
```

Test it:

```bash
claude
> /code-review src/api.js
```

---

## 4. Task 3: Define a Subagent Role (3 min)

Create `.claude/agents/code-reviewer.md` (as learned in M7):

```markdown
---
name: code-reviewer
description: Security and quality reviewer (read-only)
tools:
  - Read
  - Grep
  - Glob
model: sonnet
---

You are an expert code reviewer. Focus on:

1. **Security**: Vulnerabilities, injection, hardcoded secrets
2. **Performance**: N+1 queries, inefficient loops
3. **Maintainability**: Clarity, naming, test coverage

Be concise. Prioritize: security > performance > style.
Only review files in `src/` and `tests/`.
```

Test it:

```bash
> @code-reviewer Review src/payment.ts for security issues
```

---

## 5. Task 4: Connect MCP Server (3 min)

Create `.mcp.json` in the project root:

```json
{
  "mcpServers": {
    "github": {
      "transport": "http",
      "url": "https://mcp.github.example.com",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    }
  }
}
```

Or via CLI:

```bash
claude mcp add --transport http --scope project github \
  https://mcp.github.example.com \
  --header Authorization "Bearer ${GITHUB_TOKEN}"
```

---

## 6. Task 5: Configure a Hook (3 min)

Add to `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "/bin/bash -c 'FILE=$(echo \"$TOOL_INPUT\" | jq -r .file_path); npx prettier --write \"$FILE\" 2>/dev/null; echo \"Formatted: $FILE\"'"
          }
        ]
      }
    ]
  }
}
```

Note: `$TOOL_INPUT` is JSON (e.g. `{"file_path": "/src/app.js", ...}`), so we extract the path with `jq` before passing it to Prettier. Exit 0 = continue, exit 2 = block.

---

## 7. Task 6: Sketch CI/CD (3 min)

Create `.github/workflows/claude-review.yml`:

```yaml
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
      - name: Claude Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "Review this PR for security and quality." \
            --output-format text \
            --allowedTools Read,Grep \
            --dangerously-skip-permissions > review.txt
      - name: Post Comment
        uses: actions/github-script@v7
        with:
          script: |
            const review = require('fs').readFileSync('review.txt','utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## Claude Review\n\n${review}`
            });
```

---

## 8. Final Project Structure

```
your-repo/
├── CLAUDE.md                         # Task 1
├── .claude/
│   ├── settings.json                 # Task 5 (hooks)
│   ├── skills/
│   │   └── code-review/SKILL.md      # Task 2
│   └── agents/
│       └── code-reviewer.md          # Task 3
├── .mcp.json                         # Task 4
├── .github/
│   └── workflows/
│       └── claude-review.yml         # Task 6
├── src/
├── tests/
└── package.json
```

---

## 9. Evaluation Checklist

- [ ] New team member can clone and immediately use Claude Code
- [ ] CLAUDE.md covers architecture, key decisions, common tasks
- [ ] At least one custom skill works
- [ ] MCP server is configured (even if token placeholder)
- [ ] Hook runs automatically on file edits
- [ ] CI/CD workflow exists for PR reviews
- [ ] Permissions are reasonable (not overly restrictive)

---

## 10. Workshop Wrap-Up

### Key Takeaways

1. **CLAUDE.md is your team's knowledge base** — keep it updated
2. **Plan first, execute second** — saves tokens and time
3. **Skills & subagents extend Claude's capabilities** — build for your workflows
4. **MCP connects to external systems** — GitHub, Jira, databases
5. **Hooks enforce quality deterministically** — they always run
6. **Headless mode enables CI/CD** — automate reviews, checks
7. **Context rot is real** — manage it with `/clear`, `/compact`, commits

### Next Steps

- **Today:** Deploy your capstone setup, have a teammate try it
- **This week:** Refine hooks, add skills as tasks emerge
- **This month:** Package workflows as plugins, share across repos
- **Ongoing:** Keep CLAUDE.md current, monitor `/cost`, adopt new features

### Resources

- [Claude Code Docs](https://docs.anthropic.com/claude-code)
- [Official Plugins](https://github.com/anthropics/claude-code/tree/main/plugins)
- Anthropic Discord & GitHub Discussions

---

**Congratulations!** You've completed the Claude Code Deep Dive Workshop. Your team is now equipped with a solid foundation for productive Claude Code usage.
