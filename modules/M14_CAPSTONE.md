# Module 14 — Capstone: Putting It All Together (25 min)

> *From empty repo to productive setup*

## Learning Objectives

By the end of this module, participants will be able to:

- Create a complete Claude Code setup in a new repository
- Build a CLAUDE.md project guide from scratch
- Write a custom skill with proper structure
- Define a subagent for a specialized task
- Configure MCP servers and hooks
- Sketch CI/CD integration with Claude Code
- Understand how to evaluate setup quality

---

## 1. The Capstone Challenge

**Goal:** Build a complete, team-ready Claude Code setup in 25 minutes.

**Starting point:** Empty repository (or provided starter)

**End state:** New team member clones the repo and is immediately productive with Claude Code.

### Success Criteria

When a new team member clones your repo, they should:

1. See clear Claude Code guidance in CLAUDE.md
2. Have at least one working skill to try
3. Understand the code review process (via subagent)
4. Have access to external systems via MCP
5. Have automation hooks protecting code quality
6. See a CI/CD integration example

### The 6 Required Tasks

| Task | Deliverable | Time |
|------|-------------|------|
| 1. Create CLAUDE.md | Project guide + rules | 5 min |
| 2. Build a custom skill | Review skill with SKILL.md | 5 min |
| 3. Define a subagent | Code-reviewer or similar | 4 min |
| 4. Connect MCP server | GitHub or filesystem | 3 min |
| 5. Configure a hook | Auto-format or lint on edit | 4 min |
| 6. Sketch CI/CD integration | GitHub Action YAML | 4 min |

---

## 2. Task 1: Create CLAUDE.md (5 min)

### Starter Template

Save as `.claude/CLAUDE.md` (or root `CLAUDE.md`):

```markdown
# Claude Code Guide for [Project Name]

## Project Overview
Brief description of what this project does.
- Tech stack: Node.js, Express, PostgreSQL
- Purpose: REST API for user management
- Team: [Your team name]

## Getting Started with Claude Code

### Quick Commands
- `claude` — start a session
- `claude --plan "your task"` — plan first, then execute
- `/code-reviewer:review <file>` — get code review feedback
- `/lint-formatter:fix` — auto-format code

### Key Context for Claude
- Database: PostgreSQL with Sequelize ORM
- API framework: Express.js (router in src/routes/)
- Testing: Jest + Supertest for integration tests
- Error handling: Use custom AppError class (src/utils/errors.ts)

## Architecture
```
src/
├── controllers/    # Request handlers
├── models/        # Database models
├── routes/        # API routes
├── middleware/    # Express middleware
├── utils/         # Helpers, error classes
└── services/      # Business logic

tests/
├── unit/          # Controller, service tests
└── integration/   # API endpoint tests
```

## Key Decisions
- **Why Sequelize?** Type-safe ORM with good PostgreSQL support.
- **Why Jest?** Fast, good coverage reporting, works with Node.js.
- **Error handling:** All errors inherit from AppError for consistency.

## Common Tasks
### Add a new API endpoint
1. Create controller in `src/controllers/`
2. Add route in `src/routes/`
3. Write tests in `tests/integration/`
4. Document in README.md

### Fix a database issue
- Sequelize docs: https://sequelize.org/
- Check migrations in `db/migrations/`
- Never modify migrations after deploy; create new ones

## Known Issues & Workarounds
- PostgreSQL connection timeouts on slow networks: increase timeout to 30s in config
- Jest tests fail in CI: set NODE_ENV=test explicitly

## Useful Links
- [Sequelize Docs](https://sequelize.org)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- Team wiki: [Your Wiki URL]

## Claude Code Rules & Permissions
- Read access: full codebase
- Write access: `src/`, `tests/`
- Bash access: `git`, `npm test`, `npm run build`
- Protected: `.env`, `.git/config`, `package.json` (requires approval)
```

### Example: Rules Configuration

Save as `.claude/rules.json`:

```json
[
  {
    "action": "Read",
    "paths": ["src/**", "tests/**", "docs/**"],
    "allow": true
  },
  {
    "action": "Edit",
    "paths": ["src/**/*.js", "tests/**/*.js"],
    "allow": true,
    "requiresApproval": false
  },
  {
    "action": "Edit",
    "paths": ["package.json"],
    "allow": true,
    "requiresApproval": true
  },
  {
    "action": "Bash",
    "paths": ["git status", "git log", "git diff"],
    "allow": true
  },
  {
    "action": "Bash",
    "paths": ["npm test", "npm run build"],
    "allow": true
  },
  {
    "action": "Bash",
    "paths": ["rm -rf", "sudo"],
    "allow": false
  }
]
```

---

## 3. Task 2: Build a Custom Skill (5 min)

### Skill: Code Review Assistant

Save as `.claude/skills/code-review/SKILL.md`:

```markdown
# Code Review Assistant

```yaml
---
title: Code Review Assistant
subtitle: Comprehensive review of code changes
author: Team
version: 1.0
commands:
  - "/code-review:review <file>"
  - "/code-review:pr-check"
---
```

## Description
Reviews code for bugs, security issues, performance problems, and style violations.

## Usage

### Review a single file
\`\`\`bash
/code-review:review src/auth.ts
\`\`\`

### Check a PR
\`\`\`bash
/code-review:pr-check
\`\`\`

## What the Review Includes
1. **Bugs & Logic Errors** — Incorrect loops, null checks, race conditions
2. **Security** — SQL injection, XSS, hardcoded secrets
3. **Performance** — N+1 queries, inefficient algorithms, missing indexes
4. **Style & Patterns** — Follow project conventions
5. **Testing** — Are edge cases covered?

## Example

Input: \`src/payment.ts\`

Output:
\`\`\`
CRITICAL (Security):
  Line 42: SQL injection risk in query builder. Use parameterized queries.

HIGH (Performance):
  Line 67: N+1 query detected. Use .include() to eager-load relations.

MEDIUM (Code Quality):
  Line 89: Error message is vague. Be more specific for debugging.

SUGGESTION:
  Add JSDoc for public functions. Make testing easier for next developer.
\`\`\`

## When to Use
- Before pushing to GitHub (catch issues early)
- On PRs (auto-comment with findings)
- Learning phase (understand patterns)
```

### Implementation Logic (in CLAUDE.md or skill comment)

```
1. Read the file completely
2. Analyze for security patterns (injections, auth bypass)
3. Check for performance issues (queries, loops)
4. Compare against project conventions
5. Generate structured feedback
6. Prioritize by severity (critical > high > medium > low)
```

---

## 4. Task 3: Define a Subagent (4 min)

### Subagent: Code Reviewer

Save as `.claude/agents/code-reviewer.json`:

```json
{
  "name": "code-reviewer",
  "role": "Code Review Expert",
  "description": "Automated code reviewer for PRs and files",
  "version": "1.0",
  "permissions": {
    "mode": "acceptEdits",
    "rules": [
      {
        "action": "Read",
        "paths": ["src/**", "tests/**"],
        "allow": true
      },
      {
        "action": "Bash",
        "paths": ["git diff", "git log"],
        "allow": true
      }
    ]
  },
  "context": {
    "max_tokens": 8000,
    "instructions": "You are a code review expert. When analyzing code:\n1. Check for bugs, security issues, performance problems\n2. Compare against project conventions\n3. Provide specific, actionable feedback\n4. Rate each finding: critical/high/medium/low\n5. Format findings as structured list",
    "initial_context": ".claude/CLAUDE.md"
  },
  "triggers": {
    "on_pr_opened": true,
    "on_commit_to_main": false,
    "manual": true
  }
}
```

### Usage

```bash
# Manual invocation
$ /code-reviewer:review src/payment.ts

# Output: Structured review with findings and severity
```

---

## 5. Task 4: Connect an MCP Server (3 min)

### MCP Example: GitHub Integration

Save as `.claude/.mcp.json`:

```json
{
  "servers": {
    "github": {
      "command": "npx",
      "args": [
        "@anthropic-ai/github-mcp-server"
      ],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}",
        "GITHUB_OWNER": "your-org",
        "GITHUB_REPO": "your-repo"
      },
      "disabled": false
    }
  }
}
```

### Setup Steps

```bash
# 1. Create a GitHub personal access token (or use existing)
#    https://github.com/settings/tokens
#    Scopes: repo, read:user

# 2. Set environment variable
export GITHUB_TOKEN="ghp_your_token_here"

# 3. Enable MCP in Claude Code
# (It auto-loads from .mcp.json)

# 4. Use in a session
$ claude
> /github list-issues  # Now available!
> /github create-pr    # Also available
```

### Alternative: Filesystem MCP

```json
{
  "servers": {
    "filesystem": {
      "command": "node",
      "args": [
        "path/to/filesystem-mcp-server.js"
      ],
      "disabled": false
    }
  }
}
```

---

## 6. Task 5: Configure a Hook (4 min)

### Hook: Auto-Format on Edit

Save as `.claude/hooks/format-on-save.json`:

```json
{
  "name": "format-on-save",
  "description": "Auto-format JavaScript/TypeScript on file edit",
  "trigger": "on_edit",
  "conditions": {
    "file_pattern": ["src/**/*.{js,ts,jsx,tsx}"]
  },
  "actions": [
    {
      "type": "bash",
      "command": "npx prettier --write {{file}}"
    }
  ]
}
```

### Hook: Prevent Commits Without Tests

Save as `.claude/hooks/pre-commit-check.json`:

```json
{
  "name": "pre-commit-check",
  "description": "Ensure tests pass before commit",
  "trigger": "before_git_commit",
  "actions": [
    {
      "type": "bash",
      "command": "npm test -- --changed"
    }
  ],
  "on_failure": {
    "action": "abort",
    "message": "Tests must pass before commit. Run 'npm test' to see failures."
  }
}
```

### Hook: ESLint on Save

Save as `.claude/hooks/eslint-on-save.json`:

```json
{
  "name": "eslint-on-save",
  "description": "Run eslint and report issues",
  "trigger": "on_edit",
  "conditions": {
    "file_pattern": ["src/**/*.{js,ts}"]
  },
  "actions": [
    {
      "type": "bash",
      "command": "npx eslint {{file}} --format json"
    }
  ],
  "on_failure": {
    "action": "warn",
    "message": "ESLint found issues. Consider running 'npx eslint --fix {{file}}'."
  }
}
```

---

## 7. Task 6: Sketch CI/CD Integration (4 min)

### GitHub Actions Workflow with Claude Code

Save as `.github/workflows/claude-code-review.yml`:

```yaml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  claude-review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Get changed files
        id: changed
        run: |
          echo "files=$(git diff origin/main...HEAD --name-only | tr '\n' ' ')" >> $GITHUB_OUTPUT

      - name: Install Claude Code CLI
        run: npm install -g @anthropic-ai/claude-code

      - name: Run Claude Code Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude --headless --cost-limit 5 --mode auto \
            "/code-review:pr-check ${{ steps.changed.outputs.files }}" > review.md

      - name: Comment on PR with Review
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## Claude Code Review\n\n${review}`
            });
```

### GitHub Actions Workflow: Auto-Fix

```yaml
name: Claude Auto-Fix

on:
  workflow_run:
    workflows: ["Tests"]
    types: [completed]

jobs:
  auto-fix:
    if: failure()
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Install Claude Code CLI
        run: npm install -g @anthropic-ai/claude-code

      - name: Run Auto-Fix
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude --headless --auto-fix --watch-ci

      - name: Commit and Push
        if: success()
        run: |
          git config user.email "claude@anthropic.com"
          git config user.name "Claude"
          git add .
          git commit -m "fix: auto-fix CI issues"
          git push
```

---

## 8. Project Structure at the End

Here's what your repository looks like after the capstone:

```
your-repo/
├── .claude/
│   ├── CLAUDE.md                    # Project guide (Task 1)
│   ├── rules.json                   # Permissions (Task 1)
│   ├── skills/
│   │   └── code-review/
│   │       └── SKILL.md             # Code review skill (Task 2)
│   ├── agents/
│   │   └── code-reviewer.json       # Code reviewer subagent (Task 3)
│   ├── .mcp.json                    # MCP configuration (Task 4)
│   └── hooks/
│       ├── format-on-save.json      # Auto-format hook (Task 5)
│       ├── pre-commit-check.json
│       └── eslint-on-save.json
├── .github/
│   └── workflows/
│       ├── claude-code-review.yml   # CI/CD integration (Task 6)
│       └── claude-auto-fix.yml
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── services/
├── tests/
│   ├── unit/
│   └── integration/
├── README.md
└── package.json
```

---

## 9. Evaluation Criteria: Is Your Setup Good?

### Checklist for Success

- [ ] **New team member can clone and immediately use Claude Code** (no setup docs needed)
- [ ] **CLAUDE.md is clear and comprehensive** (covers architecture, key decisions, common tasks)
- [ ] **At least one custom skill works and is useful** (code review, formatting, etc.)
- [ ] **Subagent is focused on a single responsibility** (code review, tests, docs)
- [ ] **MCP servers are configured and tested** (can list issues, create PRs, etc.)
- [ ] **Hooks run automatically and prevent common mistakes** (format on save, tests on commit)
- [ ] **CI/CD integration exists and works** (GitHub Actions comments with reviews)
- [ ] **Permissions are reasonable** (not overly restrictive, but safe)

### Quality Metrics

| Metric | Good | Bad |
|--------|------|-----|
| **CLAUDE.md length** | 200-500 lines (concise but complete) | >1000 lines (bloated) or <100 lines (vague) |
| **Number of skills** | 1-3 high-quality skills | 10+ half-baked skills |
| **Subagent usage** | Used for 1-2 focused tasks | Used for everything |
| **Hook count** | 2-4 enforcing important rules | 20+ hooks slowing down work |
| **CI/CD integration** | Simple, reliable, informs PRs | Complex, brittle, lots of false positives |

---

## 10. Wrap-Up: Key Takeaways

### From the Entire Workshop

1. **Claude Code is a team tool** — CLAUDE.md, rules, and skills make it shine
2. **Context management matters** — Use `/clear`, `/compact`, and plan mode wisely
3. **Plan first, execute second** — Saves tokens and time
4. **Automation enforces quality** — Hooks and CI/CD prevent bad code
5. **MCP connects you to external systems** — GitHub, Jira, Slack, databases
6. **Permissions are your safety net** — Configure granular rules, not just modes
7. **Multi-agent patterns scale work** — Subagents, background tasks, parallel execution
8. **Plugins enable reuse** — Package and share workflows across teams

### Your Setup Is Now:

- **Reproducible** — New team members clone and go
- **Documented** — CLAUDE.md serves as living docs
- **Automated** — Hooks and CI/CD enforce standards
- **Extensible** — Easy to add skills, rules, and hooks
- **Integrated** — Connected to external systems via MCP
- **Scalable** — Multi-agent patterns handle growth

---

## 11. Next Steps: Where to Go From Here

### Immediate (Today)
1. Deploy your capstone setup to GitHub/GitLab
2. Have a teammate clone and try it
3. Iterate on feedback (CLAUDE.md clarity, hook effectiveness)

### Short Term (This Week)
- Add more skills as common tasks emerge
- Refine hooks based on real workflow
- Monitor CI/CD integration for false positives/negatives

### Medium Term (This Month)
- Create plugins if you have workflows used across repos
- Document lessons learned in CLAUDE.md
- Set up auto-fix workflows for common issues

### Long Term (Ongoing)
- Keep CLAUDE.md updated as architecture evolves
- Share skills and plugins with other teams
- Monitor Claude Code updates and adopt new features
- Use `/cost` to understand usage trends

### Resources

- **Official Docs**: [docs.anthropic.com/claude-code](https://docs.anthropic.com/claude-code)
- **Community**: Anthropic Discord, GitHub Discussions
- **API Docs**: Claude Messages API, Agent SDK
- **Your Team Wiki**: Update with Claude Code best practices specific to your org

---

## 12. Feedback & Q&A

### Reflection Questions

- What's the **most useful part** of Claude Code for your workflow?
- What **configuration choices** did you make and why?
- What **surprised you** about how Claude Code works?
- What **would you change** about the setup if starting over?

### Workshop Feedback

Please share feedback on:
- Module clarity and pacing
- Hands-on exercises
- Code examples
- Diagrams and visual aids
- Overall value

Your feedback shapes future workshops!

> 🏢 **Reply Context:** Apply what you've built today to your BMW projects. Start with a CLAUDE.md for your team's conventions (AKS, Helm, .NET), add a Terraform validation skill, connect GitHub Enterprise via MCP, and set up a hook for `terraform fmt`. Share your setup as a Reply plugin so other teams benefit too.

---

## Summary: From Empty Repo to Production Ready

| Task | Output | Benefit |
|------|--------|---------|
| **CLAUDE.md** | Project guide + rules | Team onboarding, context for Claude |
| **Skill** | Code review workflow | Reusable, shareable, searchable |
| **Subagent** | Focused reviewer | Parallel work, isolated execution |
| **MCP** | External system access | GitHub, Jira, Slack integration |
| **Hooks** | Auto-format, pre-commit checks | Quality gates, error prevention |
| **CI/CD** | GitHub Actions workflow | Automated reviews on PRs |

**Result:** A new team member clones your repo, runs `claude`, and is immediately productive. That's the win.

---

## Appendix: Starter Template Files

### File 1: .claude/CLAUDE.md (copy-paste starting point)

```markdown
# Claude Code Guide for [Your Project]

## Project Overview
[1-2 sentences about what this project does]

## Quick Start
- Clone repo, run `npm install`
- Start Claude Code: `claude`
- Try a skill: `/code-review:review src/main.ts`

## Architecture
[Diagram or description of main components]

## Claude Code Tips
- Use `/code-review:review` before committing
- Use `/plan "your task"` to see Claude's approach first
- Hooks auto-format your code and run tests

## Key Files
- `src/` — main application code
- `tests/` — unit and integration tests
- `.claude/` — Claude Code configuration

## Common Issues
[List any gotchas specific to your project]
```

### File 2: .claude/rules.json (copy-paste starting point)

```json
[
  {
    "action": "Read",
    "paths": ["src/**", "tests/**"],
    "allow": true
  },
  {
    "action": "Edit",
    "paths": ["src/**"],
    "allow": true
  },
  {
    "action": "Bash",
    "paths": ["git *", "npm test"],
    "allow": true
  }
]
```

---

**Congratulations!** You've completed the Claude Code Deep Dive Workshop.

Your team is now equipped to use Claude Code effectively, with a solid foundation for extending it as you grow. Keep learning, keep iterating, and keep that CLAUDE.md up to date!

