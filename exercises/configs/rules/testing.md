---
paths:
  - "test/**/*.js"
  - "**/*.test.js"
---

# Testing Rules

- Use Node.js built-in test runner (`node:test` and `node:assert/strict`)
- Group related tests with `describe()` blocks
- Test names should start with "should" and describe expected behavior
- Always test edge cases: null input, empty arrays, boundary values
- Run all tests with `npm test` before committing
