# Module 12 — Claude Code Remote & Web (10 min)

> *Claude Code without local installation*

## Learning Objectives

By the end of this module, participants will be able to:

- Understand Claude Code Web as a browser-based alternative
- Recognize when Remote vs. Local is the better choice
- Know about Cowork as a desktop tool for non-developers
- Understand the limitations of remote environments

---

## 1. Claude Code in the Browser

Claude Code is available at **[claude.ai/code](https://claude.ai/code)** for Max and Enterprise users — no local installation needed.

| Feature | Details |
|---------|---------|
| **Access** | Browser → claude.ai → Code tab |
| **Environment** | Isolated Linux VM, provisioned on demand |
| **Capabilities** | Full terminal, git, npm, API access |
| **Persistence** | Session snapshots, cloud storage |
| **Requirements** | Max or Enterprise plan |

```
┌──────────────────────────────────────┐
│     Claude Code Web (Browser)        │
├──────────────────────────────────────┤
│   Isolated Cloud VM (Linux)          │
│   • /root/projects directory         │
│   • apt, npm, git available          │
│   • Network access (public URLs)     │
│   • Session-scoped file storage      │
└──────────────────────────────────────┘
```

---

## 2. Local vs. Remote: When to Use Which

| Scenario | Recommended | Why |
|----------|-------------|-----|
| **Onboarding new team member** | Remote | No setup, works immediately |
| **Quick prototyping** | Remote | Fast spin-up, no dependencies |
| **Pair programming** | Remote | Share session link |
| **Heavy Docker/K8s work** | Local | Full daemon access |
| **Air-gapped network** | Local | No cloud needed |
| **Large codebase (GBs)** | Local | Faster I/O |
| **Using custom local tools** | Local | IDEs, linters, debuggers |

**Rule of thumb:**
- **Remote** = quick starts, collaboration, any-device access
- **Local** = performance, offline, full tool integration

---

## 3. Cowork: Desktop Agent for Knowledge Workers

**Cowork** is a desktop app (Research Preview) for non-technical users.

| Aspect | Cowork | Claude Code |
|--------|--------|-------------|
| **Users** | Managers, analysts, non-devs | Developers, technical users |
| **Interface** | GUI, drag & drop | Terminal, text prompts |
| **Input** | English descriptions, file uploads | Code, commands, prompts |
| **Output** | Word docs, Excel, PowerPoint | Code, scripts, configs |

```
Example workflow:
  Manager: "Create a Q1 sales report from these spreadsheets"
  → Cowork reads Excel files
  → Analyzes data, generates insights
  → Creates polished PowerPoint with charts
  → Manager downloads and presents
```

---

## 4. Limitations

| Limitation | Impact | Workaround |
|------------|--------|-----------|
| **Storage** | Cleared after idle timeout | Export/snapshot |
| **Docker** | Limited access | Use Local |
| **GPU** | Not available | Use Local for ML |
| **Network** | Public URLs only (no VPN) | Use Local for internal systems |
| **Performance** | Slower I/O than local | Use Local for large builds |

### Security Boundaries

Each web session is a fresh, isolated Linux container. Your code stays within that container, auto-expires after inactivity, and cannot access your local files or other cloud VMs.

---

## Summary

| Feature | Remote Web | Local Terminal |
|---------|------------|----------------|
| **Setup** | None (browser) | Install CLI |
| **Access** | Any device | Your machine only |
| **Speed** | Medium | Fast |
| **Collaboration** | Native (share links) | Via git |
| **Offline** | No | Yes |
| **Best for** | Onboarding, pairing, prototyping | Heavy builds, local tools |

**Up next:** Module 13 — Settings & Security.
