# Workshop Sample API

## Project Overview

Node.js REST API for vehicle data management. Express.js backend with in-memory storage.
Used as a training project for Claude Code workshops.

## Build & Run

- Install: `npm install`
- Start: `npm start` (port 3000, configurable via PORT env var)
- Test: `npm test` (Node.js built-in test runner)
- Lint: `npx prettier --check src/ test/`
- Format: `npx prettier --write src/ test/`

## Code Style

- ES6+ features: const/let (never var), arrow functions, template literals
- Strict equality only (`===`, never `==`)
- JSDoc comments with @param and @returns for all exported functions
- Maximum function length: 30 lines
- Always validate inputs before mutation
- Use descriptive error messages in API responses

## Architecture

```
src/
├── index.js    — Express app setup, routes, middleware
├── api.js      — Route handlers (controller layer)
├── utils.js    — Pure utility functions (business logic, testable)
└── config.js   — Configuration (env vars with defaults)
```

## HTTP Conventions

- 200: Successful read/update/delete
- 201: Successful creation (POST)
- 400: Invalid input (validation errors)
- 404: Resource not found
- All routes under `/api/` prefix
- Error responses: `{ "error": "descriptive message" }`
- Success responses: `{ "data": ... }`

## Security Rules

- NEVER commit secrets, API keys, or passwords to code
- All credentials via environment variables
- Validate and sanitize all user input
- Use parameterized queries (when using real DB)

## Testing

- Use Node.js built-in test runner (`node:test`, `node:assert/strict`)
- Group with `describe()`, name tests with "should ..."
- Cover edge cases: null, empty, boundary values, error paths
- Run tests before every commit

## Git Workflow

- Branch naming: `feature/description` or `fix/description`
- Commit messages: imperative mood, max 72 chars first line
- Always run `npm test` before committing

See @README.md for API endpoint documentation.
