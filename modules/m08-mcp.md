# Module 8 — MCP: External Connections (35 min)

> *Connecting Claude to the outside world*

## Learning Objectives

By the end of this module, participants will be able to:

- Understand what the Model Context Protocol (MCP) is and why it matters
- Install and configure MCP servers for GitHub, Jira, databases, and custom APIs
- Distinguish between the three transport types (stdio, HTTP, SSE)
- Manage MCP server scope (local, project, user)
- Use MCP tools within Claude Code sessions
- Debug MCP connections

---

## 1. What is MCP?

The **Model Context Protocol (MCP)** is an open standard for connecting Claude to external tools, APIs, and data sources. It acts as a universal adapter:

```
┌──────────────┐
│  Claude Code │
└───────┬──────┘
        │
   ┌────▼────────────────────────┐
   │     MCP (stdio/HTTP/SSE)     │
   └────┬────────────────────────┘
        │
    ┌───┴────────────────────────────────────────┐
    │                                            │
┌───▼──┐  ┌──────┐  ┌────────┐  ┌──────────┐ ┌─▼─────┐
│GitHub│  │ Jira │  │Database│  │Slack API │ │Custom │
│      │  │      │  │        │  │ / Stripe │ │ Tools │
└──────┘  └──────┘  └────────┘  └──────────┘ └───────┘
```

Instead of Claude natively integrating with every service, MCP servers act as middleware that Claude can invoke.

### Benefits

- **Extensibility**: Add new integrations without changing Claude Code
- **Modularity**: Each integration is isolated and independently managed
- **Reusability**: Same MCP server can be used by multiple teams or tools
- **Control**: You decide what tools Claude can access (GitHub + read-only MCP = no deletions)

---

## 2. Transport Types

MCP supports three transport mechanisms. Choose based on your deployment:

| Transport | Connection | Best For | Notes |
|-----------|-----------|----------|-------|
| **stdio** | Local process (stdin/stdout) | Development, local servers, testing | Simplest for Node.js/Python scripts on your machine |
| **HTTP** | HTTPS endpoint | Production, cloud services, remote APIs | Recommended for cloud-based MCP servers, requires URL + optional headers |
| **SSE** | Server-Sent Events | (Deprecated) | Use HTTP instead — better performance and security |

### Choosing a Transport

- **Local development?** → **stdio** (fast, no network)
- **Cloud-based service?** → **HTTP** (scalable, centralized)
- **Shared team server?** → **HTTP** with authentication headers
- **Custom integration?** → stdio (Node.js/Python) or HTTP (REST API)

---

## 3. Installing MCP Servers

### HTTP Transport (Recommended for Cloud)

Install a cloud-based MCP server:

```bash
claude mcp add --transport http github https://mcp.example.com/github \
  --header Authorization "Bearer YOUR_TOKEN"
```

Syntax:
```bash
claude mcp add --transport http <name> <url> [--header KEY VALUE] [--header KEY VALUE]
```

**Critical:** Options (--transport, --header) must come **before** the server name.

Example with multiple headers:

```bash
claude mcp add --transport http stripe https://api.stripe.com/mcp \
  --header Authorization "Bearer sk_live_..." \
  --header X-Client-Version "v1"
```

### Stdio Transport (For Local Processes)

Install a local process server:

```bash
claude mcp add --transport stdio terraform -- terraform-lsp \
  --mode=stdio
```

Syntax:
```bash
claude mcp add --transport stdio <name> -- <command> [args...]
```

**Critical:** Use `--` to separate flags from the command.

With environment variables:

```bash
claude mcp add --transport stdio mydb -- mydb-mcp-server \
  --env DATABASE_URL "postgres://localhost/mydb" \
  --env LOG_LEVEL "debug"
```

### Adding Headers and Auth

For HTTP servers requiring authentication:

```bash
# GitHub Enterprise with OAuth
claude mcp add --transport http github-enterprise https://github.company.com/mcp \
  --header Authorization "token ghp_YOUR_PAT"

# Custom API with API key
claude mcp add --transport http custom-api https://api.custom.com/mcp \
  --header X-API-Key "your-secret-key"
```

---

## 4. MCP Server Management

### List All Installed Servers

```bash
claude mcp list
```

Output:
```
Installed MCP Servers:
  github (http) - Read and create issues, manage PRs
  stripe (http) - Manage payments and customers
  terraform (stdio) - Validate and plan Terraform
```

### Get Details About a Server

```bash
claude mcp get github
```

Output:
```
Name: github
Transport: HTTP
URL: https://mcp.example.com/github
Tools: 15 available
  - list_repositories
  - get_issue
  - create_issue
  - update_pull_request
  - ...
```

### Remove an MCP Server

```bash
claude mcp remove github
```

### In-Session `/mcp` Command

In a running session, check MCP status:

```
/mcp
```

Lists active MCP servers and their available tools.

---

## 5. Scope: Local, Project, User

MCP servers can be configured at three different scopes:

### Scope Definitions

| Scope | Location | Visibility | Use Case |
|-------|----------|------------|----------|
| **Local** | `~/.claude.json` for **current project** | This project only | Project-specific integrations (GitHub repo, database) |
| **Project** | `.mcp.json` in project root | Committed to git, team-wide | Shared team tools (Jira, CI/CD API, internal services) |
| **User** | `~/.claude.json` global | All projects you work on | Personal integrations (Stripe, your GitHub, personal database) |

### Scope Priority (Highest to Lowest)

1. **Local** (project-specific ~/.claude.json)
2. **Project** (.mcp.json in repo root)
3. **User** (global ~/.claude.json)

If the same MCP server is defined in multiple scopes, the most specific (local) takes precedence.

### Adding an MCP Server to a Specific Scope

```bash
# Add to local scope (default)
claude mcp add --scope local github https://mcp.github.com

# Add to project scope (committed, team-wide)
claude mcp add --scope project github https://mcp.github.com

# Add to user scope (your personal integrations)
claude mcp add --scope user stripe https://mcp.stripe.com
```

### Project Scope Configuration (.mcp.json)

In your project root, commit a `.mcp.json` file:

```json
{
  "mcpServers": {
    "github": {
      "transport": "http",
      "url": "https://mcp.github.company.com",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    },
    "jira": {
      "transport": "http",
      "url": "https://jira.company.com/mcp",
      "headers": {
        "Authorization": "Basic ${JIRA_AUTH}"
      }
    },
    "internal-db": {
      "transport": "stdio",
      "command": "internal-db-mcp",
      "args": ["--mode", "stdio"],
      "env": {
        "DB_HOST": "db.internal",
        "DB_PORT": "5432"
      }
    }
  }
}
```

**Tip:** Use environment variable references (`${VAR_NAME}`) in `.mcp.json` — Claude will resolve them at runtime.

---

## 6. Environment Variables & Configuration

### MCP-Specific Environment Variables

When running Claude Code, you can override MCP behavior:

```bash
# Increase timeout for slow MCP servers (default: 30s)
export MCP_TIMEOUT=60

# Limit context tokens used by MCP responses (default: 5000)
export MAX_MCP_OUTPUT_TOKENS=10000

# Enable debug logging for MCP
export MCP_DEBUG=1

claude
```

### Passing Environment Variables to Stdio Servers

When adding a stdio server:

```bash
claude mcp add --transport stdio myserver -- myserver-binary \
  --env DATABASE_URL "postgresql://user:pass@localhost/db" \
  --env LOG_LEVEL "debug"
```

These variables are passed to the MCP process at runtime.

---

## 7. MCP Tool Search

By default, Claude Code **discovers tools from installed MCP servers automatically**. This discovery happens at session start and has minimal overhead:

- **Idle tools consume minimal context** — MCP tool metadata is loaded lazily
- **Tool search is on by default** — no explicit configuration needed
- **You can disable it** — if you want full control over which tools are available

Disable MCP tool search for a session:

```bash
claude --no-mcp-search
```

---

## 8. Channels: Push Messages

MCP servers can push messages to Claude Code (not just respond to requests). Use the `--channels` flag:

```bash
# Listen for notifications from MCP servers
claude --channels slack github
```

This allows MCP servers to proactively send messages (e.g., "New PR merged", "Slack message received").

---

## 9. Platform Notes

### macOS / Linux

Standard installation — no special handling needed.

### Windows

For stdio servers, wrap the command with `cmd /c`:

```bash
claude mcp add --transport stdio terraform -- cmd /c npx terraform-mcp
```

This ensures Windows can properly spawn the Node.js process.

---

## 10. Debugging MCP Connections

### Check Server Status

In a session:

```
/mcp
```

Shows:
- Which MCP servers are active
- Available tools per server
- Any errors or warnings

### Test an MCP Server Locally

Before adding to Claude, test it standalone:

```bash
# For stdio servers
claude mcp serve

# For HTTP servers
curl https://mcp.example.com/github \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Enable Debug Logging

```bash
export MCP_DEBUG=1
claude
# MCP messages logged to stderr
```

### Common Issues

| Problem | Cause | Solution |
|---------|-------|----------|
| "MCP server not found" | Server not installed or scoped incorrectly | Run `claude mcp list` and check scope |
| "Connection timeout" | Slow server or wrong URL | Check URL, increase `MCP_TIMEOUT` |
| "Tool not available" | MCP server doesn't expose it | Run `claude mcp get <name>` to see available tools |
| "Permission denied" | Auth header invalid | Verify token/credentials in header |
| "Invalid JSON response" | MCP server bug | Enable `MCP_DEBUG=1` and inspect raw output |

---

## 11. Plugin-Provided MCP Servers

If you've installed a Claude Code plugin, it may provide MCP servers automatically. Check:

```bash
claude mcp list
# Look for servers added by plugins (often prefixed with plugin name)
```

Plugin-provided servers are pre-configured and ready to use.

---

---

## Hands-On Exercise (10 min)

### Set Up GitHub MCP Server and Manage Issues

**Goal:** Install GitHub MCP, read issues, and create one programmatically.

#### Prerequisites

- GitHub account with at least one repository
- GitHub Personal Access Token (PAT) with `repo` scope
  - Go to [github.com/settings/tokens](https://github.com/settings/tokens)
  - Create a new token with `repo`, `read:org` scopes
  - Copy the token

#### Step 1: Install GitHub MCP

```bash
claude mcp add --transport http github https://mcp.github.example.com \
  --header Authorization "token ghp_YOUR_TOKEN_HERE"
```

Replace `ghp_YOUR_TOKEN_HERE` with your actual token.

#### Step 2: Verify Installation

```bash
claude mcp list
# Should show: github (http) with available tools
```

#### Step 3: Start a Claude Code Session

```bash
claude
```

#### Step 4: Test MCP Tools

In your session, try:

```
List all issues in the "workshop" repository.
```

Claude will use the GitHub MCP to fetch your issues.

#### Step 5: Create an Issue Programmatically

```
Create a GitHub issue in my "workshop" repo titled "Fix authentication flow" with the description "Review and fix OAuth token refresh mechanism" and label it "bug".
```

Claude invokes the GitHub MCP's `create_issue` tool.

#### Step 6: Update the Issue

```
Update the issue we just created to add the "priority/high" label and assign it to myself.
```

---

## Summary

| Concept | Key Point |
|---------|-----------|
| **MCP** | Open protocol for Claude to integrate with external tools and APIs |
| **Transports** | stdio (local), HTTP (cloud), SSE (deprecated) |
| **Installation** | `claude mcp add --transport <type> <name> <url/command>` |
| **Scope** | Local (project), Project (.mcp.json), User (global) |
| **Tool Discovery** | Automatic, lazy-loaded, minimal context overhead |
| **Debugging** | Use `/mcp`, `claude mcp list`, and `MCP_DEBUG=1` |
| **Real-World** | GitHub, Jira, databases, Slack, custom APIs |

**Up next:** Module 9 — Hooks: Guaranteeing Determinism (code that ALWAYS runs, independent of the LLM).
