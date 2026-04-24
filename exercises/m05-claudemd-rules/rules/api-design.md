---
description: REST API design conventions
paths:
  - src/api.js
  - src/index.js
---

# API Design Rules

- Use plural nouns for resources: `/api/vehicles`, not `/api/vehicle`
- Correct HTTP verbs: GET (read), POST (create), PUT (update), DELETE (remove)
- Status codes: 200 (OK), 201 (Created), 400 (Bad Request), 404 (Not Found), 500 (Server Error)
- All responses follow: `{ data, error }` format
- Validate input before any data mutation
- Never expose internal error details to the client
