# Exercises — Claude Code Deep Dive Workshop

This folder contains hands-on materials for the workshop, organized by module.

## Structure

```
exercises/
├── README.md                              ← You are here
│
├─�� sample-project/                        # Shared project for all exercises (M03–M15)
│   ├── src/                               # Node.js Vehicle API with 6 intentional bugs
│   ├── test/                              # 17 tests (6 failing)
│   ├── package.json
│   └── bug-fixes.md                       # Trainer reference: all bugs documented
│
├── m05-claudemd-rules/                    # Module 5: CLAUDE.md & Rules
│   ├── CLAUDE.md.example                  #   Starter CLAUDE.md template
│   └── rules/                             #   Example .claude/rules/ files
│       ├── code-style.md                  #     (no paths — always loaded)
│       ├── testing.md                     #     (paths: test/**/*.js)
│       └── api-design.md                  #     (paths: src/api.js, src/index.js)
│
├── m06-skills-commands/                   # Module 6: Skills & Commands
│   ├── SKILL-FORMAT-REFERENCE.md          #   All SKILL.md frontmatter fields
│   ├── commands/                          #   Example .claude/commands/ files
│   │   ├── review.md                      #     → /review
│   │   └── fix-issue.md                   #     → /fix-issue (uses $ARGUMENTS)
│   └── skills/                            #   Example .claude/skills/ structure
│       └── code-review/SKILL.md           #     Full skill with frontmatter
│
├── m07-subagents/                         # Module 7: Subagents
│   └── agents/                            #   Example .claude/agents/ file
│       └── code-reviewer.md               #     Read-only reviewer agent
│
├── m08-mcp/                               # Module 8: MCP
│   └── mcp.json                           #   Example .mcp.json (filesystem + GitHub)
│
├── m09-hooks/                             # Module 9: Hooks
│   ├── settings.json                      #   Example .claude/settings.json with hooks
│   └── scripts/                           #   Hook scripts
│       └── validate-bash.sh               #     PreToolUse: block dangerous commands
│
└── m10-cicd/                              # Module 10: CI/CD
    └── .github/workflows/
        └── claude-review.yml              #   GitHub Action for PR review
```

## How to Use

### Sample Project (M03–M15)

The sample project is the shared working environment throughout the workshop:

```bash
cd exercises/sample-project
npm install
npm test          # 11 pass, 6 fail — the bugs are intentional
```

### Module Exercise Files (M05–M10)

Each module folder contains reference files in the correct directory structure. Participants can copy them into the sample project:

```bash
# Example: copy rules into sample-project
cp -r exercises/m05-claudemd-rules/rules/ exercises/sample-project/.claude/rules/

# Example: copy a skill
cp -r exercises/m06-skills-commands/skills/ exercises/sample-project/.claude/skills/
```

### Tips

- All step-by-step instructions are in the **module markdown files** (`modules/m01-...` through `modules/m15-...`)
- The exercise files here are ready-to-use references in the correct folder structure
- `bug-fixes.md` is trainer-only — don't share with participants before the M04 exercise
