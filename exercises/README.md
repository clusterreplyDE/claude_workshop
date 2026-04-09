# Exercises — Claude Code Deep Dive Workshop

This folder contains all hands-on materials for the workshop exercises, organized by module.

## Structure

```
exercises/
├── README.md                          ← You are here
│
├── m04-interactive-extended/          # Module 4: Interactive Session (Bug Hunting)
│   ├── sample-project/                # Sample Node.js project with intentional issues
│   │   ├── package.json
│   │   ├── README.md                  # Project description
│   │   ├── src/
│   │   │   ├── index.js               # Entry point (has bugs)
│   │   │   ├── api.js                 # API handlers (has bugs)
│   │   │   ├── utils.js               # Utility functions (has bugs)
│   │   │   └── config.js              # Configuration (has issues)
│   │   └── test/
│   │       └── utils.test.js          # Tests (some failing)
│   └── solutions/
│       └── bug-fixes.md               # Reference fixes for identified bugs
│
├── m05-claudemd-rules/                # Module 5: CLAUDE.md & Rules Configuration
│   ├── CLAUDE.md.example              # Starter CLAUDE.md template
│   ├── rules/                         # Example rule files
│   │   ├── code-style.md
│   │   └── testing.md
│   └── solutions/
│       ├── CLAUDE.md                  # Complete CLAUDE.md reference
│       └── rules/                     # Complete rule solutions
│           ├── api-design.md
│           ├── code-style.md
│           └── testing.md
│
├── m06-skills-commands/               # Module 6: Skills & Commands
│   ├── skills/                        # Starter skill templates
│   │   └── review/SKILL.md
│   ├── commands/                      # Starter command templates
│   │   └── fix-issue.md
│   └── solutions/
│       └── skills/                    # Complete skill solutions
│           └── review/SKILL.md
│
├── m07-subagents/                     # Module 7: Subagents & Orchestration
│   ├── agents/                        # Starter agent templates
│   │   └── reviewer.md
│   └── solutions/
│       └── agents/                    # Complete agent solutions
│           └── reviewer.md
│
├── m08-mcp/                           # Module 8: Model Context Protocol (MCP)
│   └── mcp-setup.sh                   # MCP setup script example
│
├── m09-hooks/                         # Module 9: Git Hooks & Pre-commit
│   ├── hooks-example.json             # Starter hooks configuration
│   └── solutions/
│       └── hooks.json                 # Complete hooks solution
│
├── m10-cicd/                          # Module 10: CI/CD Integration
│   ├── github-action.yml              # Starter GitHub Actions workflow
│   └── solutions/
│       └── github-action.yml          # Complete GitHub Actions solution
│
└── m15-capstone/                      # Module 15: Capstone Project
    └── solutions/
        └── capstone-structure.md      # Expected final directory structure
```

## How to Use

### Module 4 — Interactive Session (Bug Hunting)

Start with the bug-hunting exercise:

```bash
cd exercises/m04-interactive-extended/sample-project
npm install
claude
# Ask Claude to find and fix bugs, run tests, commit
```

Compare your work with the reference solutions:
```bash
# See the solutions in:
cat exercises/m04-interactive-extended/solutions/bug-fixes.md
```

### Modules 5-10 — Configuration Exercises

For each module (M5 through M10):

1. Navigate to the module folder (e.g., `m05-claudemd-rules/`)
2. Use the starter files as templates (e.g., `CLAUDE.md.example`, `rules/`, etc.)
3. Modify them according to the exercise instructions
4. Compare your results with the `solutions/` subfolder

Example for Module 5:
```bash
cd exercises/m05-claudemd-rules
# Work with CLAUDE.md.example and rules/ files
# Then compare with solutions/CLAUDE.md and solutions/rules/
```

### Module 15 — Capstone Project

Use all previous modules to build a complete Claude Code setup:

1. Review each module's solutions folder for reference implementations
2. Build your own integrated configuration combining concepts from M5-M10
3. Validate against the expected structure:
   ```bash
   cat exercises/m15-capstone/solutions/capstone-structure.md
   ```

## Tips

- **Starter files**: Look in each module's root directory for example/template files
- **Solutions**: Compare your work with the `solutions/` subfolder in each module
- **Progression**: Work through modules sequentially (M4 → M5 → ... → M15)
- **Integration**: Each module builds on previous ones, creating a comprehensive Claude Code workflow
