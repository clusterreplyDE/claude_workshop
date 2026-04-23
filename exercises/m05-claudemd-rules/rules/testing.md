---
description: Testing conventions and patterns
paths:
  - test/**/*.js
---

# Testing Rules

- Use Node.js built-in test runner (`node --test`)
- Each test file mirrors a source file: `src/utils.js` → `test/utils.test.js`
- Test names describe behavior: `"should return empty array for invalid input"`
- Test edge cases: null, undefined, empty string, boundary values
- Run tests before committing: `npm test`
