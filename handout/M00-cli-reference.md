# Claude Code CLI Reference

> A beginner-friendly guide to all Claude Code command-line options and subcommands.
> Based on `claude --help` output.

Claude Code is Anthropic's official CLI tool for interacting with Claude directly from your terminal. By default, running `claude` starts an **interactive session**. You can also use `claude -p` (or `--print`) for **non-interactive** (one-shot) mode.

```bash
# Interactive session
claude

# Non-interactive (pipe-friendly)
claude -p "Explain this error log"
```

---

## Table of Contents

- [Arguments](#arguments)
- [Options by Category](#options-by-category)
  - [Session & Resuming](#session--resuming)
  - [Model & Effort](#model--effort)
  - [Permissions & Safety](#permissions--safety)
  - [Output & Formatting](#output--formatting)
  - [System Prompt & Context](#system-prompt--context)
  - [Debugging](#debugging)
  - [Integration & IDE](#integration--ide)
  - [MCP & Plugins](#mcp--plugins)
  - [Advanced & Miscellaneous](#advanced--miscellaneous)
- [Subcommands](#subcommands)

---

## Arguments

| Argument | Description |
|----------|-------------|
| `prompt` | Your prompt text. If provided, Claude processes it directly. If omitted, an interactive session starts. |

```bash
# Pass a prompt directly
claude "What does this function do?"

# Or start interactive mode
claude
```

---

## Options by Category

### Session & Resuming

These options control how Claude Code manages conversation sessions. Sessions allow Claude to remember prior context.

| Flag | Description |
|------|-------------|
| `-c`, `--continue` | **Continue the most recent conversation** in the current directory. Useful when you closed the terminal and want to pick up where you left off. |
| `-r`, `--resume [value]` | **Resume a conversation by session ID**, or open an interactive picker with an optional search term to find a past session. |
| `--from-pr [value]` | **Resume a session linked to a PR** by PR number/URL, or open an interactive picker with optional search term. |
| `--session-id <uuid>` | **Use a specific session ID** for the conversation (must be a valid UUID). Useful for programmatic access. |
| `--fork-session` | When resuming, **create a new session ID** instead of reusing the original. The conversation history is copied, but future messages go into the new session. |
| `--no-session-persistence` | **Disable saving sessions to disk**. Sessions will not be saved and cannot be resumed. Only works with `--print`. |
| `-n`, `--name <name>` | **Set a display name** for this session. Shown in `/resume` and in the terminal title for easy identification. |

**Examples:**

```bash
# Continue last conversation
claude -c

# Resume with interactive picker
claude -r

# Resume a specific session
claude --session-id "550e8400-e29b-41d4-a716-446655440000"

# Name your session for easy finding later
claude -n "refactor-auth" "Let's refactor the auth module"
```

---

### Model & Effort

Control which Claude model to use and how much effort it should spend thinking.

| Flag | Description |
|------|-------------|
| `--model <model>` | **Choose the model** for this session. You can use an alias like `sonnet` or `opus`, or the full model ID like `claude-sonnet-4-6`. |
| `--effort <level>` | **Set the effort level** for this session. Choices: `low`, `medium`, `high`, `max`. Higher effort means more thorough (but slower) responses. |
| `--fallback-model <model>` | **Set an automatic fallback model** if the default model is overloaded. Only works with `--print`. |

**Examples:**

```bash
# Use the Sonnet model
claude --model sonnet "Quick question"

# Use maximum effort for a complex task
claude --effort max "Refactor this entire module"

# Non-interactive with fallback
claude -p --model opus --fallback-model sonnet "Analyze this code"
```

---

### Permissions & Safety

Control what Claude is allowed to do and which tools it can access.

| Flag | Description |
|------|-------------|
| `--permission-mode <mode>` | **Set the permission mode** for the session. Choices: `acceptEdits`, `auto`, `bypassPermissions`, `default`, `dontAsk`, `plan`. Determines how often Claude asks for your approval before taking actions. |
| `--allowedTools`, `--allowed-tools <tools...>` | **Whitelist specific tools** Claude can use. Comma or space-separated list (e.g. `"Bash(git:*) Edit"`). |
| `--disallowedTools`, `--disallowed-tools <tools...>` | **Blacklist specific tools** Claude cannot use (e.g. `"Bash(git:*) Edit"`). |
| `--add-dir <directories...>` | **Grant access to additional directories** beyond the current working directory. |
| `--dangerously-skip-permissions` | **Bypass all permission checks**. Recommended **only** for sandboxes with no internet access. Use with extreme caution! |
| `--allow-dangerously-skip-permissions` | **Enable bypassing all permission checks as an option**, without it being enabled by default. Recommended only for sandboxes with no internet access. |

**Examples:**

```bash
# Run in plan mode (Claude plans but doesn't execute)
claude --permission-mode plan "Redesign the API layer"

# Only allow read and edit tools
claude --allowedTools "Read,Edit" "Review this file"

# Give access to a shared library folder
claude --add-dir ../shared-lib "Use the shared utilities"
```

> **Warning:** `--dangerously-skip-permissions` should never be used outside of isolated sandbox environments. It disables all safety checks.

---

### Output & Formatting

Control how Claude formats its output, especially useful for scripting and automation.

| Flag | Description |
|------|-------------|
| `-p`, `--print` | **Print response and exit** (non-interactive mode). Useful for pipes and scripts. The workspace trust dialog is skipped when run with `-p` in directories you trust. |
| `--output-format <format>` | **Set output format**. Only works with `--print`. Choices: `text` (default), `json` (single result), `stream-json` (real-time streaming). |
| `--input-format <format>` | **Set input format**. Only works with `--print`. Choices: `text` (default), `stream-json` (real-time streaming input). |
| `--json-schema <schema>` | **Enforce structured output** with a JSON Schema for validation. Example: `{"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}` |
| `--verbose` | **Override verbose mode** setting from config. Shows more detailed output. |
| `--brief` | **Enable SendUserMessage tool** for agent-to-user communication. |
| `--include-hook-events` | **Include all hook lifecycle events** in the output stream. Only works with `--print` and `--output-format=stream-json`. |
| `--include-partial-messages` | **Include partial message chunks** as they arrive. Only works with `--print` and `--output-format=stream-json`. |
| `--replay-user-messages` | **Re-emit user messages from stdin** back on stdout for acknowledgement. Only works with `--input-format=stream-json` and `--output-format=stream-json`. |

**Examples:**

```bash
# Simple one-shot question
claude -p "What is a closure in JavaScript?"

# Get JSON output for scripting
claude -p --output-format json "List the top 3 issues in this code"

# Enforce structured output
claude -p --json-schema '{"type":"object","properties":{"summary":{"type":"string"}}}' "Summarize this file"

# Stream JSON output in real-time
claude -p --output-format stream-json "Explain this error"
```

---

### System Prompt & Context

Customize Claude's behavior and provide additional context files.

| Flag | Description |
|------|-------------|
| `--system-prompt <prompt>` | **Override the default system prompt** entirely. Defines how Claude should behave for this session. |
| `--append-system-prompt <prompt>` | **Append text to the default system prompt**. Adds instructions without replacing the defaults. |
| `--file <specs...>` | **Download file resources at startup**. Format: `file_id:relative_path` (e.g. `--file file_abc:doc.txt file_def:img.png`). |

**Examples:**

```bash
# Custom system prompt
claude --system-prompt "You are a Python expert. Only suggest Python solutions."

# Add extra instructions on top of the defaults
claude --append-system-prompt "Always explain your reasoning step by step."

# Load files at startup
claude --file file_abc:requirements.txt "Check these dependencies"
```

---

### Debugging

Tools for troubleshooting Claude Code itself.

| Flag | Description |
|------|-------------|
| `-d`, `--debug [filter]` | **Enable debug mode** with optional category filtering (e.g. `"api,hooks"` or `"1lp,1file"`). Shows internal details about what Claude is doing. |
| `--debug-file <path>` | **Write debug logs to a file** instead of the console. Implicitly enables debug mode. |
| `--mcp-debug` | **[DEPRECATED: Use `--debug` instead]** Enable MCP debug mode to show MCP server errors. |

**Examples:**

```bash
# Enable debug output
claude -d "Why is this failing?"

# Filter debug to API calls only
claude -d "api" "Test this endpoint"

# Write debug logs to a file for later analysis
claude --debug-file ./debug.log "Investigate the build error"
```

---

### Integration & IDE

Connect Claude Code with editors, browsers, and development workflows.

| Flag | Description |
|------|-------------|
| `--ide` | **Automatically connect to an IDE** on startup, if exactly one valid IDE is available. |
| `--chrome` | **Enable Claude in Chrome integration**. Allows Claude to interact with your browser. |
| `--no-chrome` | **Disable Claude in Chrome integration**. |
| `--tmux` | **Create a tmux session for the worktree**. Requires `--worktree`. Uses iTerm2 native panes when available; use `--tmux=classic` for traditional tmux. |
| `-w`, `--worktree [name]` | **Create a new git worktree** for this session (optionally specify a name). Useful for working on a separate branch without affecting your main working directory. |

**Examples:**

```bash
# Start with IDE integration
claude --ide

# Start with Chrome integration for web debugging
claude --chrome "Debug the login page"

# Work in an isolated git worktree
claude -w "feature-branch" "Implement the new feature"
```

---

### MCP & Plugins

Configure Model Context Protocol servers and plugins to extend Claude's capabilities.

| Flag | Description |
|------|-------------|
| `--mcp-config <configs...>` | **Load MCP servers** from JSON files or strings (space-separated). MCP servers give Claude access to external tools and data sources. |
| `--strict-mcp-config` | **Only use MCP servers from `--mcp-config`**, ignoring all other MCP configurations. |
| `--plugin-dir <path>` | **Load plugins from a directory** for this session only. Repeatable: `--plugin-dir A --plugin-dir B` (default: `[]`). |
| `--disable-slash-commands` | **Disable all skills** (slash commands like `/commit`, `/review-pr`, etc.). |

**Examples:**

```bash
# Load an MCP server configuration
claude --mcp-config ./my-mcp-servers.json "Use the database tool"

# Load MCP config and ignore all other configs
claude --mcp-config ./custom.json --strict-mcp-config

# Load plugins from a custom directory
claude --plugin-dir ./my-plugins "Use the custom formatter"
```

---

### Advanced & Miscellaneous

Less commonly used options for specialized workflows.

| Flag | Description |
|------|-------------|
| `--bare` | **Minimal mode** - skips hooks, LSP, plugin sync, attribution, auto-memory, background prefetches, keychain reads, and CLAUDE.md auto-discovery. Sets `CLAUDE_CODE_SIMPLE=1`. Anthropic auth is strictly `ANTHROPIC_API_KEY` or `apiKeyHelper`. 3P providers use their own credentials. Context is provided explicitly via `--system-prompt`, `--append-system-prompt`, `--add-dir`, `--mcp-config`, `--settings`, `--agents`, `--plugin-dir`. |
| `--betas <betas...>` | **Beta headers** to include in API requests. For API key users only. |
| `--tools <tools...>` | **Specify the list of available tools** from the built-in set. Use `""` to disable all tools, `"default"` for all tools, or specify tool names (e.g. `"Bash,Edit,Read"`). |
| `--max-budget-usd <amount>` | **Set a maximum dollar budget** to spend on API calls. Only works with `--print`. |
| `--agents <json>` | **Define custom agents** as a JSON object (e.g. `'{"reviewer": {"description": "Review code", "prompt": "You are a code reviewer"}}'`). |
| `--agent <agent>` | **Set the agent** for the current session. Overrides the `agent` setting. |
| `--settings <file-or-json>` | **Load additional settings** from a JSON file or JSON string. |
| `--setting-sources <sources>` | **Comma-separated list of setting sources** to load (e.g. `user`, `project`, `local`). |
| `--remote-control-session-name-prefix <prefix>` | **Set a prefix** for auto-generated Remote Control session names (default: hostname). |
| `-h`, `--help` | **Display help** for the command. |
| `-v`, `--version` | **Output the version number** of Claude Code. |

**Examples:**

```bash
# Minimal/bare mode for CI pipelines
claude --bare -p "Run the linter"

# Set a budget limit
claude -p --max-budget-usd 5 "Analyze this large codebase"

# Restrict available tools
claude --tools "Read,Grep" "Search for all TODO comments"

# Check the installed version
claude --version
```

---

## Subcommands

Claude Code also provides subcommands for managing its configuration and environment.

| Command | Description |
|---------|-------------|
| `claude agents [options]` | **List configured agents**. Shows all available custom agents. |
| `claude auth` | **Manage authentication**. Log in, log out, or check your auth status. |
| `claude auto-mode` | **Inspect auto mode classifier configuration**. See how Claude decides when to auto-approve actions. |
| `claude doctor` | **Check the health** of your Claude Code auto-updater. Note: The workspace trust dialog is skipped and stdio servers from `.mcp.json` are spawned for health checks. Only use this in directories you trust. |
| `claude install [options] [target]` | **Install Claude Code native build**. Use `[target]` to specify version (`stable`, `latest`, or a specific version). |
| `claude mcp` | **Configure and manage MCP servers**. Add, remove, or list MCP server configurations. |
| `claude plugin\|plugins` | **Manage Claude Code plugins**. Install, remove, or list plugins. |
| `claude setup-token` | **Set up a long-lived authentication token**. Requires a Claude subscription. |
| `claude update\|upgrade` | **Check for updates** and install if available. |

**Examples:**

```bash
# Check authentication status
claude auth

# Run a health check
claude doctor

# Update to the latest version
claude update

# List configured MCP servers
claude mcp list

# Install the latest stable build
claude install stable
```

---

## Quick Reference Card

| What you want to do | Command |
|---------------------|---------|
| Start interactive session | `claude` |
| One-shot question | `claude -p "your question"` |
| Continue last conversation | `claude -c` |
| Resume a past session | `claude -r` |
| Use a specific model | `claude --model sonnet` |
| Set effort level | `claude --effort high` |
| Get JSON output | `claude -p --output-format json "prompt"` |
| Debug issues | `claude -d` |
| Check version | `claude --version` |
| Update Claude Code | `claude update` |

---

*Generated for workshop use. Based on Claude Code CLI help output.*
