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

1. **Bugs** — null checks, race conditions, logic errors, off-by-one
2. **Security** — injection risks, hardcoded secrets, missing auth checks
3. **Performance** — N+1 queries, inefficient loops, unnecessary allocations
4. **Style** — follow project conventions from CLAUDE.md

## Output Format

For each finding:
- **Severity**: CRITICAL / HIGH / MEDIUM / LOW
- **Location**: file path and line number
- **Issue**: what's wrong
- **Fix**: suggested solution

End with a summary: total issues, breakdown by severity.
