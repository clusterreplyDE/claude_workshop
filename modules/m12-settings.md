# Module 12 — Settings, Configuration & Security (10 min)

> *Fine-tuning and enterprise context*

## Learning Objectives

By the end of this module, participants will be able to:

- Navigate Claude Code's five-level settings hierarchy
- Configure permission modes and rules for file operations
- Set up corporate proxy and network configurations
- Understand privacy, compliance, and data handling
- Work with managed settings in Enterprise deployments

---

## 1. Settings Hierarchy: Five Levels

Claude Code resolves settings from highest to lowest priority:

```
Level 1: Managed Settings (Enterprise only)
    ↓
Level 2: CLI Flags (e.g., --no-read, --cost-limit)
    ↓
Level 3: Local Settings File (settings.local.json)
    ↓
Level 4: Project Settings (.claude/settings.json)
    ↓
Level 5: User Settings (~/.claude/settings.json)
```

### Settings Files & Locations

| Level | File | Scope | Use Case |
|-------|------|-------|----------|
| **1. Managed** | Enforced by admin | Organization | Enterprise policies, compliance |
| **2. CLI Flags** | `--cost-limit 10` | Single session | Override for one command |
| **3. Local** | `settings.local.json` | Machine | Personal preferences, secrets (git-ignored) |
| **4. Project** | `.claude/settings.json` | Repository | Team conventions, project defaults |
| **5. User** | `~/.claude/settings.json` | Global | All repos on this machine |

### Example: Permission Mode Resolution

```
# Scenario: User runs `claude` in a project

1. Check Managed settings → any enforced mode? → use it, stop here
2. Check CLI flags → `claude --plan-only` → use plan mode
3. Check .claude/settings.json → `"mode": "plan"`? → use it
4. Check ~/.claude/settings.json → `"mode": "auto"`? → use it
5. Default → `default` mode (ask for permission)

# Result: Most restrictive setting wins
```

---

## 2. Permission Modes

Claude Code respects your control over what it can do. Configure the **permission mode** to set boundaries:

| Mode | Behavior | Use Case |
|------|----------|----------|
| **default** | Ask permission for every action (read, write, bash) | Safest; interactive workflows |
| **acceptEdits** | Auto-approve file reads/writes, ask for bash | Development; trust the code |
| **plan** | Only allow planning; no execution (`Shift+Tab`) | Review approach first |
| **auto** | Auto-approve all actions (read, write, bash) | Trusted environments, CI/CD |
| **dontAsk** | Deprecated; use `acceptEdits` or `auto` | Legacy |
| **bypassPermissions** | Admin override (dangerous; Enterprise only) | Emergency, fully supervised |

### Configuration

```json
{
  "permissions": {
    "mode": "acceptEdits"
  }
}
```

### CLI Override

```bash
# Run in plan mode for this session only
claude --plan "refactor the auth module"

# Run in auto mode (no prompts)
claude --auto "fix eslint errors"

# Use default (ask) even if .claude/settings.json says auto
claude --mode default
```

---

## 3. Permission Rules: Granular Control

Instead of a blanket mode, define **rules** for specific paths:

```json
{
  "permissions": {
    "mode": "default",
    "rules": [
      {
        "action": "Read",
        "paths": ["src/**", "docs/**"],
        "allow": true
      },
      {
        "action": "Edit",
        "paths": ["src/**/*.ts"],
        "allow": true,
        "requiresApproval": false
      },
      {
        "action": "Edit",
        "paths": ["package.json", "tsconfig.json"],
        "allow": true,
        "requiresApproval": true
      },
      {
        "action": "Bash",
        "paths": ["git *", "npm install", "npm test"],
        "allow": true
      },
      {
        "action": "Bash",
        "paths": ["rm -rf /"],
        "allow": false
      },
      {
        "action": "Read",
        "paths": [".env", "secrets/**"],
        "allow": false,
        "comment": "Never expose environment secrets"
      }
    ]
  }
}
```

### Rule Syntax

| Element | Syntax | Example |
|---------|--------|---------|
| **Action** | Read, Edit, Write, Bash, Execute | `"action": "Edit"` |
| **Path** | Glob pattern with wildcards | `"paths": ["src/**/*.ts"]` |
| **Bash command** | Exact command or pattern | `"paths": ["git *", "npm test"]` |
| **Allow/Deny** | Boolean | `"allow": true` |
| **Approval** | Require user prompt | `"requiresApproval": true` |

### Protected Directories (Built-In)

Some paths are always protected, even with `auto` mode:

```json
{
  "protectedDirectories": [
    ".husky/",
    ".git/config",
    "node_modules/.bin/",
    "/etc/",
    "/root/.ssh/"
  ]
}
```

**Why:** Prevent accidental changes to CI hooks, git config, or system files.

---

## 4. Proxy & Network Configuration

Configure Claude Code for corporate environments with proxies:

### HTTP/HTTPS Proxy

```json
{
  "network": {
    "proxy": {
      "http": "http://proxy.company.com:8080",
      "https": "https://proxy.company.com:8080",
      "noProxy": ["localhost", "127.0.0.1", "*.internal.company.com"]
    }
  }
}
```

### Environment Variables

```bash
# These can also be set in your shell
export HTTP_PROXY="http://proxy.company.com:8080"
export HTTPS_PROXY="https://proxy.company.com:8080"
export NO_PROXY="localhost,127.0.0.1"

# Or for npm/git
npm config set proxy http://proxy.company.com:8080
git config --global http.proxy http://proxy.company.com:8080
```

### Custom CA Certificates

For MITM proxies or internal CAs:

```json
{
  "network": {
    "ca": [
      "/etc/ssl/certs/company-root-ca.pem",
      "/etc/ssl/certs/company-intermediate-ca.pem"
    ]
  }
}
```

---

## 5. Cost Awareness & Token Usage

Claude Code provides transparency into usage costs:

### `/cost` Command

```bash
# View current session cost
$ claude
> /cost

Current Session:
  Tokens used: 4,521 (input) + 892 (output) = 5,413 total
  Estimated cost: $0.18 USD
  Model: Opus 4.6
  Token limit (this session): 100,000

Cumulative (this month):
  Total tokens: 487,921
  Estimated cost: $18.42
  Subscription plan: Pro ($20/mo)
  Usage: 40% of monthly allowance
```

### Cost Limits

```json
{
  "cost": {
    "sessionLimit": 10,
    "monthlyLimit": 50,
    "currencyCode": "USD",
    "warnAt": 0.8
  }
}
```

- **sessionLimit**: Max USD per session; stop if exceeded
- **monthlyLimit**: Max USD per calendar month; warn if approaching
- **warnAt**: Trigger warning at 80% of limit (e.g., warn at $8 if limit is $10)

### Subscription vs. API Billing

| Plan | Billing | Limits |
|------|---------|--------|
| **Pro** | Monthly subscription | Included usage limit |
| **Max** | Monthly subscription | 5× or 20× Pro allowance |
| **Enterprise** | Custom contract | Custom token limits |
| **API Key** | Pay-per-token | No monthly limits; charged per call |

> 🏢 **Reply Context:** BMW projects using AWS Bedrock may be charged per Bedrock usage tier, not per Anthropic subscription. Verify your billing model with your cloud admin.

---

## 6. Privacy & Compliance

### What Data Is Sent?

| Data | Sent to Anthropic? | Purpose |
|------|------------------|---------|
| **Code files** | Yes | Model context (non-persistent) |
| **Bash output** | Yes | Provides execution results |
| **Terminal history** | Yes | Helps Claude understand context |
| **User prompts** | Yes | Your instructions |
| **Session metadata** | Yes | Analytics, abuse prevention |
| **.env files** | No (unless you explicitly paste) | Secrets protection |
| **Credentials** | No (unless you explicitly paste) | Security |

### Data Deletion

```bash
# Session data is deleted after 30 days
# Conversation logs are retained per Anthropic's privacy policy
# Request deletion: support@anthropic.com

# Anonymize a session before sharing
claude --anonymize session-id
# Replaces file paths, variable names, etc. with placeholders
```

### Enterprise Data Controls

For Enterprise customers with specific compliance needs:

| Feature | Availability |
|---------|--------------|
| **Data residency** (EU, US) | Enterprise |
| **HIPAA compliance** | Enterprise |
| **SOC 2 Type II** | Enterprise |
| **Custom data retention** | Enterprise |
| **Zero-knowledge prompts** | Not available |

---

## 7. Managed Settings (Enterprise Only)

Enterprise administrators can enforce organization-wide settings via MDM or system policy:

### MDM Deployment Example

```json
{
  "managed": {
    "enforced": true,
    "settings": {
      "permissions": {
        "mode": "acceptEdits",
        "rules": [
          {
            "action": "Read",
            "paths": ["*"],
            "allow": true
          },
          {
            "action": "Bash",
            "paths": ["git *"],
            "allow": true
          },
          {
            "action": "Bash",
            "paths": ["rm -rf *", "sudo *"],
            "allow": false
          }
        ]
      },
      "network": {
        "proxy": "http://proxy.company.com:8080"
      },
      "privacy": {
        "dataResidency": "EU",
        "allowAnonymousAnalytics": false
      }
    },
    "userOverridesAllowed": false
  }
}
```

### User Behavior Under Managed Settings

```bash
# User tries to override managed permission rule
$ claude --mode auto
Error: Cannot override enforced managed setting "permissions.mode"
Please contact your administrator.

# Managed settings always win
# User can only customize non-enforced settings
```

---

## 8. Complete Settings Example

Putting it together:

```json
{
  "version": 1,
  "permissions": {
    "mode": "acceptEdits",
    "rules": [
      {
        "action": "Read",
        "paths": ["src/**", "docs/**", ".claude/**"],
        "allow": true
      },
      {
        "action": "Edit",
        "paths": ["src/**"],
        "allow": true,
        "requiresApproval": false
      },
      {
        "action": "Bash",
        "paths": ["git *", "npm test", "npm run build"],
        "allow": true
      },
      {
        "action": "Bash",
        "paths": [".env", "secrets/**"],
        "allow": false
      }
    ]
  },
  "network": {
    "proxy": {
      "http": "http://proxy.company.com:8080",
      "https": "https://proxy.company.com:8080"
    }
  },
  "cost": {
    "sessionLimit": 20,
    "monthlyLimit": 100,
    "warnAt": 0.8
  },
  "privacy": {
    "allowAnonymousAnalytics": true
  }
}
```

---

## 9. Quick Reference

### Settings Files (In Priority Order)

1. **Managed** → `/etc/claude/settings.json` (Enterprise MDM)
2. **CLI flags** → `claude --mode auto --cost-limit 10`
3. **Local** → `settings.local.json` (git-ignored, secrets safe)
4. **Project** → `.claude/settings.json` (version-controlled, team defaults)
5. **User** → `~/.claude/settings.json` (all repos on this machine)

### Permission Modes at a Glance

| Mode | Read? | Write? | Bash? | Best For |
|------|-------|--------|-------|----------|
| **default** | Ask | Ask | Ask | Safe, interactive |
| **acceptEdits** | ✓ | ✓ | Ask | Development |
| **plan** | ✓ | ✗ | ✗ | Review mode |
| **auto** | ✓ | ✓ | ✓ | CI/CD, trusted |

---

## Summary

| Topic | Key Points |
|-------|------------|
| **Hierarchy** | Managed > CLI > Local > Project > User |
| **Permissions** | Modes (default, acceptEdits, plan, auto) + granular rules |
| **Rules** | Path-based, action-based (Read, Edit, Bash) |
| **Network** | Proxy, CA certs, no-proxy lists for corporate environments |
| **Cost** | `/cost` command, session/monthly limits, subscription vs. API |
| **Privacy** | Code is sent; secrets are not. 30-day retention. Enterprise data controls. |
| **Enterprise** | Managed settings, MDM deployment, data residency, compliance |

**Up next:** Module 13 — Best Practices & Patterns, exploring how to use Claude Code effectively in teams.
