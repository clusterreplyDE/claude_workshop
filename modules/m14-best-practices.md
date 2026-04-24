# Module 14 — Best Practices & Patterns (15 min)

> *Learning from experience*



## Contents

- [Learning Objectives](#learning-objectives)
- [1. Context Management: /clear vs. /compact](#1-context-management-clear-vs-compact)
- [2. Context Rot: Why AI Gets Worse Over Time](#2-context-rot-why-ai-gets-worse-over-time)
- [3. Plan Mode First](#3-plan-mode-first)
- [4. Prompt Hygiene](#4-prompt-hygiene)
- [5. Common Patterns](#5-common-patterns)
- [6. Decision Guide: When to Use What](#6-decision-guide-when-to-use-what)
- [Summary](#summary)


## Learning Objectives

By the end of this module, participants will be able to:

- Manage context effectively with `/clear` and `/compact`
- Understand context rot and how to prevent it
- Apply plan-first workflows
- Write better prompts for Claude Code

---

## 1. Context Management: /clear vs. /compact

### /clear — Start Fresh

Use when **switching to an unrelated task**:

```bash
> /plan implement auth module
> ... (finish, commit)
> /clear                          # Reset context completely
> /plan optimize database queries  # New task, fresh context
```

### /compact — Consolidate

Use when **continuing a long task** but context is getting noisy:

```bash
> ... (50 turns of work on the same feature)
> /compact                        # Distill context, keep direction
> ... (continue with fresh room)

# Focus on specific aspects
> /compact --focus "tests"        # Prioritize test-related context
```

### Decision Guide

| Situation | Command |
|-----------|---------|
| New, unrelated task | `/clear` |
| Long session, same task | `/compact` |
| Token limit approaching, task ongoing | `/compact --focus` |
| Debugging feels confused | `/clear` and restart |

---

## 2. Context Rot: Why AI Gets Worse Over Time

The longer a session runs, the noisier it becomes:

```
Turn 1-10:   Clean context, focused responses
Turn 20-30:  Tangents accumulate, some contradictions
Turn 50+:    "Context rot" — conflicting instructions,
             abandoned experiments, stale status messages
             → Claude hesitates, repeats, gets confused
```

### Why It Happens

- Contradicting instructions: "Use pattern A" → later "Actually use B" — both in context
- Abandoned experiments still visible
- Old status ("tests failing") contradicts new state ("tests pass now")
- Debugging tangents and dead ends pile up

### Prevention

| Strategy | When |
|----------|------|
| `/compact` regularly | Every 30-50 turns |
| `/plan` before big tasks | Start of each feature |
| Commit to git often | After logical steps |
| Document in CLAUDE.md | End of session |
| `/clear` between tasks | Task switch |

---

## 3. Plan Mode First

For any non-trivial task, **plan before executing**:

```bash
# In a session, switch to plan mode first:
Shift+Tab  # Cycle to "plan" mode

# Then give your task:
> refactor payment module for better error handling

# Claude outputs a plan (no code changes yet):
# 1. Analyze current structure
# 2. Design new exception hierarchy
# 3. Implement changes
# 4. Update tests

# Review — Does it match your intent?
# If yes, switch back to default or acceptEdits mode:
Shift+Tab  # Cycle to "default" or "acceptEdits"

# Then execute:
> Go ahead with the plan
# Claude follows the plan, less backtracking
```

You can also use the `/plan` slash command for a one-off plan without switching modes:

```bash
> /plan refactor payment module for better error handling
# Claude creates a plan, you review, then approve execution
```

### Why Plan First?

- **Catch misunderstandings** before Claude acts
- **Save tokens** — one good plan vs. trial-and-error
- **Better code** — thoughtful design over reactive coding

```bash
# BAD: Jump in
> refactor the entire API layer
# Risk: wrong direction, wasted time

# GOOD: Plan first
> /plan refactor the entire API layer
# Review together, then execute with confidence
```

---

## 4. Prompt Hygiene

### Be Specific, Not Verbose

```bash
# Bad: vague
claude "look at the code and make it better"

# Good: specific
claude "add error handling for null API responses in the payment module"
```

### Let Claude Explore

```bash
# Bad: micromanaging every step
claude "read src/auth.ts, then add validatePassword using bcrypt with salt 10..."

# Good: goal-oriented
claude "add bcrypt password validation to the auth module"
# Claude figures out the how
```

### Provide Examples When Needed

```bash
# Unclear
claude "improve the error messages"

# Clear with example
claude "improve error messages to be user-friendly, like:
  Instead of: 'Invalid input'
  Use: 'Email address must contain an @ symbol'"
```

### One Task Per Prompt

```bash
# Too much
claude "implement login, fix payments bug, and refactor database"

# Focused
claude "implement the login flow"
# ... finish, test, commit
claude "fix the payment processing bug"
```

---

## 5. Common Patterns

### Feature + Tests Together

```bash
> /plan add two-factor authentication
# Review, then execute — Claude implements feature AND tests
git add src/auth-2fa.ts tests/auth-2fa.test.ts
git commit -m "feat: add two-factor auth with tests"
```

### Debate-and-Decide

When unsure which approach to take:

```bash
> /plan implement caching — should we use Redis or in-memory?
# Claude compares tradeoffs, recommends
# You decide together, then execute
```

### Progressive Refinement

Start simple, enhance iteratively:

```
1. Basic feature → commit, test
2. Add error handling → commit, test
3. Add logging → commit
4. Add metrics → commit
```

---

## 6. Decision Guide: When to Use What

One of the most common questions: "I want to enforce X — where do I put it?" This table helps you choose:

| I want to... | Use | Why |
|---|---|---|
| Tell Claude about project conventions | **CLAUDE.md** | Always loaded, passive knowledge |
| Apply rules only for specific file paths | **Rules** (`.claude/rules/`) | Conditional, loaded on match |
| Automate a repeatable workflow | **Skill** (`.claude/skills/`) | Invocable, reusable across sessions |
| Create a quick shortcut command | **Command** (`.claude/commands/`) | Simple one-line trigger |
| Guarantee something runs every time | **Hook** | Deterministic, exit 0/2 control |
| Delegate to a focused specialist | **Subagent** | Isolated context, own tools |
| Share workflows across repos/teams | **Plugin** | Namespaced, versioned package |

### Example: "Always run tests before committing"

| Approach | Mechanism | Tradeoff |
|---|---|---|
| CLAUDE.md instruction | "Always run tests before git commit" | Claude *should* comply, but might forget |
| Hook (PreToolUse on Bash) | Script checks for `git commit`, runs `npm test` first | **Guaranteed** — runs every time, blocks on failure |
| Skill `/test-and-commit` | Workflow: run tests → commit if pass | Convenient, but Claude must choose to invoke it |

**Rule of thumb:** If it *must* happen → Hook. If Claude *should know* → CLAUDE.md. If it's a *workflow to invoke* → Skill.

---

## Summary

| Practice | When to Use |
|----------|------------|
| **/clear** | New unrelated task |
| **/compact** | Long session, token budget tight |
| **Plan mode / `/plan` first** | Complex features, refactors |
| **Specific prompts** | Every interaction |
| **One task per prompt** | Keep focus |
| **Commit often** | After logical steps |
| **Decision guide** | Choosing CLAUDE.md vs. rules vs. skills vs. hooks |

**Key Takeaway:** Plan first, prompt clearly, manage context, commit often. Use the decision guide above to put knowledge and automation in the right place.

**Up next:** Module 15 — Capstone: Putting It All Together.
