# Module 5 — CLAUDE.md & Rules (20 min)

> *Teaching Claude how YOUR project works*



## Contents

- [Learning Objectives](#learning-objectives)
- [1. What Is CLAUDE.md?](#1-what-is-claudemd)
- [2. The Three-Level Hierarchy](#2-the-three-level-hierarchy)
- [3. What to Include in CLAUDE.md](#3-what-to-include-in-claudemd)
- [4. Creating a CLAUDE.md](#4-creating-a-claudemd)
- [5. The .claude/rules/ Directory](#5-the-clauderules-directory)
- [6. When to Use Each Approach](#6-when-to-use-each-approach)
- [Hands-On Exercise (5 min)](#hands-on-exercise-5-min)
- [Summary](#summary)


## Learning Objectives

By the end of this module, participants will be able to:

- Understand how CLAUDE.md persists project knowledge across sessions
- Use the three-level hierarchy (user, project, directory) effectively
- Know what to include (and what NOT to include) in CLAUDE.md
- Generate a CLAUDE.md with `/init`
- Organize rules into `.claude/rules/` for conditional loading

---

## 1. What Is CLAUDE.md?

CLAUDE.md is a **project memory file** that teaches Claude your conventions, code style, testing practices, and architecture decisions. It persists across all sessions in that project.

### Why It Matters

Without CLAUDE.md, Claude starts fresh each session — asking the same questions, not knowing your testing framework, and making style choices that don't match your codebase.

**With CLAUDE.md**, Claude remembers your stack, conventions, and processes. It writes code that matches your style immediately and works faster because context is pre-loaded.

---

## 2. The Three-Level Hierarchy

CLAUDE.md files exist at multiple levels. All are loaded and concatenated when Claude runs.

| Level | Location | Scope | Example |
|-------|----------|-------|---------|
| **User** | `~/.claude/CLAUDE.md` | All projects you work on | General workflow preferences, common tools |
| **Project** | `./CLAUDE.md` or `./.claude/CLAUDE.md` | One specific project | Stack, testing framework, deployment process |
| **Directory** | `./src/CLAUDE.md` | Specific folders within a project | API conventions, module-specific rules |
| **Local** | `./CLAUDE.local.md` | Ignored by Git (add to .gitignore) | Private env vars, tokens, local setup |
| **Managed** | System-level (enterprise) | Company-wide standards | Enterprise policies, compliance rules |

When you run Claude in a project, it loads user-level first, then project-level, then ancestor directories. When Claude works in a subfolder (e.g. `/src`), it also loads `./src/CLAUDE.md` on-demand. All applicable files are merged into context.

You can also reference external files with the `@` syntax (as covered in Module 3): `See @docs/api-design.md` keeps CLAUDE.md focused while linking to detailed docs.

---

## 3. What to Include in CLAUDE.md

### DO Include

| Topic | Example |
|-------|---------|
| **Bash commands Claude can't guess** | "Run tests with `npm test`, not `jest` directly" |
| **Code style rules** | "Use 2 spaces (not tabs). Imports in alphabetical order." |
| **Testing instructions** | "Tests in `/tests/unit`, run with `npm test`. Minimum 80% coverage." |
| **Naming conventions** | "Avoid abbreviations except `msg`, `ctx`. Use `camelCase` for functions." |
| **Project structure** | "Services in `/src/services/`, models in `/src/models/`" |
| **Architecture decisions** | "We use repository pattern. Data access only via services." |
| **Environment setup** | "Requires Node 18+. Postgres 13+. Set `.env` from `.env.example`." |
| **Deployment process** | "Deploy via `terraform apply`. Merge to main triggers production." |
| **Common gotchas** | "Our JWT library doesn't validate expiry automatically." |

### DON'T Include

| Topic | Why Not |
|-------|---------|
| **What Claude can figure out from code** | Wastes tokens. Claude reads code anyway. |
| **Standard conventions** | "Use camelCase in JS" — everyone knows this. |
| **Long API documentation** | Use `@README.md` references instead. |
| **Frequently changing info** | Stale info is worse than no info. |
| **Private data** | Use `.claude/CLAUDE.local.md` (gitignored). |

### Size Target

Aim for **under 200 lines**. A focused CLAUDE.md is better than a bloated one.

---

## 4. Creating a CLAUDE.md

The fastest way is to let Claude generate one:

```bash
claude /init
# Claude scans your code, suggests conventions, creates draft CLAUDE.md
```

Claude analyzes your codebase, detects your stack, infers style patterns, and generates a draft. Review it, add deployment instructions or gotchas it missed, and commit.

You can also create one manually (`touch CLAUDE.md`) and fill it in — the format is just regular Markdown with your conventions, testing instructions, and architecture notes.

---

## 5. The `.claude/rules/` Directory

For larger projects, organize rules by topic. Each rule file can target specific file patterns using YAML frontmatter.

### Structure

```
.claude/
├── rules/
│   ├── code-style.md          (Always loaded)
│   ├── api-design.md          (Loaded for src/api/**)
│   ├── testing.md             (Loaded for tests/**)
│   └── security.md            (Always loaded)
└── skills/                    (Covered in Module 6)
```

### Frontmatter for Conditional Loading

```markdown
---
paths:
  - src/api/**/*.ts
  - src/api/**/*.test.ts
---

# API Design Rules
- Use plural nouns: `/users`, `/orders`
- Use HTTP verbs correctly: GET, POST, PUT, DELETE
- All responses must return `{ status, data, error }` format
```

Key frontmatter fields: `paths` (glob patterns — only load when working with matching files), `disabled` (disable without deleting), and `priority` (load order). Rules without `paths` are loaded unconditionally.

Rules also support user-level placement at `~/.claude/rules/` for standards you want across all projects.

---

## 6. When to Use Each Approach

| Situation | Use |
|-----------|-----|
| General project conventions | `./CLAUDE.md` (project root) |
| File-specific rules (API, tests, infra) | `.claude/rules/` with `paths` |
| Rules across ALL your projects | `~/.claude/rules/` |
| Per-developer secrets | `.claude/CLAUDE.local.md` (gitignored) |
| Reusable workflows & automation | Skills (Module 6) |

---

## Hands-On Exercise (5 min)

### Generate and Customize a CLAUDE.md

> **Exercise files:** `exercises/m05-claudemd-rules/` — starter CLAUDE.md template and example rule files with YAML frontmatter.

**Step 1: Auto-Generate**

```bash
cd exercises/sample-project
claude /init
# Review the generated CLAUDE.md
cat CLAUDE.md
```

**Step 2: Customize**

Add anything `/init` missed — deployment instructions, common gotchas, or team conventions.

**Step 3: Verify It Works**

```bash
claude "What's this project about?"
# Claude should reference conventions from CLAUDE.md

claude "Create a new endpoint for listing users"
# Claude should follow code style from CLAUDE.md
```

### Expected Outcome

- CLAUDE.md generated and customized
- Future sessions automatically load these rules
- Claude writes code matching your conventions immediately

---

## Summary

| Concept | Takeaway |
|---------|----------|
| **CLAUDE.md** | Project memory that persists across sessions |
| **Three levels** | User, project, directory — all loaded and concatenated |
| **What to include** | Conventions Claude can't infer: style, testing, deployment |
| **What not to** | Standard conventions, API docs, private data |
| **`/init`** | Auto-generates a draft CLAUDE.md from your codebase |
| **`.claude/rules/`** | Organize rules by topic with conditional path-based loading |
| **Size** | Keep under 200 lines. Reference external docs with `@file`. |

> **Handout:** `handout/M05-M07-customization-reference.docx` — CLAUDE.md hierarchy, best practices, skill frontmatter, string substitutions, built-in agents, and invocation patterns.

**Next step:** Module 6 covers Skills and Commands — how to turn conventions into reusable workflows, and how they compare to CLAUDE.md.

