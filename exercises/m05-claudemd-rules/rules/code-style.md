---
paths:
  - "src/**/*.js"
---

# Code Style Rules

- Use `const` by default, `let` only when reassignment is needed, never `var`
- Prefer arrow functions for callbacks
- Use template literals instead of string concatenation
- Always add JSDoc comments with @param and @returns for exported functions
- Maximum function length: 30 lines (extract helpers if longer)
