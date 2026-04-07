# Module 13 — Best Practices & Patterns (15 min)

> *Learning from experience*

## Learning Objectives

By the end of this module, participants will be able to:

- Recognize when to clear context vs. compact it
- Understand context rot and how to maintain quality in long sessions
- Apply plan-first workflows for complex features
- Adopt prompt hygiene principles
- Use multi-agent patterns for parallel and focused work
- Choose between CLAUDE.md, rules, skills, and subagents

---

## 1. When to `/clear`: Starting Fresh

Use `/clear` when **starting a new, unrelated task** in the same session:

### Clear Your Context When:

| Scenario | Why | Command |
|----------|-----|---------|
| Switching projects entirely | Stale context from old project | `/clear` |
| Long session, task is done | Context accumulated, needs reset | `/clear` |
| Debugging a weird issue | Fresh mind, no baggage | `/clear` |
| Handing off to another person | They don't need your history | `/clear` |
| Context limit approaching | Approaching token ceiling | `/clear` |

### Example: When NOT to Clear

```bash
# ✗ DON'T clear between related tasks
$ claude
> /plan "implement auth module"
> ... (execute the plan)
> /plan "add JWT validation"  # Same feature, continue context

# ✓ DO clear when starting something totally different
$ claude
> /plan "implement auth module"
> ... (finished and merged)
> /clear
> /plan "optimize database queries"  # New task, fresh context
```

---

## 2. When to `/compact`: Consolidating Context

Use `/compact` when working on a **long, related task** where context is growing but you want to continue:

### Compact Your Context When:

| Scenario | Why | Command |
|----------|-----|---------|
| Session running for hours | Conversation noise accumulates | `/compact` |
| Many file edits already made | Earlier steps less relevant | `/compact` |
| Token count high but task ongoing | Need room for more work | `/compact --focus tests` |
| Multiple iterations on same feature | Reduce noise, keep goal | `/compact` |

### Using the `--focus` Parameter

```bash
# Compact, but prioritize context about tests
$ /compact --focus tests

# Compact, with multiple focus areas
$ /compact --focus "tests" "performance"

# Compact output: reduced noise, key concepts preserved
# You continue working with fresh context for the next steps
```

### What `/compact` Does

```
Before:
  - 50 conversation turns
  - 15 files read
  - 3 file edits
  - Total: 78K tokens

/compact --focus tests
  ↓
After:
  - Key concepts from conversation distilled
  - Recent file reads retained
  - Focused on "tests" direction
  - Total: 12K tokens
  ↓
  Continue working with fresh room
```

---

## 3. Understanding Context Costs

### `/context` Command

Inspect what's loaded in your current context:

```bash
$ /context

Context Breakdown:
  CLAUDE.md ...................... 2.1 KB
  .claude/rules/ ................. 4.3 KB
  .claude/skills/ ................ 18.2 KB
  MCP Tools ...................... 3.4 KB
  Loaded File Cache .............. 41.5 KB
  Conversation History ........... 127.3 KB
  ---
  Total ....................... 196.8 KB (≈ 49K tokens)

Available Budget: 1M tokens
Remaining: 951K tokens
```

### Feature Loading Overview

| Feature | When Loaded | KB Size | When to Reduce |
|---------|------------|---------|----------------|
| **CLAUDE.md** | Session start | 1-5 KB | Keep (essential) |
| **Rules** | Session start + on-match | 2-20 KB | Prune unused rules |
| **Skills** | On-demand when listed/invoked | 5-100 KB | Remove unused skills |
| **MCP tools** | Session start | 2-10 KB | Disable unused MCP |
| **File cache** | Grows as you read files | 10-200 KB | `/context clear-cache` |
| **Conversation** | Grows with each turn | 50-500+ KB | `/compact` when needed |

---

## 4. Context Rot: Why AI Gets Worse Over Time

The longer a session runs, the **noisier and less effective** it becomes:

### The Problem

```
Turn 1-10:  Claude is focused, context is clean
  ↓
Turn 20:   Conversation adds nuance, but also tangents
  ↓
Turn 50:   Claude has seen old ideas, new ideas, failures, successes
  → Mixed signals! Should I do X or Y?
  ↓
Turn 100:  Context is a mess. Claude is uncertain, repeats itself.
  → "Context rot" — AI performance degrades
```

### Why It Happens

1. **Conflicting instructions**: "Use pattern A" then later "Actually, use pattern B"
2. **Abandoned experiments**: Code that was tried and reverted, but still in context
3. **Temporal inconsistency**: Old status messages ("tests are failing") contradict new state ("tests pass now")
4. **Noise accumulation**: Conversation tangents, debugging steps, dead ends pile up

### Prevention Strategies

| Strategy | When | Benefit |
|----------|------|---------|
| **/compact regularly** | Every 30-50 turns | Removes noise, keeps direction |
| **/plan before big tasks** | Before feature work | Clear shared understanding |
| **Commit often to git** | After logical steps | Checkpoint, reduce context creep |
| **Document in CLAUDE.md** | At end of session | Persist learnings, clear context next session |
| **/clear between unrelated tasks** | Task switch | Complete reset |

---

## 5. Plan Mode First: Always Start with a Plan

Use **Plan Mode** (`Shift+Tab` in IDE, or `--plan` flag) for any complex work:

### Workflow: Plan → Review → Execute

```bash
# Step 1: Plan mode
$ claude --plan "refactor payment module for better error handling"

# Claude outputs:
# PLAN:
# 1. Analyze current payment.ts structure
# 2. Identify error handling gaps
# 3. Design new exception hierarchy
# 4. Implement and test
# 5. Update integration tests
# 6. Document changes

# Step 2: YOU review the plan
# Does it align with your intent?
# Any missing steps? Concerns?

# Step 3: Approve and execute
$ claude "refactor payment module for better error handling"

# Claude executes the approved plan
# More confident, less backtracking
```

### Why Plan First?

- **Catch misunderstandings early**: You review before Claude acts
- **Save tokens**: One good plan uses fewer tokens than trial-and-error
- **Faster execution**: Claude knows the direction, less hesitation
- **Better code**: Thoughtful design > reactive coding

### Example: Complex Refactor

```bash
# BAD: Jump into execution
$ claude "refactor the entire API layer"
# Claude might refactor incorrectly, waste time, backtrack

# GOOD: Plan first
$ claude --plan "refactor the entire API layer"
# Review the plan together
# Then execute with confidence
```

---

## 6. Prompt Hygiene: The Art of Good Instructions

### Principle 1: Be Specific, Not Verbose

```bash
# ✗ BAD: Vague and verbose
claude "look at the code and make it better and more robust and handle edge cases"

# ✓ GOOD: Specific and concise
claude "add error handling for null API responses in the payment module"
```

### Principle 2: Let Claude Explore

```bash
# ✗ BAD: Micromanaging
claude "read src/auth.ts, then add a validatePassword function using bcrypt with a salt of 10, then test it with the test file at tests/auth.test.ts"

# ✓ GOOD: Goal-oriented, let Claude figure out how
claude "add bcrypt password validation to the auth module"
# Claude will read the files, find the right places, add tests as needed
```

### Principle 3: Provide Examples When Needed

```bash
# ✗ UNCLEAR: No context for what "better" means
claude "improve the error messages"

# ✓ CLEAR: Example of desired output
claude "improve error messages to be more user-friendly, like:
  Instead of: 'Invalid input'
  Use: 'Email address must contain an @ symbol'"
```

### Principle 4: One Task Per Prompt

```bash
# ✗ TOO MUCH: Multiple unrelated goals
claude "implement login, fix the bug in payments, and refactor the database layer"

# ✓ FOCUSED: One goal at a time
claude "implement the login flow"
# ... (finish, test, commit)
claude "fix the payment processing bug"
# ... (finish, test, commit)
```

---

## 7. Multi-Agent Patterns: Parallel & Focused Work

### Pattern 1: Parallel Worktrees

Run independent tasks in separate agent instances:

```bash
# Main session: Focus on feature development
$ claude
> /plan "implement user dashboard"
> ... (work on dashboard)

# Background session (parallel): Run tests
$ claude --background "/test src/**/*.test.ts"
Background task started: bg-test-12345

# Another background session: Update docs
$ claude --background "/docs generate"
Background task started: bg-docs-67890

# Main session continues uninterrupted
# Results merge when background tasks complete
```

### Pattern 2: Subagents for Focused Work

Delegate focused subtasks to subagents (see Module 9):

```
Main Agent (you control)
  ↓
  Code Reviewer Subagent (reviews all PRs, focused task)
  Database Migration Subagent (only touches migrations/)
  Documentation Bot Subagent (generates and maintains docs)
  Security Scanner Subagent (runs static analysis)
```

### When to Use Subagents

| Scenario | Benefit |
|----------|---------|
| **Code review** | Focused on review patterns, not feature work |
| **Testing** | Dedicated to test scenarios, not main code |
| **Documentation** | Expert at docs, doesn't distract main development |
| **DevOps/CI** | Specialized in infrastructure, isolated execution |
| **Security scanning** | Runs independently, reports findings |

### Example: Code Review Subagent

```yaml
# .claude/agents/code-reviewer/agent.yaml
name: code-reviewer
role: "Code Review Expert"
permissions: read-only
context: 4000
prompt: |
  You are a code review expert. When invoked, you:
  1. Read the PR files
  2. Check for: bugs, security issues, performance, style
  3. Provide specific, actionable feedback
  4. Rate severity (critical/high/medium/low)

trigger:
  on_pr_opened: true
  on_commit_to_main: false
```

Usage:

```bash
# Main session
$ claude
> /code-reviewer:review src/auth.ts
# Subagent runs independently, returns focused feedback
# Main context uncluttered by review noise
```

---

## 8. Code Review Workflow: Claude + Human in the Loop

Combine Claude's analysis with human judgment:

### Workflow

```
1. Developer creates feature branch
   ↓
2. Push to GitHub (triggers CI/CD)
   ↓
3. Claude Code runs:
   - Linting & formatting
   - Unit tests
   - Security scan
   - Code review (automated)
   ↓
4. Claude comments on PR with findings
   ↓
5. Developer reviews Claude's feedback
   ↓
6. Developer agrees? → Approve & merge
   Developer disagrees? → Discuss with Claude, refine
   ↓
7. Merge to main, deploy
```

### Using Plan Mode for Review

```bash
# Before merging, get Claude's detailed review in plan mode
$ claude --plan "review src/payment.ts for security and performance"

# Claude's plan output:
# REVIEW PLAN:
# 1. Check for SQL injection risks
# 2. Verify input validation
# 3. Look for N+1 queries
# 4. Check error handling
# 5. Summary of findings

# Review the findings, decide on action
$ claude "implement the changes"
```

---

## 9. CLAUDE.md as a Team Asset

Your `CLAUDE.md` file is **living documentation** of your codebase's conventions and knowledge.

### How to Maintain It

1. **Version control**: Commit it to git, review in PRs
2. **Update regularly**: Add learnings after solving problems
3. **Involve the team**: Discuss changes in code review
4. **Keep it current**: Remove obsolete info

### Example Evolution

```markdown
# Original (static):
## Project Overview
Node.js microservice for payments.

---

# After Month 1 (lessons learned added):
## Project Overview
Node.js microservice for payments.

## Key Learnings
- Stripe API rate limits: 100 req/sec; use exponential backoff
- Database connection pool: max 10; adjust if load testing fails
- Error responses: always include request ID for debugging

## Common Issues & Fixes
- "ENOTFOUND" errors on stripe calls → check VPN connection
- Flaky tests in CI → increase timeout to 10s, not 5s
```

---

## 10. Feature Comparison: CLAUDE.md vs. Rules vs. Skills vs. Subagents

When should you use what?

### Decision Matrix

| Need | CLAUDE.md | Rules | Skills | Subagents |
|------|-----------|-------|--------|-----------|
| **Always-loaded project context** | ✓ | | | |
| **Team conventions** | ✓ | | ✓ | |
| **Permission boundaries** | | ✓ | | ✓ |
| **Reusable workflows** | | | ✓ | ✓ |
| **Path-specific behavior** | | ✓ | | |
| **Invocable from other sessions** | | | ✓ | ✓ |
| **Isolated execution** | | | | ✓ |
| **Parallel background tasks** | | | | ✓ |

### Examples

#### Use CLAUDE.md For:
- Project setup instructions
- Architecture diagrams
- Key algorithms or patterns
- Team decisions and rationale
- Known issues and workarounds

```markdown
## Architecture
- Frontend: React with Redux
- Backend: Node.js/Express
- Database: PostgreSQL
- Cache: Redis (sessions only)

## Key Decision: Why PostgreSQL?
We chose PG for ACID guarantees on financial transactions.
MySQL was considered but rejected due to weaker transaction isolation.
```

#### Use Rules For:
- File access control
- Permission boundaries by path
- Conditional behavior (read-only in `.git/`, writable in `src/`)

```json
{
  "rules": [
    {
      "action": "Edit",
      "paths": ["src/**"],
      "allow": true
    },
    {
      "action": "Edit",
      "paths": [".git/**"],
      "allow": false
    }
  ]
}
```

#### Use Skills For:
- Reusable workflows (code review, linting, docs)
- Invoked by `/skill-name` in any session
- Shareable across repos

```bash
# Anyone on the team can invoke
$ claude
> /code-review:review src/auth.ts
```

#### Use Subagents For:
- Specialized, focused roles (code reviewer, security scanner)
- Parallel execution
- Isolated context

```bash
# Subagent runs independently
$ /code-reviewer:check src/payment.ts
# Returns focused review without cluttering main context
```

---

## 11. Common Patterns

### Pattern: Feature + Tests Together

```bash
$ claude --plan "add two-factor authentication"
# Review plan

$ claude "add two-factor authentication"
# Claude implements:
# 1. TOTP generation
# 2. Storage mechanism
# 3. Verification logic
# 4. Tests for each piece

# Commit together
$ git add src/auth-2fa.ts tests/auth-2fa.test.ts
$ git commit -m "feat: add two-factor auth with tests"
```

### Pattern: Debate-and-Decide

When unsure which approach is best:

```bash
$ claude --plan "implement caching for API calls — should we use Redis or in-memory?"

# Claude compares:
# - Redis: persistent, scalable, but adds dependency
# - In-memory: simple, fast, but lost on restart
# - Recommendation: Redis for production, in-memory for dev

# Decide together, then execute
```

### Pattern: Progressive Refinement

Start simple, then enhance:

```
1. Implement basic feature
2. Commit, test
3. Add error handling
4. Commit, test
5. Add logging
6. Add metrics
7. Final commit
```

> 🏢 **Reply Context:** For BMW projects, the plan-first approach is especially important given the complexity of AKS deployments and Terraform infrastructure. Establish a team convention: always start complex Terraform changes in Plan mode, review the plan, then execute. Keep CLAUDE.md maintained as a team asset — review it in PRs just like code.

---

## Summary

| Practice | Benefit | When to Use |
|----------|---------|------------|
| **/clear** | Fresh context | Starting new unrelated task |
| **/compact** | Reduce noise | Long session, token budget tight |
| **/plan first** | Catch issues early | Complex features, refactors |
| **Prompt hygiene** | Better results | Every prompt; be specific, not verbose |
| **Multi-agent patterns** | Parallel work | Independent tasks (tests, docs) |
| **CLAUDE.md** | Team knowledge | Always-needed context |
| **Rules** | Permission control | File-based boundaries |
| **Skills** | Reusable workflows | Invoke across repos |
| **Subagents** | Focused work | Specialized roles, parallel tasks |

**Key Takeaway:** Claude Code works best when you **plan first, provide clear prompts, and use the right tool for the job**. Context rot is real — manage it with `/clear`, `/compact`, and regular commits.

**Up next:** Module 14 — Capstone, where you'll build a complete Claude Code setup from scratch.
