# Workshop Sample API

A simple REST API for managing a list of vehicles — built for the Claude Code Deep Dive Workshop.

## Quick Start

```bash
npm install
npm start      # Starts on port 3000
npm test       # Run tests
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/vehicles | List all vehicles |
| GET | /api/vehicles/:id | Get vehicle by ID |
| POST | /api/vehicles | Add a new vehicle |
| DELETE | /api/vehicles/:id | Delete a vehicle |
| GET | /api/stats | Vehicle statistics |
| GET | /health | Health check |

## Known Issues

This project has **intentional bugs** for workshop exercises. Your task is to find and fix them using Claude Code.

**Hint:** There are at least 6 issues across the codebase. Some are logic bugs, some are security issues, and some are best-practice violations.
