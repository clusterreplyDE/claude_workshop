**MCP · Hooks · CLI & Headless --- Quick Reference**

*Everything you need for Modules 8, 9, and 10: external connections,
deterministic automation, and CI/CD.*

**MCP Server Management**

  ------------------------------------------------------------ ---------------------------------
  **Command**                                                  **Purpose**
  **claude mcp add \--transport http \<name\> \<url\>**        Add HTTP server (cloud)
  **claude mcp add \--transport stdio \<name\> \-- \<cmd\>**   Add stdio server (local)
  **claude mcp add \--scope project \...**                     Save to .mcp.json (team-shared)
  **claude mcp add \--scope user \...**                        Save globally for all projects
  **claude mcp list**                                          List all configured servers
  **claude mcp get \<name\>**                                  Show server details
  **claude mcp remove \<name\>**                               Remove a server
  **/mcp**                                                     Check status in session
  **MCP\_DEBUG=1 claude**                                      Debug mode (verbose MCP logs)
  **Windows: cmd /c \<command\>**                              Wrap stdio commands on Windows
  ------------------------------------------------------------ ---------------------------------

**Important: All flags must come BEFORE server name. \-- separates
Claude flags from server command.**

**MCP Scopes**

  --------------------- ----------------------------- -----------------------------------------------
  **Scope**             **Storage**                   **Use When**
  **Local (default)**   \~/.claude.json per project   Personal, experimental, sensitive credentials
  **Project**           .mcp.json (committed)         Team tools, required for collaboration
  **User**              \~/.claude.json global        Personal utilities across all projects
  --------------------- ----------------------------- -----------------------------------------------

*Priority: Local \> Project \> User. Personal configs override shared
ones.*

**Hook Lifecycle Events**

  ---------------------- ---------------------- --------------------------
  **Event**              **Fires When**         **Common Use**
  **PreToolUse**         Before tool executes   Block dangerous commands
  **PostToolUse**        After tool executes    Auto-format, auto-test
  **SessionStart**       Session begins         Inject context, date
  **UserPromptSubmit**   User sends message     Logging, validation
  **Stop**               Claude finishes        Notifications, telemetry
  **SubagentStop**       Subagent completes     Logging, chaining
  **PreCompact**         Before compaction      Save context snapshots
  **TaskCompleted**      Background task done   Notifications
  ---------------------- ---------------------- --------------------------

**Hook Decision Control**

  ------------------------------------------------------- ---------------------------------------------
  **Exit Code / JSON**                                    **Effect**
  **Exit 0**                                              Continue normally (stdout → Claude context)
  **Exit 2**                                              Block the tool call
  **{ \"decision\": \"block\", \"reason\": \"\...\" }**   Block with explanation
  **{ \"decision\": \"allow\" }**                         Force allow (skip permission)
  **{ \"message\": \"\...\" }**                           Inject message into Claude context
  **{ \"suppressOutput\": true }**                        Hide tool output from Claude
  ------------------------------------------------------- ---------------------------------------------

**Hook Configuration Example**

// In .claude/settings.json

\"hooks\": {

\"PostToolUse\": \[{

\"matcher\": \"Write\|Edit\",

\"hooks\": \[{

\"type\": \"command\",

\"command\": \"npx prettier \--write \$CLAUDE\_FILE\_PATH\"

}\]

}\]

}

**CLI & Headless Mode**

  -------------------------------------- ------------------------------------------
  **Flag**                               **Purpose**
  **claude -p \"prompt\"**               One-shot non-interactive execution
  **\--output-format json**              Machine-readable JSON output
  **\--output-format stream-json**       Streaming JSON events
  **\--system-prompt \"\...\"**          Custom system prompt
  **\--append-system-prompt \"\...\"**   Add to default system prompt
  **\--allowedTools Tool1,Tool2**        Whitelist tools
  **\--disallowedTools Tool1**           Blacklist tools
  **\--max-budget-usd 1.00**             Cost limit (stops at budget)
  **\--json-schema \'{\...}\'**          Enforce structured output
  **\--worktree**                        Isolated parallel session (git worktree)
  **\--tmux**                            Run in tmux pane
  **-n, \--name \"task\"**               Named session
  **\--continue**                        Resume most recent session
  **\--resume**                          Pick from recent sessions
  -------------------------------------- ------------------------------------------

**GitHub Action Template**

name: Claude PR Review

on: \[pull\_request\]

jobs:

review:

runs-on: ubuntu-latest

steps:

\- uses: actions/checkout\@v4

\- run: npm install -g \@anthropic-ai/claude-code

\- name: Review PR

env:

ANTHROPIC\_API\_KEY: \${{ secrets.ANTHROPIC\_API\_KEY }}

run: claude -p \"Review this PR for issues\" \--output-format json
