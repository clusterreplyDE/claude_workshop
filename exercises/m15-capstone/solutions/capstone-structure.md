# Capstone — Expected Project Structure

After completing the Module 14 capstone exercise, your project should look like this:

```
my-project/
├── CLAUDE.md                          # ✅ Task 1: Project memory
├── .claude/
│   ├── rules/                         # ✅ Task 1: Path-specific rules
│   │   ├── code-style.md             #   paths: ["src/**/*.js"]
│   │   ├── testing.md                #   paths: ["test/**/*.js"]
│   │   └── api-design.md            #   paths: ["src/api.js"]
│   │
│   ├── skills/                        # ✅ Task 2: Custom skill
│   │   └── review/
│   │       └── SKILL.md              #   context: fork, allowed-tools, etc.
│   │
│   ├── agents/                        # ✅ Task 3: Subagent
│   │   └── reviewer.md              #   tools: Read, Grep, Glob
│   │
│   └── settings.json                  # ✅ Task 5: Hook configuration
│       # Contains hooks for:
│       # - PostToolUse: auto-format with prettier
│       # - PreToolUse: block dangerous commands
│       # - SessionStart: inject date + branch
│
├── .mcp.json                          # ✅ Task 4: MCP server (project-scoped)
│   # Contains:
│   # - github MCP server
│   # - (optional) filesystem MCP server
│
├── .github/
│   └── workflows/
│       └── claude-review.yml          # ✅ Task 6: CI/CD integration
│           # Claude PR review on pull_request events
│
├── src/                               # Application code
│   ├── index.js
│   ├── api.js
│   ├── utils.js
│   └── config.js
│
├── test/                              # Tests
│   └── utils.test.js
│
├── package.json
└── README.md
```

## Evaluation Checklist

### ✅ Task 1 — CLAUDE.md + Rules
- [ ] CLAUDE.md exists in project root with build commands, code style, architecture
- [ ] At least 2 rule files in .claude/rules/ with path-based filtering
- [ ] Rules use YAML frontmatter with `paths` field
- [ ] CLAUDE.md is under 200 lines and actionable (not a tutorial)

### ✅ Task 2 — Custom Skill
- [ ] SKILL.md exists in .claude/skills/<name>/
- [ ] Has proper frontmatter: name, description, allowed-tools
- [ ] Uses context: fork for isolated execution
- [ ] Includes clear instructions for Claude in the markdown body
- [ ] Can be invoked with /<name> command

### ✅ Task 3 — Subagent
- [ ] Agent definition in .claude/agents/<name>.md
- [ ] Has frontmatter: name, description, tools, model
- [ ] Tools are restricted (read-only for reviewers)
- [ ] Clear role description in markdown body
- [ ] Can be invoked with @"name (agent)" or natural language

### ✅ Task 4 — MCP Server
- [ ] At least one MCP server configured
- [ ] Server is functional (/mcp shows green status)
- [ ] Project-scoped config in .mcp.json (for GitHub MCP)
- [ ] Claude can use the MCP tools (e.g., list issues, read files)

### ✅ Task 5 — Hook
- [ ] At least one hook configured in .claude/settings.json
- [ ] PostToolUse hook for auto-formatting (prettier or similar)
- [ ] PreToolUse hook for blocking dangerous commands (optional bonus)
- [ ] Hook actually runs when triggered (test by editing a file)

### ✅ Task 6 — CI/CD Sketch
- [ ] GitHub Action YAML at .github/workflows/claude-review.yml
- [ ] Triggers on pull_request events
- [ ] Uses claude -p for non-interactive mode
- [ ] Includes --max-budget-usd for cost control
- [ ] Uses ANTHROPIC_API_KEY from GitHub secrets

## Quality Questions

Answer these about your setup:

1. **Onboarding**: If a new developer clones this repo and runs `claude`, do they get a productive experience immediately?
2. **Quality Gates**: Are there automated checks that catch issues without human intervention?
3. **External Access**: Can Claude reach the external tools your team uses daily?
4. **Knowledge Encoding**: Are your team's conventions in CLAUDE.md/rules/skills, not just in people's heads?

If yes to all four — congratulations, you have a production-ready Claude Code setup! 🎉
