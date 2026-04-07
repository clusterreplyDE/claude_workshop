# Module 11 — Claude Code Remote & Web (15 min)

> *Claude Code without local installation*

## Learning Objectives

By the end of this module, participants will be able to:

- Understand Claude Code Web as a browser-based alternative to local installation
- Recognize when Remote execution is preferable to Local execution
- Use one-way handoffs between web and terminal environments
- Explore cloud features: Ultraplan, parallel execution, auto-fix
- Understand limitations and security boundaries of Remote environments

---

## 1. Claude Code in the Browser

Claude Code is available directly in your browser at **[claude.ai/code](https://claude.ai/code)** for Max and Enterprise users.

### Browser-Based Environment

| Feature | Details |
|---------|---------|
| **Access** | Navigate to claude.ai → Code tab (Max/Enterprise only) |
| **VM Environment** | Isolated Linux VM provisioned on-demand |
| **Setup Scripts** | Run initialization scripts (install dependencies, clone repos) |
| **Network** | Can reach external URLs (API calls, git clone, npm install) |
| **No Local Installation** | Works on any device — no `claude` CLI needed |
| **Persistence** | Session snapshots, cloud storage for projects |
| **Timeout** | Idle timeout (typically 30 min), restart available |

### Cloud VM Capabilities

```
┌──────────────────────────────────────┐
│     Claude Code Web (Browser)        │
├──────────────────────────────────────┤
│   Isolated Cloud VM (Linux)          │
│   • /root/projects directory         │
│   • apt, npm, docker (limited)       │
│   • Network access (with limits)     │
│   • File storage (session-scoped)    │
│   • No persistent local state        │
└──────────────────────────────────────┘
```

---

## 2. Local vs. Remote: When to Use Which

### Decision Table

| Scenario | Recommended | Reason |
|----------|-------------|--------|
| **Onboarding a new team member** | Remote | No setup needed; works immediately on any device |
| **Pair programming with a colleague** | Remote | Share cloud session, no local sync needed |
| **Quick prototyping** | Remote | Fast spin-up, no dependency headaches |
| **Heavy Docker/Kubernetes work** | Local | More control over local daemon, faster iterates |
| **Air-gapped network (no internet)** | Local | Remote requires cloud connectivity |
| **Using local dev tools (custom linters)** | Local | Tools installed on your machine |
| **Large codebase (GBs of files)** | Local | Faster I/O than remote VM |
| **Testing in production environment** | Local | Direct access to prod-like setup |
| **Prototyping before committing to dev setup** | Remote | Try without installing anything |
| **CI/CD integration** | Either | Both modes work; CI runs Local often |

### When Remote Shines

1. **Zero setup** — Open browser, start coding
2. **Multi-device** — same cloud session on laptop, desktop, iPad
3. **Collaboration** — share session link with team members
4. **Isolation** — code changes don't affect local machine

### When Local Is Better

1. **Performance** — faster file I/O, direct hardware access
2. **Integration** — use local tools (IDEs, Docker daemon)
3. **Offline** — work without internet
4. **Security** — sensitive code stays on your machine

---

## 3. One-Way Handoffs: Bridging Web & Terminal

Claude Code supports **teleporting sessions** between web and terminal environments.

### Web → Terminal: `--teleport`

Start a session in the browser, then move it to your local terminal:

```bash
# In Claude Code Web, you see a session ID and teleport URL
# Example: https://claude.ai/code?teleport=abc123def456

# Copy that URL, then in your terminal:
claude --teleport abc123def456

# The session continues locally with your cloud work preserved
# You now have full access to local tools and faster execution
```

### Terminal → Web: `--remote`

Start locally, then switch to browser for collaboration:

```bash
# Start session locally
$ claude

> # ... you do some work, commit to git
> /git commit -m "WIP: auth refactor"

# Exit the session, then resume on web
$ claude --remote session-id

# Opens https://claude.ai/code?session=session-id
# Your work is synced; others can view/collaborate
```

### Use Cases

| Handoff | Scenario |
|--------|----------|
| **Web → Terminal** | Prototype in cloud, then need local Docker for heavy builds |
| **Terminal → Web** | Debugging a gnarly issue; invite a colleague to pair on web |
| **Back & forth** | Alternate between local dev and cloud pair sessions |

---

## 4. Ultraplan: Draft in the Cloud

**Ultraplan** lets you draft complex plans in the cloud before running them locally.

```bash
# In Claude Code Web, you can preview:
claude --plan --ultraplan "refactor auth module"

# Ultraplan stages:
# 1. Claude drafts a multi-step plan
# 2. You review in the web UI
# 3. You approve, then execute locally with --teleport

# Benefits:
# - See the plan before committing resources
# - Get feedback from teammates on the approach
# - Execute with confidence locally once approved
```

---

## 5. Parallel Execution: Multiple Tasks at Once

Run independent tasks concurrently in the cloud:

```bash
# Cloud environment allows running multiple sessions in parallel
# Useful for:
# - Running tests in one session while coding in another
# - Parallel CI/CD checks (lint, test, build simultaneously)
# - Background tasks (documentation generation) while you focus on main code

# Example workflow:
$ claude --background "/test src/**/*.test.ts"
Background task started: bg-test-12345
# ... you keep coding in foreground session

$ claude --background "/docs generate"
Background task started: bg-docs-67890

# Check status anytime
$ claude --background list
bg-test-12345: Running (45s elapsed)
bg-docs-67890: Queued

# Results are merged into your main session once complete
```

---

## 6. Auto-Fix: Watching CI Failures

Claude Code can monitor CI/CD and automatically fix failures:

```bash
# Enable auto-fix mode (GitHub/GitLab integration)
claude --auto-fix --watch-ci

# When CI fails:
# 1. Claude fetches failure logs
# 2. Analyzes the error
# 3. Creates a fix branch and commits changes
# 4. Opens a PR with the fix

# Example flow:
$ claude --auto-fix --watch-ci
Watching main branch CI...

[GitHub] Main branch build failed: "eslint: 5 errors"
Analyzing errors...
  - src/auth.ts:42 - unused variable
  - src/payment.ts:89 - SQL injection risk
  - ...

Creating fix branch auto-fix/eslint-main-20240405...
  ✓ Fixed 5 linting errors
  ✓ Committed changes
  ✓ Opened PR: Auto-fix ESLint errors

# You review and merge the PR when ready
```

### Configuration

```json
{
  "auto-fix": {
    "enabled": true,
    "watch-branches": ["main", "develop"],
    "ci-platform": "github",
    "rules": {
      "eslint": { "auto_fix": true },
      "security-scan": { "auto_fix": false, "notify": true },
      "coverage": { "auto_fix": false, "alert_threshold": 80 }
    }
  }
}
```

---

## 7. Remote Control: Share Sessions

Invite teammates to view (or pair on) your cloud session:

```bash
# In Claude Code Web, generate a share link
$ /session share --read-only
Share link: https://claude.ai/code/session/abc123?access=viewer

# Or for read-write pair programming
$ /session share --edit
Share link: https://claude.ai/code/session/abc123?access=editor

# Teammates click the link, see your code in real-time
# Editors can make changes; viewers can only watch

# Named sessions for team continuity
$ claude --remote-control-session-name-prefix "team-auth-refactor-"

# Creates team-auth-refactor-2024-04-05 that persists across restarts
```

---

## 8. Teleported Sessions & VS Code Integration

Seamlessly move between VS Code and Claude Code Web:

```bash
# In VS Code with Claude Code extension:
# You can "teleport to web" to share code
# Or "teleport from web" to get fast local execution

# Example workflow:
# 1. Open VS Code, start Claude Code session
# 2. Work locally (fast, full IDE integration)
# 3. Right-click → "Share session on web"
# 4. Colleague reviews on web
# 5. Merge back to your local session

# Configuration in .claude/settings.json
{
  "teleport": {
    "auto_sync": true,
    "include_uncommitted": true
  }
}
```

---

## 9. Cowork: Desktop Agent for Knowledge Workers

**Cowork** is a desktop app (Research Preview) for non-technical users and knowledge workers.

### What Is Cowork?

| Feature | Details |
|---------|---------|
| **Interface** | Graphical desktop app (macOS, Windows) |
| **No coding knowledge** | Use plain English to describe tasks |
| **Local file access** | Read PDFs, spreadsheets, documents from your computer |
| **Multi-step workflows** | Research on web → create deliverable locally |
| **VM-based sandbox** | Runs in isolated cloud VM like Claude Code Web |
| **Output generation** | Creates Word docs, Excel spreadsheets, PowerPoints |
| **No terminal needed** | Click buttons, fill forms, describe goals in English |

### Cowork vs. Claude Code

| Aspect | Cowork | Claude Code |
|--------|--------|-------------|
| **User skill** | Non-technical (managers, analysts) | Developers, technical users |
| **Interface** | GUI / menu-driven | Terminal / text prompts |
| **Input** | English descriptions, file uploads | Code, terminal commands, prompts |
| **Output** | Documents, presentations, spreadsheets | Code, scripts, configs |
| **Integration** | File system, limited web | Full terminal, git, APIs |

### Cowork Workflow Example

```
1. Manager: "Create a Q1 sales report from these spreadsheets"
   ↓
2. Cowork reads uploaded Excel files
   ↓
3. Claude analyzes data, generates insights
   ↓
4. Creates a polished PowerPoint with charts
   ↓
5. Manager downloads and presents
```

---

## 10. Remote Environment Limitations

### Constraints to Know

| Limitation | Impact | Workaround |
|------------|--------|-----------|
| **Storage** | Session data cleared after idle timeout | Export/snapshot before timeout |
| **Docker** | Limited Docker access (some restrictions) | Use pre-built containers, or go Local |
| **GPU** | No GPU access in cloud VM | Use Local for ML workloads |
| **Permissions** | Cannot modify system-level config | Use Local for system changes |
| **Network** | Outbound to public URLs only (no VPN) | Use Local for air-gapped or VPN-required networks |
| **Performance** | Slower than Local for I/O-heavy tasks | Use Local for large files or builds |

### Security Boundaries

```
┌─────────────────────────────────────┐
│    Claude Code Web (Isolated VM)    │
├─────────────────────────────────────┤
│ ✓ Can read/write files in /root     │
│ ✓ Can make network calls (public)   │
│ ✗ Cannot access your local files    │
│ ✗ Cannot see your other cloud VMs   │
│ ✗ Cannot escalate to host system    │
└─────────────────────────────────────┘

Each session = fresh, isolated Linux container
Your code & data stay within that container
Sessions auto-expire after inactivity
```

---

## 11. Demo: Remote Session in Action

*(Live demo — no hands-on at this stage)*

**Scenario:** A developer uses Claude Code Web to prototype a feature:

```
1. Navigate to claude.ai/code
2. Create new project or clone existing repo
   (setup runs automatically)
3. Start coding: "Create a REST API for user authentication"
4. Claude plans, implements, tests
5. Colleague joins via shared link (no setup needed)
6. Both pair review the code
7. Developer teleports to terminal: --teleport abc123
8. Local execution continues with Docker builds
9. Final PR created and merged
```

---

## Summary

| Feature | Remote Web | Local Terminal |
|---------|------------|--------|
| **Setup** | None (browser only) | Install CLI |
| **Access** | Any device, browser | Your machine only |
| **Speed** | Medium (network latency) | Fast (direct access) |
| **Collaboration** | Native (share links) | Via handoff or git |
| **Local tools** | Limited (pre-installed) | Full (Docker, custom tools) |
| **Offline** | No | Yes |
| **Best for** | Onboarding, pairing, prototyping | Heavy builds, local integration |

**Key Takeaway:** Claude Code is flexible. Use Remote for quick starts and collaboration, Local for performance and control. Both are equally valid.

**Up next:** Module 12 — Settings, Configuration & Security.
