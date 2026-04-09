# SKILL.md Format Reference

Every skill starts with YAML frontmatter followed by the prompt content.

## Full Example

```markdown
---
name: api-review
description: Review API endpoints for security and design patterns
user-invocable: true
disable-model-invocation: false
allowed-tools: [Read, Edit, Bash, Grep]
context: fork
model: opus
effort: medium
paths: [src/api/**/*.ts, src/routes/**/*.ts]
argument-hint: "[file-path]"
---

# API Design Review

You are an expert API architect reviewing the provided endpoints.

## Checklist
- [ ] Uses correct HTTP method (GET, POST, PUT, DELETE)
- [ ] Response format is consistent
- [ ] Error codes are appropriate
- [ ] Input validation is present
- [ ] Authentication is required (if needed)

## Review the file

$ARGUMENTS
```

## Complex Skill Example (Multi-File)

A skill can include support files like checklists, examples, and scripts:

```
.claude/skills/api-review/
├── SKILL.md              (Main skill definition)
├── checklist.md          (Referenced with ${CLAUDE_SKILL_DIR}/checklist.md)
├── examples/
│   ├── good-endpoint.ts  (Good patterns)
│   └── bad-endpoint.ts   (Anti-patterns)
└── scripts/
    └── validate-api.sh   (Runs with !`${CLAUDE_SKILL_DIR}/scripts/validate-api.sh $1`)
```

The skill content can reference these files:

```markdown
## Review Checklist
See ${CLAUDE_SKILL_DIR}/checklist.md

## Good Examples
See ${CLAUDE_SKILL_DIR}/examples/good-endpoint.ts

## Validation Script
!`${CLAUDE_SKILL_DIR}/scripts/validate-api.sh $1`
```
