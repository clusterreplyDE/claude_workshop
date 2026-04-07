# Exercises — Claude Code Deep Dive Workshop

This folder contains all hands-on materials for the workshop exercises.

## Structure

```
exercises/
├── README.md              ← You are here
├── sample-project/        # Sample Node.js project with intentional issues
│   ├── package.json
│   ├── src/
│   │   ├── index.js       # Entry point (has bugs)
│   │   ├── api.js         # API handlers (has bugs)
│   │   ├── utils.js       # Utility functions (has bugs)
│   │   └── config.js      # Configuration (has issues)
│   ├── test/
│   │   └── utils.test.js  # Tests (some failing)
│   └── README.md          # Project description
│
├── configs/               # Starter configs for Modules 4-9
│   ├── CLAUDE.md.example           # M4: Example CLAUDE.md
│   ├── rules/                      # M4: Example .claude/rules/
│   │   ├── code-style.md
│   │   └── testing.md
│   ├── skills/                     # M5: Example skills
│   │   └── review/SKILL.md
│   ├── commands/                   # M5: Example commands
│   │   └── fix-issue.md
│   ├── agents/                     # M6: Example subagents
│   │   └── reviewer.md
│   ├── mcp-setup.sh               # M7: MCP setup script
│   ├── hooks-example.json          # M8: Example hook config
│   └── github-action.yml           # M9: CI/CD template
│
└── solutions/             # Reference solutions
    ├── CLAUDE.md                   # M4: Complete CLAUDE.md
    ├── rules/                      # M4: Complete rules
    ├── skills/                     # M5: Complete skills
    ├── agents/                     # M6: Complete agents
    ├── hooks.json                  # M8: Complete hooks config
    ├── github-action.yml           # M9: Complete GitHub Action
    └── capstone-structure.md       # M14: Expected final structure
```

## How to Use

### Module 3 — Interactive Session (Bug Hunting)

```bash
cd exercises/sample-project
npm install
claude
# Ask Claude to find and fix bugs, run tests, commit
```

### Modules 4-9 — Configuration Exercises

1. Copy configs from `configs/` to your project's `.claude/` directory
2. Modify them according to the exercise instructions in each module
3. Compare your results with the `solutions/` folder

### Module 14 — Capstone

Use the `configs/` as starter templates and build a complete Claude Code setup.
Compare against `solutions/capstone-structure.md` for the expected outcome.
