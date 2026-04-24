---
description: JavaScript code style conventions
---

# Code Style Rules

- Use `const` by default, `let` only when reassignment is needed, never `var`
- Arrow functions for callbacks: `arr.map(x => x.id)`
- Template literals for string concatenation: `` `Hello ${name}` ``
- Destructure objects and arrays where it improves readability
- Early returns to avoid deep nesting
