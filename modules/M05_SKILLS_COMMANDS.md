# Module 5 — Skills & Commands (30 min)

> *Reusable workflows and knowledge*

## Learning Objectives

By the end of this module, participants will be able to:

- Understand the difference between skills and commands
- Create reference skills (knowledge that loads automatically) and action skills (workflows you invoke)
- Use YAML frontmatter to configure skill behavior
- Build a skill with templates, examples, and helper scripts
- Create simple slash commands for quick shortcuts
- Organize skills hierarchically (enterprise, personal, project)
- Know when to use skills vs. commands vs. CLAUDE.md

---

## 1. What Are Skills?

Skills are **reusable knowledge and workflows** stored in your project or globally. They're more powerful than CLAUDE.md because they can include:

- **Reference skills**: Knowledge files that load automatically
- **Action skills**: Workflows you invoke with `/skillname`
- **Templates**: Code stubs and examples
- **Scripts**: Helper utilities (bash, Python, etc.)
- **String substitutions**: Dynamic variable injection (`$ARGUMENTS`, `${CLAUDE_SESSION_ID}`, etc.)

Skills can be:
- **Project-level**: `.claude/skills/<name>/SKILL.md` (shared with team)
- **Personal**: `~/.claude/skills/<name>/SKILL.md` (just you)
- **Enterprise**: System-managed (from your organization)

---

## 2. Skill Location & Structure

### Directory Layout

```
.claude/skills/
├── api-review/
│   ├── SKILL.md              (Main skill definition)
│   ├── checklist.md          (Reference doc)
│   ├── examples/
│   │   ├── good-endpoint.ts  (Example code)
│   │   └── bad-endpoint.ts
│   └── scripts/
│       └── validate-api.sh
├── refactor/
│   └── SKILL.md
└── batch-fix/
    └── SKILL.md
```

### SKILL.md Format

Every skill starts with YAML frontmatter:

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
---

# API Design Review

You are an expert API architect reviewing the provided endpoints.

## Checklist
- [ ] Uses correct HTTP method (GET, POST, PUT, DELETE)
- [ ] Response format is consistent
- [ ] Error codes are appropriate
- [ ] Input validation is present
- [ ] Authentication is required (if needed)

[Rest of skill content...]
```

---

## 3. Frontmatter Fields Reference

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `name` | string | Required | Slug for `/skillname`. Must be lowercase, no spaces. |
| `description` | string | Required | One-line summary shown in `/help` |
| `user-invocable` | bool | true | Can this skill be called with `/skillname`? |
| `disable-model-invocation` | bool | false | If true, Claude never calls this automatically. Invoke only with `/skillname`. |
| `allowed-tools` | list | all | Which tools can this skill use? [Read, Edit, Write, Bash, Grep, Glob, WebFetch, WebSearch, Agent] |
| `context` | string | inherit | `fork`: Run in isolated subagent. `inherit`: Inherit parent session context. |
| `model` | string | (inherit) | Force a specific model: `opus`, `sonnet`, `haiku` |
| `effort` | string | normal | Hint for how complex this is: `quick`, `normal`, `deep`, `research` |
| `paths` | list | (none) | Only load when Claude works with matching files. Glob patterns: `["src/**/*.ts", "tests/**/*.test.ts"]` |
| `hooks` | object | (none) | Triggers: `on-save`, `on-test`, `pre-commit`, `post-deploy` |
| `shell` | string | bash | Shell to use for inline commands: `bash`, `sh`, `pwsh` |
| `argument-hint` | string | (none) | How to call it: `"[issue-number]"`, `"[branch-name] [description]"` |
| `agent` | bool | false | Run as a full agentic workflow (can spawn subagents) |

---

## 4. Two Types of Skills

### Type 1: Reference Skills (Knowledge)

Loaded automatically. Never invoked by `/command`.

**Use case:** Style guides, architecture patterns, checklists.

```markdown
---
name: testing-patterns
description: Common testing patterns used in this project
user-invocable: false
disable-model-invocation: true
---

# Testing Patterns

## Unit Test Template
Every test file should follow this structure:

```typescript
import { describe, it, expect, beforeEach } from 'jest';
import { MyService } from './my-service';

describe('MyService', () => {
  let service: MyService;

  beforeEach(() => {
    service = new MyService();
  });

  it('should do something specific', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## Mocking Pattern
Use Jest mocks for external dependencies:

```typescript
jest.mock('../external-api');
```

[Rest of patterns...]
```

**When this loads:**
- User starts a session in the project
- Claude automatically reads this skill
- When writing tests, Claude follows these patterns

### Type 2: Action Skills (Workflows)

Invoked with `/skillname`. Can be complex, multi-step workflows.

**Use case:** Refactoring, code review, batch fixes, deployment checklists.

```markdown
---
name: refactor-to-async
description: Convert callback-based code to async/await
user-invocable: true
argument-hint: "[file-path]"
context: fork
model: opus
---

# Refactor to Async/Await

You are a refactoring expert. Your task is to convert the provided code from callbacks to async/await.

## Steps
1. Read the original file
2. Identify all callback patterns
3. Convert to async/await
4. Ensure error handling is preserved
5. Run tests to verify

## Important
- Never change function signatures unless necessary
- Preserve error messages
- Keep comments explaining complex logic

---

# File to Refactor

{{ $ARGUMENTS }}
```

**Usage:**

```bash
claude> /refactor-to-async src/lib/db.js
# Skill runs in isolated context, focuses on that file
```

---

## 5. String Substitutions

Inject dynamic values into your skill content:

| Variable | Value | Example |
|----------|-------|---------|
| `$ARGUMENTS` | Everything after `/skillname` | `/refactor-to-async src/lib.js` → `src/lib.js` |
| `$0` | The skill name | `$0` → `refactor-to-async` |
| `$1`, `$2`, etc. | Positional arguments | `/fix-issue 123 urgent` → `$1`=`123`, `$2`=`urgent` |
| `${CLAUDE_SESSION_ID}` | Current session ID | Use in script filenames for uniqueness |
| `${CLAUDE_SKILL_DIR}` | Directory containing skill | Reference template files relative to skill |

### Example: Skill with Arguments

```markdown
---
name: fix-issue
description: Fix a GitHub issue
argument-hint: "[issue-number]"
user-invocable: true
---

# Fix GitHub Issue #$1

Your task is to fix GitHub issue #$1.

## Steps
1. Find the issue in the repo (search for "$1")
2. Understand the root cause
3. Write a fix
4. Create a commit

You are fixing issue: $1
Full arguments: $ARGUMENTS
Session ID: ${CLAUDE_SESSION_ID}
```

**Usage:**

```bash
claude> /fix-issue 42
# $1 = "42"
# $ARGUMENTS = "42"

claude> /fix-issue 42 urgent security
# $1 = "42", $2 = "urgent", $3 = "security"
# $ARGUMENTS = "42 urgent security"
```

---

## 6. Dynamic Context Injection

Run shell commands before skill content loads:

```markdown
---
name: deploy-status
description: Check deployment status
user-invocable: true
---

# Deployment Status

Here's the current status:

!`kubectl get deployment -o wide`

!`docker ps -a | grep vdpm`

Based on the above, let me check for any errors...
```

**The `!`` syntax:**
- Backticks with exclamation: Execute shell command
- Results injected before Claude sees the skill
- Works offline: Runs before API call

---

## 7. Building a Complex Skill

Here's a real-world example: A skill to review API endpoints.

```markdown
---
name: api-review
description: Review API endpoints for security and design patterns
user-invocable: true
context: fork
model: opus
paths: [src/api/**/*.ts, src/routes/**/*.ts]
allowed-tools: [Read, Bash, Grep]
argument-hint: "[file-path]"
---

# Comprehensive API Review

You are reviewing the API endpoint(s) in: $ARGUMENTS

## Review Checklist

See ${CLAUDE_SKILL_DIR}/checklist.md for detailed checklist.

## Good Examples

See ${CLAUDE_SKILL_DIR}/examples/good-endpoint.ts

## Bad Examples (Anti-patterns)

See ${CLAUDE_SKILL_DIR}/examples/bad-endpoint.ts

## Validation Script

Run the validation:

!`${CLAUDE_SKILL_DIR}/scripts/validate-api.sh $1`

## Your Task

1. Read the file(s)
2. Check against the checklist
3. Run validation
4. Provide detailed feedback
5. Suggest fixes if needed

Format your response as:
- Summary (1-2 sentences)
- Issues Found (numbered list)
- Code Examples (show bad → good)
- Risk Level (Low/Medium/High)
```

**Support files:**

`.claude/skills/api-review/checklist.md`:
```markdown
# API Review Checklist

## HTTP Methods
- [ ] GET for retrieval
- [ ] POST for creation
- [ ] PUT for full updates
- [ ] PATCH for partial updates
- [ ] DELETE for removal

## Security
- [ ] Authentication required (if needed)
- [ ] Input validation present
- [ ] SQL injection prevention
- [ ] Rate limiting
- [ ] CORS properly configured
```

`.claude/skills/api-review/examples/good-endpoint.ts`:
```typescript
// Good: Proper validation, error handling, auth
app.post('/users', authenticate, async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Creation failed' });
  }
});
```

---

## 8. Bundled Skills

Claude Code comes with built-in skills. Use them as templates:

| Skill | Purpose | Usage |
|-------|---------|-------|
| `/batch` | Refactor large codebases in parallel chunks | `/batch "Convert all var to const"` |
| `/claude-api` | Call Claude API from bash | `!`claude-api "prompt"`
| `/debug` | Troubleshoot errors with deep analysis | `/debug npm run build` |
| `/loop` | Run a task repeatedly until converged | `/loop "Run tests until all pass"` |
| `/simplify` | Refactor code for readability | `/simplify src/complex.js` |
| `/plan` | Show a multi-step plan before executing | `/plan "Migrate database schema"` |

**Example: Using `/batch` to refactor multiple files**

```bash
claude> /batch "Convert all Promise-based code to async/await"
# Claude finds all .js files, creates a plan, then refactors in parallel
```

---

## 9. Commands (Simple Alternative)

For lightweight shortcuts, use **commands** instead of skills.

### Command Structure

Location: `.claude/commands/` or `~/.claude/commands/`

```bash
.claude/commands/
├── review.md
├── test-coverage.md
└── deploy-check.md
```

**File format:** Just Markdown with optional YAML frontmatter.

```markdown
---
description: Review code for best practices
---

# Code Review

You are a senior engineer reviewing the provided code.

## Checklist
- Readability and naming
- Performance implications
- Security issues
- Test coverage
- Documentation completeness

Provide specific feedback with examples.
```

**Usage:**

```bash
claude> /review
# Or with arguments:
claude> /review @src/api.ts
```

### Commands vs. Skills

| Feature | Command | Skill |
|---------|---------|-------|
| File location | `.claude/commands/name.md` | `.claude/skills/name/SKILL.md` |
| Complexity | Simple prompts | Complex workflows |
| With templates? | No | Yes (can have /examples, /scripts) |
| Arguments | Basic `$ARGUMENTS` | Full `$0`, `$1`, `${CLAUDE_*}` |
| Fork context? | No | Yes (with `context: fork`) |
| Models/tools? | No | Yes (can specify in frontmatter) |
| When to use | Quick shortcuts | Repeatable automation |

---

## 10. Skill Priority & Loading

When you have skills at multiple levels, there's a priority order:

```
Enterprise skills (highest priority)
  ↓
Personal ~/.claude/skills/
  ↓
Project .claude/skills/
  ↓
Plugin skills (lowest priority)
```

**If multiple skills have the same name:**
- Enterprise version wins
- If not found, personal version wins
- If not found, project version wins
- If not found, plugin version wins

---

## 11. Permissions & Security

Control what each skill can do:

```markdown
---
name: dangerous-deploy
description: Production deployment
allowed-tools: [Read, Bash, WebFetch]
---
```

This skill can:
- Read files
- Run bash commands
- Fetch web pages

This skill CANNOT:
- Edit files
- Modify code
- Delete anything

User can grant additional permissions:

```bash
/permissions Skill(dangerous-deploy *)
# Now it can use ALL tools
```

---

> 🏢 **Reply Context:** For BMW VDPM projects:
>
> **Example skills to create:**
>
> **1. Helm validation skill** (`.claude/skills/helm-validate/SKILL.md`)
> ```markdown
> ---
> name: helm-validate
> description: Validate Helm charts and values
> paths: [helm/**/*.yaml, helm/**/*.yml]
> user-invocable: true
> allowed-tools: [Read, Bash]
> ---
>
> # Helm Validation
>
> Validate the Helm chart: $ARGUMENTS
>
> !`helm lint $1`
> !`helm template vdpm $1 -f values.yaml`
>
> Check for:
> - Missing required values
> - Invalid YAML
> - Security issues (exposed secrets)
> - ArgoCD compatibility
> ```
>
> **2. Kubernetes deployment review skill**
> ```markdown
> ---
> name: k8s-review
> description: Review K8s manifests for AKS best practices
> paths: [manifests/**/*.yaml]
> user-invocable: true
> ---
>
> Review for:
> - Resource limits and requests
> - Security policies
> - Readiness/liveness probes
> - Network policies
> ```

---

## Hands-On Exercise (10 min)

### Create a Custom Slash Command

**Step 1: Create a Simple Command**

```bash
# Create commands directory
mkdir -p .claude/commands

# Create a code review command
cat > .claude/commands/review.md << 'EOF'
---
description: Review provided code for best practices
---

# Code Review

You are reviewing code for:
- Readability
- Performance
- Security
- Test coverage
- Maintainability

Provide specific feedback with examples.
EOF
```

**Step 2: Use the Command**

```bash
claude
# Then in session:
/review @src/main.js

# Or directly:
claude> /review @src/main.js
```

### Build a Full Skill with Templates

**Step 3: Create a Multi-File Skill**

```bash
# Create skill directory
mkdir -p .claude/skills/refactor-class/{examples,scripts}

# Main skill file
cat > .claude/skills/refactor-class/SKILL.md << 'EOF'
---
name: refactor-class
description: Refactor a class to use modern patterns
user-invocable: true
context: fork
model: opus
argument-hint: "[file-path]"
allowed-tools: [Read, Edit, Bash]
---

# Refactor Class to Modern Patterns

File to refactor: $ARGUMENTS

## Patterns to Apply

See ${CLAUDE_SKILL_DIR}/examples/before-after.md

## Steps
1. Read the current implementation
2. Identify improvement opportunities
3. Refactor using modern patterns
4. Ensure tests still pass

!`npm test $1`
EOF

# Create example/reference
cat > .claude/skills/refactor-class/examples/before-after.md << 'EOF'
# Before → After Examples

## Constructor Pattern

BEFORE:
```javascript
function User(name, email) {
  this.name = name;
  this.email = email;
}
```

AFTER:
```javascript
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}
```
EOF
```

**Step 4: Invoke the Skill**

```bash
claude> /refactor-class src/User.js
# Skill runs in isolated context, uses examples and scripts
```

**Step 5: Verify It Works**

```bash
# Check what you created:
ls -R .claude/skills/refactor-class/

# Try invoking:
claude> /refactor-class @src/Service.js

# Expected output: Claude refactors using modern patterns from examples
```

### Expected Outcome

After this exercise:
- ✓ Created a simple slash command (`/review`)
- ✓ Built a complex skill with examples and templates (`/refactor-class`)
- ✓ Both are reusable across the project
- ✓ Team members can use them too (checked into repo)

---

## Summary

| Concept | Key Takeaway |
|---------|--------------|
| **Skills** | Reusable workflows and knowledge (complex, multi-file) |
| **Commands** | Simple shortcuts (single-file Markdown) |
| **Reference skills** | Loaded automatically (`disable-model-invocation: true`) |
| **Action skills** | Invoked with `/skillname` (`user-invocable: true`) |
| **Frontmatter** | Controls behavior, allowed tools, context, model |
| **Templates** | Include `/examples`, `/scripts` for complex skills |
| **Context fork** | Run in isolated subagent for focused work |
| **Substitutions** | `$ARGUMENTS`, `${CLAUDE_SESSION_ID}`, etc. |
| **Priority** | Enterprise > Personal > Project > Plugin |
| **When to use** | Skills for automation, commands for shortcuts, CLAUDE.md for conventions |

**Next module:** We'll look at how to integrate external systems and tools with MCP (Module 6).

