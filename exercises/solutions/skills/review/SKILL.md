---
name: review
description: Review code for bugs, security issues, and best practice violations. Use when asked to review, audit, or check code quality.
allowed-tools: Read Grep Glob
context: fork
agent: Explore
argument-hint: [file or directory to review]
---

# Code Review Skill

Review the code at `$ARGUMENTS` (or the entire `src/` directory if no argument given).

## Review Checklist

### 1. Security Issues (Critical)
- Hardcoded credentials, API keys, or secrets in source code
- Missing input validation or sanitization
- SQL injection or command injection risks
- Sensitive data in logs or error messages

### 2. Logic Bugs (Critical/Warning)
- Off-by-one errors in loops and range checks
- Division by zero or NaN propagation
- Null/undefined handling gaps
- Race conditions in async code
- Edge cases: empty arrays, missing properties, boundary values

### 3. HTTP & API Best Practices (Warning)
- Correct status codes (201 for creation, 204 for deletion)
- Consistent response format (`{ data }` / `{ error }`)
- Input validation before data mutation
- Proper error handling and messaging

### 4. Code Quality (Info)
- Function length (>30 lines = extract)
- Code duplication
- Missing JSDoc documentation
- Unused variables or imports
- Inconsistent naming conventions

## Output Format

For each issue found:

| Field | Value |
|-------|-------|
| **File** | path/to/file.js:line |
| **Severity** | Critical / Warning / Info |
| **Category** | Security / Logic / API / Quality |
| **Description** | What the issue is |
| **Fix** | Suggested resolution |

End with a summary table: issues by severity, overall assessment (Pass / Needs Work / Fail).
