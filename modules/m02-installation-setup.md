# Module 2 — Installation & Setup (15 min)

> *From zero to first session*



## Contents

- [Learning Objectives](#learning-objectives)
- [1. Installation Methods](#1-installation-methods)
- [2. System Requirements](#2-system-requirements)
- [3. Post-Installation Verification](#3-post-installation-verification)
- [4. Authentication Methods](#4-authentication-methods)
- [5. First Launch](#5-first-launch)
- [6. IDE Extensions](#6-ide-extensions)
- [Hands-On Exercise (5 min)](#hands-on-exercise-5-min)
- [Summary](#summary)


## Learning Objectives

By the end of this module, participants will be able to:

- Install Claude Code using the recommended method for their OS
- Verify the installation and diagnose any issues
- Authenticate against Claude API, AWS Bedrock, or Google Vertex AI
- Install and configure the VS Code extension
- Start their first interactive session

---

## 1. Installation Methods

Claude Code is available across multiple platforms. Below are the recommended methods for each OS.

### Native Installer (Recommended)

The easiest way to get started — a prebuilt binary for your OS.

```bash
# macOS, Linux, Windows (PowerShell)
curl -fsSL https://claude.ai/install.sh | bash
```

**What it does:**
- Downloads the appropriate binary for your OS and architecture (x64, ARM64)
- Installs to `/usr/local/bin/claude` (macOS/Linux) or `%ProgramFiles%\Claude\` (Windows)
- Adds `claude` to your PATH automatically
- No dependencies required (not even Node.js)

**Verify installation:**
```bash
claude --version
# Output: Claude Code 1.2.3 (build abc1234)
```

### Homebrew (macOS / Linux)

If you prefer package managers:

```bash
brew install --cask claude-code
```

**Update:**
```bash
brew upgrade claude-code
```

### WinGet (Windows)

For Windows users with WinGet installed:

```powershell
winget install Anthropic.Claude
```

### NPM (Legacy)

If you already have Node.js 18+ and prefer npm:

```bash
npm install -g @anthropic-ai/claude-code
```

> **Note:** This method requires Node.js to be installed and is no longer the recommended approach. Use the native installer instead for better performance.

---

## 2. System Requirements

| Requirement | Details |
|-------------|---------|
| **macOS** | 13.0 (Ventura) or later, Intel or Apple Silicon |
| **Windows** | 10 (build 1809) or Windows 11, x64 or ARM64 |
| **Linux** | Ubuntu 20.04+, Debian 11+, or other glibc-based distros (x64 or ARM64) |
| **RAM** | 4 GB minimum (8 GB recommended) |
| **Disk Space** | ~200 MB for installation + workspace files |
| **Node.js** | Only required if using npm install method (18.0+) |
| **Internet** | Required for authentication and API calls |

---

## 3. Post-Installation Verification

After installing, verify everything works correctly:

```bash
# Check version
claude --version

# Run diagnostic
claude doctor

# Check for updates
claude update

# Start an interactive session
claude
```

### The `claude doctor` Output

```
Claude Code v1.2.3 Diagnostic
✓ Binary version: 1.2.3
✓ Platform: macOS 14.2
✓ Terminal: zsh
✓ Disk space: 45 GB free
✓ Network connectivity: OK
✓ API connection: OK
✓ Authentication method: Browser login
ℹ Context budget: 200K tokens remaining today
```

---

## 4. Authentication Methods

Claude Code supports multiple ways to authenticate. Choose the one that fits your setup.

| Method | Setup | Use Case |
|--------|-------|----------|
| **Browser Login** (default) | Run `claude`. A browser window opens to log in. Token saved locally. | Most users — simple and secure. Personal subscriptions (Pro, Max). |
| **API Key** (env var) | Set `ANTHROPIC_API_KEY=sk-ant-...` | Automated workflows, CI/CD, shared machines. Requires API key from console.anthropic.com |
| **AWS Bedrock** | Set `AWS_PROFILE` or use AWS credentials in `~/.aws/credentials`. Choose Bedrock model in `/model` menu. | Enterprise customers using Bedrock. Requires IAM permissions for `bedrock:InvokeModel`. |
| **Google Vertex AI** | Set `GOOGLE_APPLICATION_CREDENTIALS=/path/to/sa-key.json`. Choose Vertex model in `/model` menu. | Enterprise customers using Google Cloud. Requires service account with Vertex API enabled. |

### Setting an API Key (Linux/macOS)

```bash
export ANTHROPIC_API_KEY=sk-ant-XXXXX
claude  # Now uses API key auth instead of browser login
```

**Make it persistent:**
```bash
echo 'export ANTHROPIC_API_KEY=sk-ant-XXXXX' >> ~/.bashrc
source ~/.bashrc
```

### Windows (PowerShell)

```powershell
$env:ANTHROPIC_API_KEY = "sk-ant-XXXXX"
claude
```

**Make it persistent:**
```powershell
[Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "sk-ant-XXXXX", "User")
```

---

## 5. First Launch

### Starting Your First Session

```bash
claude
```

This drops you into an interactive session with a prompt:

```
Claude Code v1.2.3
Session: laughing-hopeful-feynman
Model: claude-opus-4.6
Cost: $0.00

›
```

**What you can do:**
- Type a prompt (e.g., `Create a Python script that fetches weather data`)
- Use slash commands (e.g., `/help`, `/model`, `/cost`)
- Reference files with `@` (e.g., `@file.py`)
- Use Bash commands with `!` prefix (e.g., `!ls`)

### Explore the Help Menu

```bash
/help
```

**Common commands:**
- `/model` — Switch between Opus, Sonnet, Haiku
- `/cost` — View session usage and costs
- `/context` — Inspect loaded files and token usage
- `/compact [focus]` — Summarize context to save tokens
- `/clear` — Clear the conversation
- `/rewind` — Restore the last checkpoint (Esc×2 also works)

---

## 6. IDE Extensions

### VS Code Extension

1. **Install:** Open VS Code → Extensions → Search "Claude Code" → Install official extension
2. **Authenticate:** Follow the login prompt or paste your API key
3. **Usage:**
   - Select code → right-click → "Ask Claude"
   - View inline diffs when Claude edits files
   - Use the Checkpoint Viewer to navigate between snapshots
   - Run `claude` in the integrated terminal for full sessions

> The VS Code extension is **optional** — you can use Claude Code entirely from the terminal. The extension adds IDE convenience but is not required.

---

## Hands-On Exercise (5 min)

### Install & Verify

**Step 1: Install Claude Code**

Choose your method:
- **macOS:** `curl -fsSL https://claude.ai/install.sh | bash`
- **Windows:** Use WinGet or download from Claude.ai
- **Linux:** Same as macOS (curl install script)

**Step 2: Verify Installation**

```bash
# Run diagnostic
claude doctor

# Expected output: All checks should show ✓
```

**Step 3: Authenticate**

- Run `claude` — a browser window opens
- Log in with your Anthropic account
- Return to the terminal — authentication is cached

**Step 4: Run Your First Command**

```bash
claude "What is my current working directory?" !pwd
```

Expected output: Claude should read the `pwd` output and tell you the directory.

**Step 5: Explore the Help**

```bash
claude
# Then in the session:
/help
/model
/cost
/context
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| `command not found: claude` | Restart your terminal or re-run the install script. Check `$PATH` with `echo $PATH`. |
| `Authentication failed` | Clear the cache: `rm -rf ~/.claude/credentials.json`, then run `claude` again. |
| `SSL certificate error` | Update your OS certificates or set `SSL_CERT_FILE` if behind a proxy. |
| `Network timeout` | Check internet connection. If behind a proxy, ensure `HTTP_PROXY` is set. |

---

## Summary

| Task | Command |
|------|---------|
| **Install** | `curl -fsSL https://claude.ai/install.sh \| bash` (or Homebrew/WinGet) |
| **Verify** | `claude doctor` |
| **Authenticate** | `claude` (browser login) or set `ANTHROPIC_API_KEY` env var |
| **Start Session** | `claude` or `claude "your prompt"` |
| **IDE Integration** | Install VS Code extension (optional) |
| **Check Version** | `claude --version` |
| **Update** | `claude update` or `brew upgrade claude-code` |

**Next steps:** You now have Claude Code running. Module 3 covers the interactive session workflow, tools, and agentic loop.

