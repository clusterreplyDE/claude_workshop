# Module 8 — MCP: External Connections (35 min)

> *Connecting Claude to the outside world*

## Learning Objectives

By the end of this module, participants will be able to:

- Understand what the Model Context Protocol (MCP) is and why it matters
- Install and configure MCP servers for GitHub, Jira, databases, and custom APIs
- Distinguish between the transport types (stdio, HTTP)
- Manage MCP server scope (local, project, user)
- Use MCP tools within Claude Code sessions

---

## 1. What is MCP?

The **Model Context Protocol (MCP)** is an open standard for connecting Claude to external tools, APIs, and data sources. It acts as a universal adapter:

```
┌──────────────┐
│  Claude Code │
└───────┬──────┘
        │
   ┌────▼────────────────────────┐
   │     MCP (stdio / HTTP)       │
   └────┬────────────────────────┘
        │
    ┌───┴────────────────────────────────────────┐
    │                                            │
┌───▼──┐  ┌──────┐  ┌────────┐  ┌──────────┐ ┌─▼─────┐
│GitHub│  │ Jira │  │Database│  │Slack API │ │Custom │
│      │  │      │  │        │  │ / Stripe │ │ Tools │
└──────┘  └──────┘  └────────┘  └──────────┘ └───────┘
```

MCP tools are **discovered automatically** at session start — no extra configuration needed once a server is installed.

### Where Do MCP Servers Come From?

- **npm packages** — Community servers: `npx @anthropic-ai/github-mcp-server`
- **Plugins** — Bundled with Claude Code plugins (auto-configured)
- **Custom** — Your own Node.js/Python script implementing the MCP protocol
- **Cloud endpoints** — Hosted HTTP services (e.g., by your company)

### Benefits

- **Extensibility**: Add new integrations without changing Claude Code
- **Modularity**: Each integration is isolated and independently managed
- **Reusability**: Same MCP server can be used by multiple teams or tools
- **Control**: You decide what tools Claude can access

---

## 2. Transport Types

MCP supports two transport mechanisms:

| Transport | Connection | Best For |
|-----------|-----------|----------|
| **stdio** | Local process (stdin/stdout) | Development, local servers, Node.js/Python scripts |
| **HTTP** | HTTPS endpoint | Production, cloud services, shared team servers |

**Rule of thumb:** Local development → stdio. Cloud or shared → HTTP.

> On Windows, wrap stdio commands with `cmd /c`: `claude mcp add --transport stdio terraform -- cmd /c npx terraform-mcp`

---

## 3. Installing MCP Servers

### HTTP Transport (Cloud Services)

```bash
claude mcp add --transport http github https://mcp.example.com/github \
  --header Authorization "Bearer YOUR_TOKEN"
```

Options (`--transport`, `--header`) must come **before** the server name.

### Stdio Transport (Local Processes)

```bash
claude mcp add --transport stdio terraform -- terraform-lsp --mode=stdio
```

Use `--` to separate flags from the command. Pass environment variables with `--env`:

```bash
claude mcp add --transport stdio mydb -- mydb-mcp-server \
  --env DATABASE_URL "postgres://localhost/mydb"
```

---

## 4. MCP Server Management

### Common Commands

```bash
claude mcp list                # List all installed servers
claude mcp get github          # Show details + available tools
claude mcp remove github       # Remove a server
```

In a running session, check MCP status with `/mcp`.

### Troubleshooting

| Problem | Solution |
|---------|----------|
| "MCP server not found" | Run `claude mcp list`, check scope |
| "Connection timeout" | Check URL, set `MCP_TIMEOUT=60` before launching |
| "Permission denied" | Verify token/credentials in header |
| "Tool not available" | Run `claude mcp get <name>` to inspect tools |

For detailed debugging, set `MCP_DEBUG=1` before launching Claude.

---

## 5. Scope: Local, Project, User

MCP servers can be configured at three scopes:

| Scope | Location | Visibility |
|-------|----------|------------|
| **Local** | `~/.claude.json` (per project) | This project only |
| **Project** | `.mcp.json` in project root | Committed to git, team-wide |
| **User** | `~/.claude.json` global | All your projects |

Priority: Local > Project > User. Add to a specific scope:

```bash
claude mcp add --scope project github https://mcp.github.com
claude mcp add --scope user stripe https://mcp.stripe.com
```

### Project Scope (.mcp.json)

Commit a `.mcp.json` to share MCP config with your team:

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
    "internal-db": {
      "transport": "stdio",
      "command": "internal-db-mcp",
      "args": ["--mode", "stdio"],
      "env": {
        "DB_HOST": "db.internal"
      }
    }
  }
}
```

Use `${VAR_NAME}` references — Claude resolves them at runtime.

---

## Hands-On Exercise (10 min)

### Set Up a Filesystem MCP Server

This exercise uses a **local stdio MCP server** — no external accounts needed.

**Step 1: Install the Filesystem MCP Server**

```bash
claude mcp add --transport stdio filesystem -- \
  npx -y @modelcontextprotocol/server-filesystem /tmp/mcp-demo
```

This starts a local Node.js process that gives Claude read/write access to `/tmp/mcp-demo`.

**Step 2: Create Test Data**

```bash
mkdir -p /tmp/mcp-demo
echo "Hello from MCP!" > /tmp/mcp-demo/test.txt
echo '{"name": "workshop", "version": "1.0"}' > /tmp/mcp-demo/config.json
```

**Step 3: Verify**

```bash
claude mcp list
claude mcp get filesystem    # Should show available tools
```

**Step 4: Use It in a Session**

```bash
claude
# In session:
> List all files available through the filesystem MCP server.
> Read the contents of config.json via MCP.
> Create a new file called notes.md with a summary of today's workshop.
```

Claude invokes MCP tools (`list_directory`, `read_file`, `write_file`) automatically.

**Step 5: Discussion**

- How would you replace `filesystem` with a GitHub MCP? (Hint: change transport to `http`, add auth header)
- What scope would you use for a team GitHub MCP? (Hint: `--scope project` with `.mcp.json`)

---

## Summary

| Concept | Key Point |
|---------|-----------|
| **MCP** | Open protocol for Claude to integrate with external tools and APIs |
| **Transports** | stdio (local processes), HTTP (cloud services) |
| **Installation** | `claude mcp add --transport <type> <name> <url/command>` |
| **Scope** | Local (project-specific), Project (.mcp.json, team), User (global) |
| **Management** | `claude mcp list/get/remove`, `/mcp` in session |
| **Debugging** | `MCP_DEBUG=1`, `/mcp`, common issues table |

**Up next:** Module 9 — Hooks & Permissions (code that ALWAYS runs, independent of the LLM).
