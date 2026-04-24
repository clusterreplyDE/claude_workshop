# Module 13 — Settings & Security (10 min)

> *Fine-tuning and enterprise context*



## Contents

- [Learning Objectives](#learning-objectives)
- [1. Settings Hierarchy](#1-settings-hierarchy)
- [2. Permission Modes](#2-permission-modes)
- [3. Cost Awareness](#3-cost-awareness)
- [4. Privacy & Enterprise](#4-privacy-enterprise)
- [Summary](#summary)


## Learning Objectives

By the end of this module, participants will be able to:

- Navigate Claude Code's settings hierarchy
- Configure permission modes
- Understand cost awareness and token usage
- Know about privacy, compliance, and enterprise features

---

## 1. Settings Hierarchy

Claude Code resolves settings from highest to lowest priority:

```
Level 1: Managed Settings (Enterprise only)     ← Admin enforced
    ↓
Level 2: CLI Flags (--permission-mode auto, --max-budget)  ← Single session
    ↓
Level 3: Local (settings.local.json)              ← Machine, git-ignored
    ↓
Level 4: Project (.claude/settings.json)          ← Repo, team-wide
    ↓
Level 5: User (~/.claude/settings.json)           ← Global, all repos
```

| Level | File | Use Case |
|-------|------|----------|
| **Managed** | Admin-enforced | Enterprise policies |
| **CLI Flags** | `--permission-mode auto --max-budget-usd 10` | Per-session override |
| **Local** | `settings.local.json` | Personal prefs, secrets (git-ignored) |
| **Project** | `.claude/settings.json` | Team conventions |
| **User** | `~/.claude/settings.json` | Your global defaults |

**Rule:** Most specific wins. Managed > CLI > Local > Project > User.

---

## 2. Permission Modes

Control what Claude is allowed to do:

| Mode | Read | Write | Bash | Best For |
|------|------|-------|------|----------|
| **default** | Ask | Ask | Ask | Safe, interactive |
| **acceptEdits** | ✓ | ✓ | Ask | Development |
| **plan** | ✓ | ✗ | ✗ | Review approach first |
| **auto** | ✓ | ✓ | ✓ | CI/CD, trusted env |

```bash
# Set for a single session
claude --permission-mode auto

# Set for project (in .claude/settings.json)
{
  "permissions": {
    "mode": "acceptEdits"
  }
}
```

For granular control, you can define path-based **permission rules** that allow or block specific actions on specific files (e.g., allow editing `src/**` but block `.env`). See the CLI reference handout for syntax details.

---

## 3. Cost Awareness

### The `/cost` Command

```bash
> /cost

Current Session:
  Tokens: 4,521 (input) + 892 (output) = 5,413
  Estimated cost: $0.18
  Model: Opus 4.6

Monthly:
  Total: 487,921 tokens
  Estimated: $18.42
```

### Cost Limits

```json
{
  "cost": {
    "sessionLimit": 10,
    "monthlyLimit": 50,
    "warnAt": 0.8
  }
}
```

Or per-session: `claude --max-budget-usd 5`

### Billing Models

| Plan | Model |
|------|-------|
| **Pro / Max** | Monthly subscription, included usage |
| **Enterprise** | Custom contract, custom limits |
| **API Key** | Pay-per-token, no monthly cap |

---

## 4. Privacy & Enterprise

### What Data Is Sent?

Code, bash output, prompts, and session metadata are sent to Anthropic for processing. Secrets (`.env`, credentials) are **not** sent unless you explicitly include them. Session data is retained per Anthropic's privacy policy.

### Enterprise Features

| Feature | Availability |
|---------|--------------|
| **Managed settings** (admin-enforced policies) | Enterprise |
| **Data residency** (EU, US) | Enterprise |
| **HIPAA / SOC 2 compliance** | Enterprise |
| **Custom data retention** | Enterprise |
| **SSO / SCIM** | Enterprise |

Managed settings let admins enforce permission modes, proxy config, and blocked tools organization-wide — users cannot override them.

---

## Summary

| Topic | Key Points |
|-------|------------|
| **Hierarchy** | Managed > CLI > Local > Project > User |
| **Permissions** | Modes: default, acceptEdits, plan, auto |
| **Cost** | `/cost` command, session/monthly limits |
| **Privacy** | Code sent for processing; secrets not sent by default |
| **Enterprise** | Managed settings, data residency, compliance |

**Up next:** Module 14 — Best Practices & Patterns.
