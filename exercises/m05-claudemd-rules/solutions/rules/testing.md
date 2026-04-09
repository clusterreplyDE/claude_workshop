---
paths:
  - "test/**/*.js"
  - "**/*.test.js"
---

# Testing Rules

- Use Node.js built-in test runner (`node:test` and `node:assert/strict`)
- Group related tests with `describe()` blocks matching the function/module name
- Test names should start with "should" and describe expected behavior
- Always test edge cases: null input, empty arrays, boundary values
- Test both success and failure paths
- Avoid test interdependence — each test should be self-contained
- Run all tests with `npm test` before committing
- Aim for at least one test per exported function
