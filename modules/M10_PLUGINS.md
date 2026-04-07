# Module 10 — Plugins & Marketplace (10 min)

> *Sharing and reusing workflows*

## Learning Objectives

By the end of this module, participants will be able to:

- Understand what a plugin is and how it differs from skills
- Navigate the Claude plugin directory and install marketplace plugins
- Recognize the plugin manifest structure and namespacing
- Know when to package workflows as plugins vs. keeping them local
- Understand plugin data persistence and configuration

---

## 1. What Is a Plugin?

A **plugin** is a self-contained package that bundles multiple Claude Code extensions:

| Component | Purpose | Example |
|-----------|---------|---------|
| **Skills** | Reusable workflows with frontmatter | `/my-plugin:review` — code review workflow |
| **Commands** | Slash-like invocations | `/my-plugin:format-all-js` |
| **Hooks** | Deterministic automation on file events | Auto-lint on edit, commit checks |
| **Agents** | Subagents that run independently | QA bot, documentation generator |
| **MCP Servers** | Connections to external systems | GitHub API, Slack, databases |

### Plugins vs. Skills

| Aspect | Skill | Plugin |
|--------|-------|--------|
| **Scope** | Single workflow, local or global | Multiple related workflows, team/marketplace |
| **Namespace** | Global (can collide) | Namespaced: `/plugin-name:skill-name` |
| **Installation** | Copy `.claude/skills/` | `claude plugin install <name>` |
| **Dependencies** | Individual | Can include MCP servers, hooks, config |
| **Distribution** | Share SKILL.md file | Published to marketplace or Git repo |

---

## 2. Plugin Directory Structure

A plugin lives in `.claude-plugin/` at the project root or in a dedicated repo:

```
my-plugin/
├── .claude-plugin/
│   ├── plugin.json              # Plugin manifest
│   ├── skills/                  # Custom skills
│   │   ├── review/
│   │   │   └── SKILL.md
│   │   └── format/
│   │       └── SKILL.md
│   ├── agents/                  # Custom subagents
│   │   └── qa-bot/
│   │       └── agent.json
│   ├── hooks/                   # Automation hooks
│   │   └── pre-commit.json
│   └── .mcp.json                # MCP server configuration
├── README.md
└── LICENSE
```

### plugin.json Manifest

```json
{
  "name": "code-review-toolkit",
  "version": "1.0.0",
  "description": "A complete code review and quality assurance workflow",
  "author": "Your Team",
  "license": "MIT",
  "skills": {
    "path": "skills/"
  },
  "agents": {
    "path": "agents/"
  },
  "hooks": {
    "path": "hooks/"
  },
  "mcp": {
    "path": ".mcp.json"
  },
  "config": {
    "required": ["github_token"],
    "optional": ["slack_channel"]
  }
}
```

### Manifest Fields

| Field | Purpose | Example |
|-------|---------|---------|
| **name** | Unique plugin identifier (lowercase, hyphenated) | `code-review-toolkit` |
| **version** | Semantic versioning | `1.0.0` |
| **description** | One-line summary | `A complete code review workflow` |
| **skills.path** | Directory containing SKILL.md files | `skills/` |
| **agents.path** | Directory containing agent configs | `agents/` |
| **hooks.path** | Directory containing hook definitions | `hooks/` |
| **mcp.path** | MCP server configuration | `.mcp.json` |
| **config.required** | User-supplied config at enable time | `["github_token"]` |
| **config.optional** | Optional configuration | `["slack_channel"]` |

---

## 3. Namespaced Skills

When a plugin is installed, all its skills are **namespaced** to avoid conflicts:

```bash
# Local skill (no namespace)
/my-local-skill

# Plugin skill (namespaced)
/code-review-toolkit:review
/code-review-toolkit:format
/code-review-toolkit:merge-check
```

### Multiple Plugins Can Coexist

```bash
# From plugin A
/linter-suite:eslint
/linter-suite:prettier

# From plugin B
/code-review-toolkit:review
/code-review-toolkit:merge-check

# All can run in the same session without collision
```

---

## 4. Plugin Installation & Management

### CLI Commands

```bash
# Install a plugin from marketplace
claude plugin install code-review-toolkit

# Install from a Git repository
claude plugin install git+https://github.com/my-org/my-plugin.git

# List installed plugins
claude plugin list

# Remove a plugin
claude plugin remove code-review-toolkit

# Update a plugin
claude plugin update code-review-toolkit
```

### Output of `claude plugin list`

```
Installed Plugins:
  ✓ code-review-toolkit v1.0.0
    Skills: review, format, merge-check (3)
    Hooks: pre-commit (1)
    MCP Servers: github (1)
    Config: github_token (required), slack_channel (optional)

  ✓ documentation-bot v2.1.0
    Skills: generate-readme, update-api-docs (2)
    Agents: doc-reviewer (1)
    Config: None

  ✓ performance-profiler v0.5.0
    Skills: profile, analyze, report (3)
    Hooks: post-test (1)
```

---

## 5. Anthropic Marketplace & Custom Repositories

### Anthropic Marketplace

Anthropic maintains a public [plugin marketplace](https://marketplace.claude.ai) featuring vetted, officially supported plugins:

- **Code Review Suite** — automated PR reviews, CI/CD integration
- **Documentation Bot** — README generation, API doc updates
- **Security Scanner** — SAST, dependency checks, compliance
- **Performance Profiler** — profiling, memory analysis, benchmarks
- **Cloud Deployment Kit** — Terraform, Docker, Kubernetes automation

### Creating Your Own Marketplace (Git-Based)

You can host plugins in Git repos and share them with your team:

```bash
# Publish your plugin to a repo
git init my-plugin
# ... create .claude-plugin/, README.md, LICENSE
git push origin main

# Team members install from your repo
claude plugin install git+https://github.com/my-org/my-plugin.git
```

### Sharing Within Organizations

- **Internal repos**: GitLab, GitHub Enterprise, Bitbucket
- **Version control**: Treat plugins like software — tag releases, use semantic versioning
- **Documentation**: Include clear README with setup instructions, example usage, configuration

---

## 6. Plugin Data Persistence

Plugins can store persistent data on disk:

### Environment Variables for Paths

| Variable | Purpose | Typical Value |
|----------|---------|---------------|
| `${CLAUDE_PLUGIN_ROOT}` | Plugin's installation directory | `/home/user/.claude/plugins/code-review-toolkit/` |
| `${CLAUDE_PLUGIN_DATA}` | Persistent data directory (created on first write) | `/home/user/.claude/plugin-data/code-review-toolkit/` |

### Example: Storing Configuration

```bash
# A plugin hook or skill writes to ${CLAUDE_PLUGIN_DATA}
cat > "${CLAUDE_PLUGIN_DATA}/config.json" <<EOF
{
  "github_token": "***",
  "slack_channel": "#code-review",
  "review_template": "standard"
}
EOF

# Another skill reads it
jq '.github_token' "${CLAUDE_PLUGIN_DATA}/config.json"
```

---

## 7. User Configuration at Enable Time

When a plugin is first enabled, Claude can prompt the user for required configuration:

```json
{
  "name": "code-review-toolkit",
  "config": {
    "required": [
      {
        "key": "github_token",
        "prompt": "GitHub personal access token (for API calls)",
        "sensitive": true
      },
      {
        "key": "github_org",
        "prompt": "GitHub organization name"
      }
    ],
    "optional": [
      {
        "key": "slack_channel",
        "prompt": "Slack channel for notifications (default: #engineering)"
      }
    ]
  }
}
```

**Interactive prompt:**

```
Configuring code-review-toolkit...
? GitHub personal access token: ••••••••••••••••
? GitHub organization name: acme-corp
? Slack channel for notifications (press Enter to skip): #code-review

✓ Configuration saved to ~/.claude/plugin-data/code-review-toolkit/config.json
```

---

## 8. When to Use Plugins

### Use Plugins When:

- **Team reuse**: Multiple repos need the same workflows (code review, deployment, CI/CD)
- **Complex setups**: Bundling skills, hooks, MCP, and agents together
- **Distribution**: Sharing with other teams or the public marketplace
- **Versioning**: Want to track and update workflows independently from the repo
- **Isolation**: Plugin code shouldn't live in the main project repo

### Don't Use Plugins When:

- **Single-project workflows**: Keep local skills in `.claude/skills/`
- **Experimental**: Still iterating — publish as plugin once stable
- **Quick fixes**: Ad-hoc commands don't need packaging

---

## 9. Demo: Plugin in Action

*(Live demo — no hands-on at this stage)*

**Scenario:** A team enables the `code-review-toolkit` plugin:

```bash
# Step 1: Install
$ claude plugin install code-review-toolkit
Fetching plugin from marketplace...
✓ Installed code-review-toolkit v1.0.0

# Step 2: Configure
? GitHub personal access token: ••••••••••••••••
? GitHub organization: acme-corp
✓ Configuration saved

# Step 3: Use in a session
$ claude
> /code-review-toolkit:review src/payment.ts
Analyzing src/payment.ts...
Found 3 issues:
  1. Missing error handling on line 42
  2. Inefficient loop on line 67 (use map instead)
  3. Security: SQL injection risk on line 89
```

---

## Summary

| Concept | Key Takeaway |
|---------|--------------|
| **What is a plugin?** | Bundled skills, hooks, agents, MCP servers — designed for team reuse |
| **Directory structure** | `.claude-plugin/` with manifest, skills/, agents/, hooks/, .mcp.json |
| **Namespacing** | Prevents collisions: `/plugin-name:skill-name` |
| **Installation** | `claude plugin install <name>` from marketplace or Git |
| **Configuration** | User-prompted at enable time, stored in `${CLAUDE_PLUGIN_DATA}` |
| **When to use** | Team workflows, complex setups, distribution; not for single-project local work |
| **Distribution** | Anthropic Marketplace for official plugins, Git repos for internal/custom plugins |

**Up next:** Module 11 — Claude Code Remote & Web, exploring cloud-based and browser-based Claude Code.
