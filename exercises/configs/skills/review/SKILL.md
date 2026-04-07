---
name: review
description: Review code for bugs, security issues, and best practice violations. Use when asked to review, audit, or check code quality.
allowed-tools: Read Grep Glob
context: fork
agent: Explore
---

# Code Review Skill

Review the specified code for the following categories:

## 1. Security Issues
- Hardcoded credentials or secrets
- Missing input validation or sanitization
- Unsafe data handling

## 2. Logic Bugs
- Off-by-one errors
- Division by zero
- Null/undefined handling
- Edge cases not covered

## 3. Best Practices
- Correct HTTP status codes (201 for creation, etc.)
- Error handling completeness
- Function purity and testability
- Code duplication

## 4. Output Format

For each issue found, report:
- **File**: path to the file
- **Line**: approximate line number
- **Severity**: Critical / Warning / Info
- **Description**: what the issue is
- **Fix**: suggested resolution

Provide a summary count at the end.
