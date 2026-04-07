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
├── modules/                   # Detailed module content
│   ├── 00_WORKSHOP_OUTLINE.md #   Workshop outline & schedule (v3.0)
│   ├── M01_CLAUDE_ECOSYSTEM.md#   Module 1: The Claude Ecosystem
│   ├── M02_INSTALLATION.md    #   Module 2: Installation & Setup
│   ├── ...                    #   (one file per module, M01–M14)
│   └── M14_CAPSTONE.md        #   Module 14: Capstone
│
├── slides/                    # Workshop presentation (PowerPoint)
│   └── workshop.pptx          #   Single deck for the full workshop
│
├── handout/                   # Participant materials (Word / PDF)
│   ├── M01-ecosystem-reference.docx
│   ├── M02-M03-setup-session-reference.docx
│   ├── M04-M06-customization-reference.docx
│   ├── M07-M09-integration-reference.docx
│   ├── M10-M14-big-picture-reference.docx
│   └── cli-reference.md       #   Complete CLI flag & subcommand reference
│
├── exercises/                 # Hands-on materials
│   ├── sample-project/        #   Sample repo with intentional bugs/TODOs
│   ├── configs/               #   Example CLAUDE.md, skills, hooks, MCP configs
│   └── solutions/             #   Reference solutions for exercises
│
└── _internal/                 # Project docs (not for participants)
    ├── PROJECT_BRIEFING.md    #   Workshop context, decisions, background
    └── PROJECT_INSTRUCTIONS.md#   Working instructions for content creation
```

## What's What

| Artifact | Purpose | Audience |
|----------|---------|----------|
| **modules/** | Detailed reference material per topic (Markdown). Knowledge base, prep guide, and post-workshop download for participants. | Trainer + Participants |
| **slides/** | Single PowerPoint deck (.pptx) guiding through the full workshop. Trainer switches to terminal/tools for hands-on parts. | Trainer (on screen) |
| **handout/** | Cheat sheet with commands, examples, and quick references. Distributed as Word (.docx) and/or PDF for printing or digital use. | Participants (during workshop) |
| **exercises/** | Sample project, starter configs, and reference solutions for hands-on tasks. | Participants (during workshop) |

## Workshop Schedule

| Time | Unit | Theme |
|------|------|-------|
| 09:30–11:00 | **Unit 1: Getting Started** | Ecosystem, Setup, First Session |
| 11:00–11:15 | Coffee Break | |
| 11:15–12:30 | **Unit 2: Making Claude Yours** | CLAUDE.md, Skills, Subagents |
| 12:30–13:30 | Lunch Break | |
| 13:30–15:00 | **Unit 3: Integration & Automation** | MCP, Hooks, CLI & Headless |
| 15:00–15:15 | Coffee Break | |
| 15:15–16:30 | **Unit 4: The Big Picture** | Plugins, Remote, Settings, Best Practices, Capstone |

## Modules

| # | Module | Duration | Type |
|---|--------|----------|------|
| M1 | The Claude Ecosystem | 15 min | Overview + Hands-on |
| M2 | Installation & Setup | 15 min | Hands-on |
| M3 | Interactive Session Basics | 35 min | Hands-on |
| M4 | CLAUDE.md & Rules | 20 min | Hands-on |
| M5 | Skills & Commands | 30 min | Hands-on |
| M6 | Subagents & Agent Teams | 25 min | Hands-on + Outlook |
| M7 | MCP: External Connections | 35 min | Hands-on |
| M8 | Hooks: Guaranteeing Determinism | 25 min | Hands-on |
| M9 | CLI & Headless Mode | 25 min | Hands-on |
| M10 | Plugins & Marketplace | 10 min | Demo |
| M11 | Claude Code Remote & Web | 15 min | Demo |
| M12 | Settings & Security | 10 min | Overview |
| M13 | Best Practices & Patterns | 15 min | Discussion |
| M14 | Capstone: Putting It All Together | 25 min | Hands-on |

## Prerequisites

Before attending, participants need:

- [ ] **Anthropic Account** with active plan (Pro/Max/Team) or API Key
- [ ] **Node.js** (v18+) and **npm** installed
- [ ] **Git** installed
- [ ] **VS Code** installed (recommended)
- [ ] **GitHub Account** with Personal Access Token
- [ ] Admin rights for `npm install -g`
- [ ] Network access to `api.anthropic.com` and `registry.npmjs.org`

> Claude Code installation, VS Code Extension setup, and first session are done together on-site.

## Status

| Artifact | Status |
|----------|--------|
| Workshop Outline (v3.0) | ✅ Complete |
| M1 — Claude Ecosystem | ✅ Complete |
| M2 — Installation & Setup | ✅ Complete |
| M3 — Interactive Session | ✅ Complete |
| M4 — CLAUDE.md & Rules | ✅ Complete |
| M5 — Skills & Commands | ✅ Complete |
| M6 — Subagents & Agent Teams | ✅ Complete |
| M7 — MCP | ✅ Complete |
| M8 — Hooks | ✅ Complete |
| M9 — CLI & Headless | ✅ Complete |
| M10 — Plugins | ✅ Complete |
| M11 — Remote & Web | ✅ Complete |
| M12 — Settings | ✅ Complete |
| M13 — Best Practices | ✅ Complete |
| M14 — Capstone | ✅ Complete |
| Presentation (.pptx) | ✅ 45 slides |
| Handouts (.docx) | ✅ 5 reference sheets |
| Exercise materials | ✅ Sample project + configs + solutions |
