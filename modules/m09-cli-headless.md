# Module 9 — CLI & Headless Mode (30 min)

> *Claude in the pipeline*

## Learning Objectives

By the end of this module, participants will be able to:

- Run Claude Code in one-shot, non-interactive mode with `claude -p "prompt"`
- Control output format (text, JSON, structured schema)
- Integrate Claude Code into CI/CD pipelines (GitHub Actions, GitLab CI, Jenkins)
- Manage sessions programmatically (resume, fork, named sessions)
- Parallelize work with worktrees
- Dispatch tasks programmatically and schedule recurring jobs
- Understand the Agent SDK for embedding Claude into custom tools

---

## 1. Headless / Non-Interactive Mode

### One-Shot Execution

Run Claude Code without entering interactive mode:

```bash
claude -p "Analyze the test failures in the test/ directory and suggest fixes"
```

Output (default):
```
Claude Code Analysis

Test Failures Summary:
- auth.test.ts: 3 failures (JWT validation)
- payment.test.ts: 1 failure (timeout)

Recommendations:
1. Check JWT expiration time (auth.test.ts:45)
2. Increase timeout for payment processing (payment.test.ts:78)
...
```

The session runs, Claude completes the task, and the process exits. No interactive REPL.

### Output Formats

Control how Claude's response is formatted:

#### Text (Default)

```bash
claude -p "List all dependencies" --output-format text
```

Human-readable prose.

#### JSON

```bash
claude -p "Analyze test failures" --output-format json
```

Structured JSON output:
```json
{
  "summary": "...",
  "findings": [
    {"file": "auth.test.ts", "status": "failed", "count": 3},
    {"file": "payment.test.ts", "status": "failed", "count": 1}
  ],
  "recommendations": ["..."]
}
```

#### Stream JSON

```bash
claude -p "Process files" --output-format stream-json
```

Streams JSON objects line-by-line (useful for piping to other tools):
```
{"type": "progress", "message": "Processing file 1..."}
{"type": "result", "data": {...}}
{"type": "complete", "summary": "..."}
```

### System Prompts & Role Specialization

Prepend or append system instructions:

```bash
# Override system prompt entirely
claude -p "Debug this code" --system-prompt "You are a C++ expert. Focus on performance."

# Add to default system prompt
claude -p "Review this PR" --append-system-prompt "Emphasize security over all else."
```

Use for role-specific behavior (security reviewer, DevOps, QA engineer).

### Tool Restrictions

Control which tools Claude can use:

```bash
# Allow only Read and Grep
claude -p "Search for TODO comments" \
  --allowedTools Read,Grep

# Block Write and Edit
claude -p "Analyze code" \
  --disallowedTools Write,Edit
```

**Wildcards:**
```bash
# Allow only git commands
claude -p "Check git history" --allowedTools "Bash(git *)"

# Allow editing only TypeScript files
claude -p "Refactor" --allowedTools "Edit(*.ts)"
```

### Cost Control

Set spending limits for long-running tasks:

```bash
# Hard cap: stop if cost exceeds $5
claude -p "Run full test suite analysis" --max-budget-usd 5
```

Claude tracks token usage and stops before exceeding the limit.

### Structured Output with JSON Schema

Force Claude to return structured data that matches a schema:

```bash
claude -p "Extract issue metadata" \
  --json-schema '{
    "type": "object",
    "properties": {
      "title": {"type": "string"},
      "priority": {"enum": ["critical", "high", "medium", "low"]},
      "assignee": {"type": "string"},
      "labels": {"type": "array", "items": {"type": "string"}}
    },
    "required": ["title", "priority"]
  }'
```

Claude validates output against the schema. If invalid, it retries.

---

## 2. Session Management

### Resume a Previous Session

Continue work from a paused session:

```bash
# List recent sessions
claude --list-sessions

# Resume a specific session
claude --resume <session-id>

# Or just resume the last session
claude --resume
```

The session context is restored — Claude has full memory of previous work.

### Continue a Session (Alias)

```bash
claude --continue <session-id>
```

Identical to `--resume`.

### Named Sessions

Create and manage sessions by name:

```bash
# Start a new named session
claude --name refactoring-project

# Later, resume by name
claude --name refactoring-project --resume
```

Named sessions are easier to remember than session IDs.

### Fork a Session

Create a parallel branch from an existing session:

```bash
# Fork from original session
claude --fork-session <original-session-id>

# Work in the fork (different context, independent)
claude
```

Use for A/B testing approaches or exploring alternatives without losing the original.

### Programmatic Session Control

Provide a session ID explicitly:

```bash
# Use a specific session
claude --session-id my-custom-session-id -p "Continue the task"

# Session is created if it doesn't exist
```

Useful for scripting and CI/CD pipelines where you want predictable session identities.

---

## 3. CI/CD Integration: GitHub Actions Example

### Automated PR Code Review

Create a GitHub Action that triggers Claude Code to review every PR:

**File: `.github/workflows/claude-review.yml`**

```yaml
name: Claude Code PR Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write  # Allow posting comments
      contents: read

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Claude Code
        run: |
          curl https://install.claude-code.dev | bash
          export PATH="$PATH:~/.claude/bin"

      - name: Run Claude Code Review
        env:
          CLAUDE_API_KEY: ${{ secrets.CLAUDE_API_KEY }}
        run: |
          PR_NUMBER=${{ github.event.pull_request.number }}
          REVIEW=$(claude -p "Review the changes in this PR for security, performance, and code quality. Format as markdown." \
            --output-format json \
            --allowedTools Read,Grep \
            --dangerously-skip-permissions)

          echo "$REVIEW" > /tmp/review.json

      - name: Post Review as Comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const review = JSON.parse(fs.readFileSync('/tmp/review.json', 'utf8'));
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: review.summary
            });
```

### GitHub App Installation

For even tighter integration, install Claude Code as a GitHub App:

```bash
claude /install-github-app
```

This allows:
- Automatic PR reviews without manual setup
- Commit suggestions directly on changed lines
- Native GitHub UI integration

### Permissions in CI/CD

In headless/CI mode, use:

- **`--dangerously-skip-permissions`**: Auto-approve all tool calls (use with caution)
- **`--allowedTools`/`--disallowedTools`**: Restrict tools to safe operations
- **Default**: Claude prompts for permission (blocks in non-TTY environments)

**Security:** Always use `CLAUDE_API_KEY` as a GitHub Secret, never hardcode it.

---

## 4. Parallelization with Worktrees

### Isolated Parallel Sessions

Create worktrees for parallel, independent work:

```bash
# Spawn multiple workers on different tasks
claude --worktree feature-a -p "Implement authentication"
claude --worktree feature-b -p "Implement payments"
claude --worktree feature-c -p "Update tests"
```

Each worktree:
- Has its own isolated file context (copy of repo)
- Can work on different branches
- Runs in parallel
- Is independent (changes don't interfere)

### Worktree with tmux

View multiple worktrees side-by-side:

```bash
# Create and display in tmux panes
claude --worktree feature-a --tmux
claude --worktree feature-b --tmux
```

Each worktree runs in its own tmux pane, visible simultaneously.

### Background Tasks

Run tasks in the background:

```bash
# Start a task in background
claude -p "Run full test suite" &

# Continue with other work
echo "Tests running in background..."

# Wait for background job
wait
```

---

## 5. Dispatch: Programmatic Task Triggering

Dispatch is an API for triggering Claude Code tasks from external systems (not just the CLI).

### REST API Dispatch

Trigger Claude tasks from your application:

```bash
curl -X POST https://api.claude-code.dev/dispatch \
  -H "Authorization: Bearer $CLAUDE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Run end-to-end tests and report results",
    "tools": ["Bash", "Read"],
    "output_format": "json",
    "max_budget_usd": 10
  }'
```

Response:
```json
{
  "task_id": "task_abc123",
  "status": "queued",
  "expected_duration": "5 minutes"
}
```

### Use Cases

- **Webhook triggers**: Deploy when PR merges → trigger test suite via dispatch
- **Scheduled automation**: Cron job calls dispatch to run nightly analysis
- **Application integration**: SaaS app requests code review from Claude

### Polling Results

```bash
curl https://api.claude-code.dev/dispatch/task_abc123/result \
  -H "Authorization: Bearer $CLAUDE_API_KEY"
```

---

## 6. Scheduled Tasks

Run recurring Claude Code jobs on Anthropic's infrastructure.

### Create a Scheduled Task

Use the web dashboard or CLI:

```bash
claude --schedule-task \
  --name "nightly-code-review" \
  --prompt "Run security audit on all Python files" \
  --cron "0 2 * * *" \
  --tools "Bash,Grep,Read"
```

Or via API:

```bash
curl -X POST https://api.claude-code.dev/scheduled-tasks \
  -H "Authorization: Bearer $CLAUDE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "daily-linting",
    "prompt": "Run eslint on all JS files and report violations",
    "schedule": "0 9 * * *",
    "tools": ["Bash", "Grep"],
    "timezone": "America/New_York"
  }'
```

### Use Cases

| Task | Schedule | Purpose |
|------|----------|---------|
| Security audit | Daily at 2 AM | Scan code for vulnerabilities |
| Dependency check | Weekly Mon | Check for outdated packages, security patches |
| Code quality report | Daily at 9 AM | Generate metrics, identify tech debt |
| Performance baseline | Weekly Fri | Run benchmarks, track regressions |
| Changelog reminder | Monthly 1st | Verify changelogs are up-to-date |

### Task Results

Results are delivered via:
- Email notification
- Webhook to your system
- Available via API

---

## 7. Messages API Essentials (Reference)

> This section is **reference material** for developers building applications *with* Claude. Code examples are designed for copy-paste — skim during the workshop, take home for later.

### SDK Installation

```bash
# Python
pip install anthropic

# TypeScript / Node.js
npm install @anthropic-ai/sdk
```

### Basic API Call

```python
import anthropic

client = anthropic.Anthropic()  # uses ANTHROPIC_API_KEY env var

message = client.messages.create(
    model="claude-sonnet-4-6-20250414",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Explain the SOLID principles in 5 sentences."}
    ]
)
print(message.content[0].text)
```

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // uses ANTHROPIC_API_KEY env var

const message = await client.messages.create({
  model: "claude-sonnet-4-6-20250414",
  max_tokens: 1024,
  messages: [
    { role: "user", content: "Explain the SOLID principles in 5 sentences." }
  ],
});
console.log(message.content[0].text);
```

### Tool Use (Function Calling)

Define tools as JSON Schema — Claude decides when to call them and returns structured arguments.

```python
import anthropic, json

client = anthropic.Anthropic()

tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a city",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "City name"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },
            "required": ["city"]
        }
    }
]

response = client.messages.create(
    model="claude-sonnet-4-6-20250414",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in Munich?"}]
)

# Claude returns a tool_use block — your app calls the actual API
for block in response.content:
    if block.type == "tool_use":
        print(f"Call {block.name} with {json.dumps(block.input)}")
```

### Structured Output (JSON Schema)

Force Claude to return data matching a specific schema:

```python
response = client.messages.create(
    model="claude-sonnet-4-6-20250414",
    max_tokens=1024,
    messages=[{"role": "user", "content": "List 3 design patterns for microservices"}],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "patterns",
            "schema": {
                "type": "object",
                "properties": {
                    "patterns": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {"type": "string"},
                                "description": {"type": "string"},
                                "when_to_use": {"type": "string"}
                            },
                            "required": ["name", "description", "when_to_use"]
                        }
                    }
                },
                "required": ["patterns"]
            }
        }
    }
)
```

### Extended Thinking

Enable Claude's chain-of-thought reasoning — visible to the developer:

```python
response = client.messages.create(
    model="claude-sonnet-4-6-20250414",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000  # max tokens for thinking
    },
    messages=[{"role": "user", "content": "Design a rate limiter for a REST API"}]
)

for block in response.content:
    if block.type == "thinking":
        print("Reasoning:", block.thinking)
    elif block.type == "text":
        print("Answer:", block.text)
```

### Streaming

Stream responses token-by-token for real-time UIs:

```python
with client.messages.stream(
    model="claude-sonnet-4-6-20250414",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a Python quicksort"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

### Prompt Caching

Cache large, reusable context blocks (system prompts, documents) for cost reduction:

```python
response = client.messages.create(
    model="claude-sonnet-4-6-20250414",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are an expert on our company's 200-page API specification...",
            "cache_control": {"type": "ephemeral"}  # cache this block
        }
    ],
    messages=[{"role": "user", "content": "How does the /users endpoint handle pagination?"}]
)
# Subsequent calls with same system prompt use cache — up to 90% cheaper
```

### Quick Reference

| Feature | Key Parameter | Availability |
|---------|--------------|-------------|
| Basic chat | `messages`, `model`, `max_tokens` | All models |
| Tool use | `tools` array | All models |
| Structured output | `response_format.json_schema` | All models |
| Extended thinking | `thinking.budget_tokens` | Sonnet 4.6, Opus 4.6 |
| Streaming | `.stream()` / `stream=True` | All models |
| Prompt caching | `cache_control` on content blocks | All models |
| Batch API | `client.batches.create()` | All models |
| Vision | Image content blocks (`base64` or `url`) | All models |

---

## 8. Agent SDK: Embedding Claude in Your Tools

For teams building custom tools, the **Agent SDK** provides programmatic access to Claude Code.

### Installation

```bash
npm install @anthropic-ai/claude-agent-sdk
```

### Basic Usage

```typescript
import { Agent, Bash, Read, Edit } from "@anthropic-ai/claude-agent-sdk";

const agent = new Agent({
  model: "opus",
  tools: [new Bash(), new Read(), new Edit()],
  systemPrompt: "You are a DevOps expert."
});

const result = await agent.run({
  prompt: "Analyze the Dockerfile for best practices",
  allowedTools: ["Read", "Grep"],
  maxTurns: 5
});

console.log(result.summary);
```

### Features

The Agent SDK provides:

- **Full tool access**: All built-in tools (Bash, Read, Edit, Grep, Glob, WebFetch, WebSearch)
- **Permissions**: Define which tools are allowed per agent instance
- **Hooks**: Register lifecycle hooks (PreToolUse, PostToolUse, etc.)
- **Subagents**: Spawn subagents from within your agent
- **MCP servers**: Connect to external tools
- **Memory**: Persistent user/project/local memory scopes
- **Streaming**: Stream token output for real-time feedback

### Use Cases

- Embed Claude Code into your IDE or editor
- Build custom CI/CD tools with Claude integration
- Create agentic workflows for enterprise teams
- Expose Claude to non-developers through a custom UI

### Example: Custom PR Review Tool

```typescript
import { Agent, Read, Grep } from "@anthropic-ai/claude-agent-sdk";
import { GitHub } from "./github-api";

async function reviewPullRequest(prNumber: number) {
  const agent = new Agent({
    systemPrompt: "You are a senior code reviewer"
  });

  const result = await agent.run({
    prompt: `Review PR #${prNumber} for:
      1. Security vulnerabilities
      2. Performance issues
      3. Code quality
      4. Test coverage`,
    allowedTools: [Read.name, Grep.name]  // Read-only
  });

  // Post review to GitHub
  await GitHub.postComment(prNumber, result.summary);
}

reviewPullRequest(42);
```

---

> 🏢 **Reply Context:** At BMW Aftersales (VDPM), headless mode enables:
>
> - **GitHub Actions PR Review**: Automatic security checks on every PR to BMW repos
> - **Terraform Validation Pipeline**: CI step that validates HCL and enforces standards
> - **Nightly Code Audit**: Scheduled task runs security scan at 2 AM, reports to #platform-team
> - **Dispatch-Triggered Tests**: Deploy webhook triggers test suite via dispatch API
> - **Agent SDK Integration**: Custom VDP-portal tool embeds Claude for on-demand code analysis
>
> Example GitHub Actions workflow for BMW:
> ```yaml
> - name: Claude Code Terraform Check
>   run: |
>     claude -p "Validate Terraform and check for security issues" \
>       --allowedTools "Read,Bash" \
>       --output-format json > /tmp/tf-check.json
>
>     # Parse results, fail if critical issues
>     python scripts/check-terraform-results.py /tmp/tf-check.json
> ```

---

## Hands-On Exercise (5 min)

### Write a Simple GitHub Action for Automated PR Review

**Goal:** Create a GitHub Actions workflow that uses Claude Code to review pull requests.

#### Step 1: Create the Workflow File

Create `.github/workflows/claude-pr-review.yml`:

```yaml
name: Claude Code PR Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  pull-requests: write
  contents: read

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Claude Code Review
        env:
          CLAUDE_API_KEY: ${{ secrets.CLAUDE_API_KEY }}
        run: |
          # Install Claude Code (adjust for your environment)
          # npm install -g claude-code || pip install claude-code

          # Run review in headless mode
          REVIEW=$(claude -p "Review this PR for:
            - Security issues
            - Code quality
            - Best practices

            Provide a concise summary suitable for a GitHub comment." \
            --output-format text \
            --allowedTools "Read,Grep" \
            --dangerously-skip-permissions)

          # Save review to file
          echo "$REVIEW" > /tmp/review.txt

      - name: Post Review Comment
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('/tmp/review.txt', 'utf8');

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## Claude Code Review\n\n${review}`
            });
```

#### Step 2: Add API Key as Secret

In your GitHub repo:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `CLAUDE_API_KEY`
4. Value: Your Claude API key
5. Click **Add secret**

#### Step 3: Test the Workflow

Create a test pull request:
```bash
git checkout -b test-claude-action
# Make a small code change
git commit -am "Test: Add sample function"
git push origin test-claude-action
```

Go to GitHub → **Pull requests** → Create PR.

Watch the **Claude Code PR Review** action run. Once complete, Claude's review appears as a comment on the PR.

#### Step 4: Refine

Customize the prompt and tools based on your needs:
- For security focus: add `bandit`, `snyk` tools
- For style: use `--system-prompt "Emphasize code style and consistency"`
- For performance: focus on algorithmic efficiency

---

## Summary

| Concept | Key Point |
|---------|-----------|
| **Headless Mode** | `claude -p "prompt"` for non-interactive execution |
| **Output Formats** | text, json, stream-json, JSON schema validation |
| **Session Management** | Resume, fork, name sessions for programmatic control |
| **CI/CD** | GitHub Actions, GitLab CI, Jenkins — integrate Claude reviews |
| **Parallelization** | Worktrees for parallel independent work, background tasks |
| **Dispatch** | REST API for triggering Claude tasks from external systems |
| **Scheduled Tasks** | Recurring jobs on Anthropic infrastructure (cron-like) |
| **Messages API** | SDK for Python/TypeScript — tool use, structured output, extended thinking, streaming, caching |
| **Agent SDK** | Node.js library for embedding Claude in custom tools |

---

## Closing

You've now covered the full Claude Code Deep Dive:

1. **M01** — The Claude Ecosystem (context and products)
2. **M02** — Installation & Setup
3. **M03** — Core Concepts & Tools
4. **M04** — Project Memory & Context
5. **M05** — Skills: Custom Workflows
6. **M06** — Subagents & Agent Teams (delegation)
7. **M07** — MCP: External Connections
8. **M08** — Hooks: Guaranteeing Determinism
9. **M09** — CLI & Headless Mode (this module)

### Next Steps

- **Explore your codebase** with Claude Code
- **Define custom skills** for your team's workflows
- **Set up subagents** for specialized roles
- **Integrate MCP servers** (GitHub, Jira, databases)
- **Create hooks** for guardrails and automation
- **Automate CI/CD** with headless mode
- **Share knowledge** with your team via CLAUDE.md

Claude Code is a productivity multiplier. Use it to automate routine work, explore unfamiliar codebases, and focus on high-value decisions.

Happy coding!
