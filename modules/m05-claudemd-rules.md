# Module 5 — CLAUDE.md & Rules (20 min)

> *Teaching Claude how YOUR project works*

## Learning Objectives

By the end of this module, participants will be able to:

- Understand how CLAUDE.md persists project knowledge across sessions
- Create a CLAUDE.md file with conventions, testing instructions, and architecture notes
- Use the three-level hierarchy (user, project, directory) effectively
- Import external files and create reusable rules
- Organize rules into .claude/rules/ for conditional loading
- Know what to include (and what NOT to include) in CLAUDE.md

---

## 1. What Is CLAUDE.md?

CLAUDE.md is a **project memory file** that teaches Claude your conventions, code style, testing practices, and architecture decisions. It persists across all sessions in that project.

### Why It Matters

Without CLAUDE.md, Claude starts fresh each session:
- Asks the same clarifying questions
- Doesn't know your testing framework or deployment process
- Makes style choices that don't match your codebase
- Re-reads documentation you've already explained

**With CLAUDE.md:**
- Claude remembers your stack, conventions, and processes
- Can write code that matches your style immediately
- Understands your architecture and deployment pipeline
- Works faster because context is pre-loaded

---

## 2. The Three-Level Hierarchy

CLAUDE.md files exist at multiple levels. All of them are loaded and concatenated when Claude runs.

| Level | Location | Scope | Example |
|-------|----------|-------|---------|
| **User** | `~/.claude/CLAUDE.md` | All projects you work on | General workflow preferences, common tools |
| **Project** | `./CLAUDE.md` or `./.claude/CLAUDE.md` | One specific project | Stack, testing framework, deployment process |
| **Directory** | `./src/CLAUDE.md` | Specific folders within a project | API conventions, module-specific rules |
| **Local** | `./CLAUDE.local.md` | Ignored by Git (add to .gitignore) | Private env vars, tokens, local setup |
| **Managed** | System-level (enterprise) | Company-wide standards | Enterprise policies, compliance rules |

### Loading Behavior

When you run Claude in a project:

1. Load user-level: `~/.claude/CLAUDE.md`
2. Load project-level: `./CLAUDE.md`
3. Load ancestor directories: Check parent folders for additional CLAUDE.md files
4. Load on-demand: When Claude works in `/src`, it loads `./src/CLAUDE.md` automatically
5. Concatenate: All applicable files are merged into context

**Example directory structure:**

```
my-company/
├── ~/.claude/CLAUDE.md                    (User level — all projects)
├── .claude/CLAUDE.md                      (Project level — this repo)
├── src/CLAUDE.md                          (Directory level — /src rules)
├── tests/CLAUDE.md                        (Directory level — /tests rules)
└── terraform/CLAUDE.md                    (Directory level — /terraform rules)
```

When working in `src/api.ts`, Claude loads:
1. User-level rules
2. Project-level rules
3. `src/CLAUDE.md` (triggered by filepath)
4. All concatenated into context

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
| **Deployment process** | "Deploy via `terraform apply`. Always plan first. Merge to main triggers production." |
| **Repo etiquette** | "Commit messages: Imperative mood. Link issue numbers: 'Fix #123'." |
| **Common gotchas** | "Watch out: Our JWT library doesn't validate expiry automatically." |

### DON'T Include

| Topic | Why Not | Better Alternative |
|-------|---------|-------------------|
| **What Claude can figure out from code** | Wastes tokens. Claude reads code anyway. | Let Claude analyze the codebase. |
| **Standard conventions** | "Use camelCase in JS" (everyone knows this) | Only include if your project deviates. |
| **Long API documentation** | External docs exist for this reason. | Use `See @README.md for details` instead. |
| **Frequently changing info** | Stale info is worse than no info. | Keep in a README or wiki. |
| **Detailed tutorials** | 50-line explanations of a concept. | Link to external guides. |
| **Private data** | Secrets, tokens, credentials. | Use `.claude/CLAUDE.local.md` (gitignored) |

### Size Target

Aim for **under 200 lines**. A focused CLAUDE.md is better than a bloated one.

---

## 4. Creating Your First CLAUDE.md

### Manual Creation

```bash
# In your project root:
touch CLAUDE.md
```

**Example for a Node.js microservice:**

```markdown
# Project: Payment Service

## Tech Stack
- Node.js 18+
- Express 4.x
- PostgreSQL 13
- JWT for authentication
- Jest for testing

## Code Style
- Use 2 spaces for indentation
- Avoid abbreviations except: `msg`, `ctx`, `req`, `res`
- Imports in alphabetical order
- Use `const` by default, `let` only for counters/loops

## Testing
- Tests in `/tests/unit` and `/tests/integration`
- Run: `npm test`
- Minimum coverage: 80%
- Integration tests use testcontainers for real DB

## File Structure
- `/src/services` - Business logic, one file per domain
- `/src/models` - Data access layer (repository pattern)
- `/src/middleware` - Express middleware
- `/src/routes` - Route definitions
- `/tests` - All test files mirroring src structure

## Important Notes
- Always validate input with Joi schemas before processing
- JWT tokens signed with HS256. Check exp claim in middleware.
- Database migrations run automatically on startup. Never modify them after deploy.
- Deployment: Merge to `main` → GitHub Actions → Docker build → ECR push → ECS deploy

## Commit Style
- Imperative mood: "Add feature" not "Added feature"
- Link issues: "Fix #123: Add payment retry logic"
```

### Auto-Generate with `/init`

Claude Code can analyze your codebase and suggest a CLAUDE.md:

```bash
claude /init
# Claude scans your code, suggests conventions, creates draft CLAUDE.md
```

Output:

```
✓ Analyzing codebase...
✓ Found: Node.js, Express, Jest, TypeScript
✓ Inferred structure: /src/services, /tests/unit
✓ Detected style: 2 spaces, camelCase, alphabetical imports

Draft CLAUDE.md created. Review and edit:
- Confirm tech stack section ✓
- Add testing instructions ✓
- Add deployment process (missing - please add)
- Remove? Nothing seems unnecessary
```

---

## 5. Importing External Files

Keep CLAUDE.md focused by referencing external files:

### Import Syntax

```markdown
# Project Rules

See @README.md for project overview.

For API design patterns, see @docs/api-design.md.

Architecture diagram: @docs/architecture.pdf
```

### Behavior

- Relative paths: `@README.md`, `@docs/guidelines.md`, `@../../common-rules.md`
- Loaded on-demand: Only read when Claude needs that context
- Max 5 hops: Can't import from `../../../../../../../..` (security)
- Works with Markdown, code files, images, PDFs

### Example Use Cases

```markdown
# Node.js Service Template

## Code Style
See @./.github/CODE_STYLE.md

## Testing
See @./TESTING.md

## Deployment
See @./DEPLOYMENT.md

## Common Issues
See @./TROUBLESHOOTING.md
```

---

## 6. The `.claude/rules/` Directory

For larger projects, organize rules by topic. Each rule can target specific file patterns.

### Structure

```
.claude/
├── rules/
│   ├── code-style.md          (JS/TS style guidelines)
│   ├── testing.md             (Test setup and patterns)
│   ├── api-design.md          (REST API conventions)
│   ├── terraform.md           (Terraform-specific rules)
│   └── security.md            (Security checklist)
└── skills/                    (Covered in Module 6)
```

### Rule File Format

Each `.md` file in `.claude/rules/` can have YAML frontmatter:

```markdown
---
paths:
  - src/api/**/*.ts
  - src/api/**/*.test.ts
---

# API Design Rules

## Endpoint Naming
- Use plural nouns: `/users`, `/orders`, not `/user`, `/order`
- Use HTTP verbs correctly: GET, POST, PUT, DELETE
- Avoid verbs in URLs: `/users` not `/getUsers`

## Response Format
All responses must follow:
```json
{
  "status": "success|error",
  "data": { ... },
  "error": null
}
```

## Error Codes
- 400: Bad request (validation error)
- 401: Unauthorized (missing auth)
- 403: Forbidden (auth passed, but permission denied)
- 500: Server error (log and alert)
```

### Key Frontmatter Fields

| Field | Purpose | Example |
|-------|---------|---------|
| `paths` | Only load this rule when Claude works with matching files | `["src/api/**/*.ts", "tests/**/*.test.ts"]` |
| `disabled` | Disable a rule without deleting it | `true` |
| `priority` | Load order if multiple rules match | `high`, `normal`, `low` |

### Rules Without Paths

If a rule doesn't specify `paths`, it's loaded unconditionally (applies to everything):

```markdown
---
# No paths specified = always loaded
---

# General Code Rules
All code must have JSDoc comments...
```

### User-Level Rules

Create shared rules for all your projects:

```bash
mkdir -p ~/.claude/rules
```

```markdown
# ~/.claude/rules/commit-style.md

---
# No paths — applies to all projects
---

# Commit Message Style

- Imperative mood
- Capitalize first letter
- Link issue: "Fix #123: ..."
- Keep first line under 50 chars
```

---

## 7. When to Use Each Approach

| Situation | Use |
|-----------|-----|
| General project conventions | `./CLAUDE.md` (project root) |
| API-specific rules | `./.claude/rules/api-design.md` with paths |
| Testing practices | `./.claude/rules/testing.md` with paths |
| Terraform/infra rules | `./.claude/rules/terraform.md` with `paths: ["terraform/**/*.tf"]` |
| Rules used in ALL projects | `~/.claude/rules/my-company-standard.md` |
| Reusable workflows | Use Skills (Module 5) instead |
| Per-developer secrets | `./.claude/CLAUDE.local.md` (gitignored) |

---

## 8. CLAUDE.md vs. Skills vs. Commands

Don't mix them up:

| Feature | CLAUDE.md | Skills | Commands |
|---------|-----------|--------|----------|
| **Purpose** | Project conventions and memory | Reusable workflows | Simple shortcuts |
| **Example** | "Use 2 spaces, test with npm test" | `/batch` for refactoring, `/loop` for iterations | `/review` to ask for code review |
| **Auto-loaded?** | Always | Reference skills yes, action skills on-demand | On-demand |
| **Editable** | Yes, shared with team | Yes, checked into repo | Yes, checked into repo |
| **Location** | Repo root | `.claude/skills/` | `.claude/commands/` |
| **When to Use** | "Teach Claude the rules" | "Automate a complex task" | "Create a shortcut" |

---

## Hands-On Exercise (5 min)

### Create a CLAUDE.md for a Sample Project

**Option A: Manual Creation**

```bash
# Use the provided sample project:
cd /workshop-samples/sample-api
cat README.md           # Understand the project
ls -la src tests       # Explore structure

# Create CLAUDE.md:
cat > CLAUDE.md << 'EOF'
# Sample API Project

## Tech Stack
- Python 3.11
- FastAPI
- PostgreSQL
- Pytest

## Code Style
- PEP 8 compliance
- Type hints on all functions
- Docstrings for public functions

## Testing
- Tests in /tests
- Run: pytest -v
- Minimum coverage: 80%

## File Structure
- /app/main.py - Entry point
- /app/routes - API endpoints
- /app/models - Pydantic models
- /tests - Test files

## Important Notes
- Always use sqlalchemy.orm.Session for database access
- Validate input with Pydantic before processing
EOF
```

**Option B: Auto-Generate with `/init`**

```bash
claude /init
# Review the generated CLAUDE.md:
cat CLAUDE.md
# Edit as needed
```

**Step 2: Verify It Works**

```bash
# Start a new session:
claude "What's this project about?"
# Claude should reference conventions from CLAUDE.md automatically

# Try a style-specific request:
claude "Create a new endpoint for listing users"
# Claude should follow code style from CLAUDE.md
```

**Step 3: Compare Manual vs. Generated**

```bash
# If you created manually, run /init and compare:
claude /init
diff CLAUDE.md CLAUDE.md.generated

# Which approach felt better?
# - Manual: You have full control
# - Generated: Faster, but might miss details
```

### Expected Outcome

After this exercise:
- CLAUDE.md created and committed
- Future sessions automatically load these rules
- Claude writes code matching your conventions immediately
- No need to re-explain project structure each session

---

## Summary

| Concept | Takeaway |
|---------|----------|
| **CLAUDE.md** | Project memory that persists across sessions |
| **Three levels** | User, project, directory. All loaded and concatenated. |
| **What to include** | Conventions Claude can't infer: code style, testing, deployment |
| **What not to** | Standard conventions, API docs, private data |
| **`.claude/rules/`** | Organize rules by topic with conditional path-based loading |
| **Size** | Keep under 200 lines. Import external docs with `@file`. |
| **Auto-generate** | Use `/init` for a quick draft, then customize |

**Next step:** Module 6 covers Skills and Commands — how to turn CLAUDE.md insights into reusable workflows.

