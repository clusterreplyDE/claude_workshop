---
paths:
  - "src/api.js"
  - "src/index.js"
---

# API Design Rules

- Use correct HTTP status codes: 201 for creation, 204 for deletion with no body
- Always validate request body before any data mutation
- Return consistent response shapes: `{ data: ... }` for success, `{ error: "..." }` for failure
- Sanitize user input: trim strings, validate types, reject unexpected fields
- Include pagination metadata in list responses
- Log errors server-side but return safe error messages to clients
