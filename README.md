# Claude Code Deep Dive Workshop

> A comprehensive, hands-on workshop covering the entire Claude Code ecosystem — from first install to CI/CD pipelines and beyond.

**Duration:** ~6 hours (09:30–16:30)
**Audience:** Developers & Solution Architects
**Format:** Guided presentation + hands-on exercises

---

## Repository Structure

```
workshop/
├── README.md                  ← You are here
│
├── modules/                   # Detailed module content (Markdown)
│   ├── 00-workshop-outline.md #   Workshop outline & schedule (v3.0)
│   ├── m01-claude-ecosystem.md#   Module 1: The Claude Ecosystem
│   ├── m02-installation-setup.md
│   ├── ...                    #   (m01–m15, one file per module)
│   └── m15-capstone.md        #   Module 15: Capstone
│
├── slides/                    # Workshop presentation (PowerPoint)
│   └── workshop.pptx          #   Single deck for the full workshop
│
├── handout/                   # Participant materials (Word / PDF)
│   ├── M01-ecosystem-reference.docx
│   ├── M02-M04-setup-session-reference.docx
│   ├── M05-M07-customization-reference.docx
│   ├── M08-M10-integration-reference.docx
│   ├── M11-M15-big-picture-reference.docx
│   └── cli-reference.md       #   Complete CLI flag & subcommand reference
│
├── exercises/                 # Hands-on materials (organized by module)
│   ├── m04-interactive-extended/
│   ├── m05-claudemd-rules/
│   ├── m06-skills-commands/
│   ├── m07-subagents/
│   ├── m08-mcp/
│   ├── m09-hooks/
│   ├── m10-cicd/
│   └── m15-capstone/
│
├── html/                      # Interactive workshop web page
│   └── index.html             #   Single-page app with schedule, modules, CLI reference
│
└── .gitignore                 # Git ignore rules
```

## What's What

| Artifact | Purpose | Audience |
|----------|---------|----------|
| **modules/** | Detailed reference material per topic (Markdown). Knowledge base, prep guide, and post-workshop download for participants. | Trainer + Participants |
| **slides/** | Single PowerPoint deck (.pptx) guiding through the full workshop. Trainer switches to terminal/tools for hands-on parts. | Trainer (on screen) |
| **handout/** | Cheat sheet with commands, examples, and quick references. Distributed as Word (.docx) and/or PDF for printing or digital use. | Participants (during workshop) |
| **exercises/** | Starter configs, sample project, and reference solutions for hands-on tasks — organized by module. | Participants (during workshop) |
| **html/** | Interactive single-page web app with schedule, expandable module cards, CLI reference, and progress tracking. | Trainer + Participants |

## Workshop Schedule

| Time | Unit | Theme |
|------|------|-------|
| 09:30–11:00 | **Unit 1: Getting Started** | Ecosystem, Setup, Interactive Sessions |
| 11:00–11:15 | Coffee Break | |
| 11:15–12:30 | **Unit 2: Making Claude Yours** | CLAUDE.md, Skills & Commands, Subagents |
| 12:30–13:30 | Lunch Break | |
| 13:30–15:00 | **Unit 3: Integration & Automation** | MCP, Hooks, CLI & Headless |
| 15:00–15:15 | Coffee Break | |
| 15:15–16:30 | **Unit 4: The Big Picture** | Plugins, Remote, Settings, Best Practices, Capstone |

## Modules

| # | Module | Duration | Type |
|---|--------|----------|------|
| M1 | The Claude Ecosystem | 20 min | Overview + Hands-on |
| M2 | Installation & Setup | 15 min | Hands-on |
| M3 | The Interactive Session | 20 min | Hands-on |
| M4 | Interactive Session Extended | 15 min | Hands-on |
| M5 | CLAUDE.md & Rules | 20 min | Hands-on |
| M6 | Skills & Commands | 30 min | Hands-on |
| M7 | Subagents | 25 min | Hands-on |
| M8 | MCP: External Connections | 35 min | Hands-on |
| M9 | Hooks & Permissions | 25 min | Hands-on |
| M10 | CLI & Headless Mode | 30 min | Hands-on + Reference |
| M11 | Plugins & Marketplace | 10 min | Demo |
| M12 | Claude Code Remote & Web | 15 min | Demo |
| M13 | Settings & Security | 10 min | Overview |
| M14 | Best Practices & Patterns | 15 min | Discussion |
| M15 | Capstone: Putting It All Together | 25 min | Hands-on |

## Prerequisites

Before attending, participants need:

- [ ] **Anthropic Account** with active plan (Pro/Max/Team) or API Key
- [ ] **Node.js** (v18+) and **npm** installed
- [ ] **Git** installed
- [ ] **VS Code** installed (recommended)
- [ ] **GitHub Account** with Personal Access Token
- [ ] Admin rights for `npm install -g`

> Claude Code installation, VS Code Extension setup, and first session are done together on-site.

## Status

| Artifact | Status |
|----------|--------|
| Workshop Outline (v3.0) | ✅ Complete |
| M1 — Claude Ecosystem | ✅ Complete |
| M2 — Installation & Setup | ✅ Complete |
| M3 — The Interactive Session | ✅ Complete |
| M4 — Interactive Session Extended | ✅ Complete |
| M5 — CLAUDE.md & Rules | ✅ Complete |
| M6 — Skills & Commands | ✅ Complete |
| M7 — Subagents | ✅ Complete |
| M8 — MCP | ✅ Complete |
| M9 — Hooks & Permissions | ✅ Complete |
| M10 — CLI & Headless | ✅ Complete |
| M11 — Plugins | ✅ Complete |
| M12 — Remote & Web | ✅ Complete |
| M13 — Settings | ✅ Complete |
| M14 — Best Practices | ✅ Complete |
| M15 — Capstone | ✅ Complete |
| Presentation (.pptx) | ✅ 47 slides |
| Handouts (.docx) | ✅ 5 reference sheets |
| Exercise materials | ✅ 8 module folders with starters + solutions |

---

## Future Topics

The following areas are **not covered** in the current workshop but are candidates for future modules or expansions:

| Topic | Description | Potential Format |
|-------|-------------|-----------------|
| Computer Use (Deep Dive) | Claude controlling browser and desktop apps, testing workflows, practical patterns | Hands-on module |
| Batch API Patterns | Production patterns for bulk processing, cost optimization, error handling, result aggregation | Reference + examples |
| Enterprise Administration | SSO/SCIM setup, audit logs, data residency, managed policies, org-level configuration | Overview module |
| Production Observability | Rate limit handling, retry strategies, monitoring dashboards, cost tracking at scale | Practical guide |
| Multi-Provider Strategy | Bedrock vs. Vertex AI vs. Direct API — architecture decisions, failover, compliance mapping | Decision guide |
| Prompt Engineering | Advanced prompting techniques, few-shot examples, chain-of-thought, evaluation and benchmarking | Workshop module |
| Migration from Other Providers | OpenAI → Claude migration patterns, SDK differences, prompt adaptation strategies | Reference guide |
