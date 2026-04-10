# Module 15 — Capstone: Putting It All Together (25 min)

> *From empty repo to productive setup*

## Learning Objectives

By the end of this module, participants will be able to:

- Create a complete Claude Code setup in a repository
- Apply all workshop concepts together
- Evaluate setup quality for team readiness

---

## 1. The Capstone Challenge

**Goal:** Build a team-ready Claude Code setup so a new team member clones the repo and is immediately productive.

**Starting point:** Empty repository (or provided starter in `exercises/m15-capstone/`)

### The 6 Tasks

| # | Task | Deliverable | Time |
|---|------|-------------|------|
| 1 | Create CLAUDE.md | Project guide with context | 5 min |
| 2 | Build a custom skill | Review skill with SKILL.md | 5 min |
| 3 | Define a subagent | Focused code-reviewer agent | 3 min |
| 4 | Connect MCP server | GitHub or filesystem | 3 min |
| 5 | Configure a hook | Auto-format or lint on edit | 3 min |
| 6 | Sketch CI/CD integration | GitHub Action YAML | 3 min |

Work through each task below. Use earlier modules as reference.

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
- `claude --plan "your task"` — plan first
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
title: Code Review Assistant
subtitle: Review code for bugs, security, and quality
author: Team
version: 1.0
---

## Description
Reviews code for bugs, security issues, performance, and style.

## What to Check
1. **Bugs** — null checks, race conditions, logic errors
2. **Security** — injection, hardcoded secrets, auth bypass
3. **Performance** — N+1 queries, inefficient loops
4. **Style** — follow project conventions from CLAUDE.md

## Output Format
Rate each finding: CRITICAL / HIGH / MEDIUM / LOW
Include file path, line number, and suggested fix.
```

Test it: `claude` → ask Claude to review a file using the skill.

---

## 4. Task 3: Define a Subagent (3 min)

In a Claude session, use the `Task` tool pattern from Module 7:

```
> Create a subagent to review src/payment.ts for security issues.
  It should be read-only and only inspect src/ and tests/ directories.
```

Or define in CLAUDE.md under a "Subagents" section describing the code-reviewer role for the team.

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
            "command": "/bin/bash -c 'npx prettier --write $TOOL_INPUT 2>/dev/null; echo \"Formatted: $TOOL_INPUT\"'"
          }
        ]
      }
    ]
  }
}
```

This auto-formats files after every edit. Remember: exit 0 = continue, exit 2 = block.

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
          CLAUDE_API_KEY: ${{ secrets.CLAUDE_API_KEY }}
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
│   └── skills/
│       └── code-review/SKILL.md      # Task 2
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
