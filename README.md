# Tech Hub Skills

**200+ production-ready AI agent skills** for **Claude Code** and **GitHub Copilot**.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yakoub-ai/Tech-Skills/blob/main/LICENSE)

Features a **hierarchical multi-agent system** with a **Brainstorm → Plan → Implement** workflow, 95% token efficiency, advanced domain expertise, and **comprehensive safety guardrails** for damage control.

## Quick Install

You can install this system directly from GitHub. **No manual cloning is required** for the primary installation methods below.

### 1. For Claude Code (Agentic Orchestration)

Install the plugin directly inside Claude Code using one of these two methods:

**Option A: Fast CLI (Recommended)**
Run these commands inside your Claude Code session:
```bash
/plugin marketplace add yakoub-ai/Tech-Skills
/plugin install tech-skills@yakoub-ai
```

**Option B: Interactive Marketplace UI**
1. Open Claude Code and type `/plugin`
2. Go to the **Marketplaces** tab → **+ Add Marketplace**
3. Enter the repo URL: `https://github.com/yakoub-ai/Tech-Skills`
4. Go to the **Discover** tab → find `tech-skills` → select **Install for you**
5. Restart Claude Code

---

### 2. For GitHub Copilot (VSCode)

Add expert agent skills to your project in one command. You do **not** need to clone the repository first:

```bash
npx yakoub-ai/Tech-Skills install --copilot
```

_This creates `.github/copilot-instructions.md` that provides expert context to Copilot._

---

### 3. Advanced: Manual Setup

If you prefer to include the agent system as part of your source code, you can clone it manually:

```bash
git clone https://github.com/yakoub-ai/Tech-Skills.git
cp -r Tech-Skills/.claude/ /your/project/
cp Tech-Skills/CLAUDE.md /your/project/
```

---

## v3.0: Agent Orchestration Framework

**What's new in v3.0:**

- **CLAUDE.md bootstrap** — System activates automatically when Claude Code opens the project
- **Context-first protocol** — Agents explore and understand your project before making changes
- **Real agent execution** — Agents use Claude Code's native Agent tool for true subagent spawning
- **Parallel execution** — Independent tasks run simultaneously for faster completion
- **Quality gate enforcement** — Mandatory verification before any task is marked complete
- **User communication protocol** — Agents ask the right questions at the right time
- **Feedback loops** — Results are validated and iterated on if quality gates fail
- **marketplace.json** — Easy discovery and installation metadata

### Multi-Agent Hierarchy

```
User Request
    |
Orchestrator (analyzes, plans, coordinates)
    |
5 Lead Agents (AI/ML, Platform, Security, Data, Product)
    |
25+ Specialist Agents (each with 5-13 skills, loaded on-demand)
    |
200+ Skills (expert guidance loaded from skill-docs/)
```

### Workflow: Brainstorm → Plan → Implement

1. **Brainstorm**: Explores the project, understands requirements, identifies constraints and risks, asks clarifying questions
2. **Plan**: Scans skill registries, selects minimum specialists (3-7), defines milestones, presents plan for approval
3. **Implement**: Spawns agents with full context, executes in parallel where possible, validates quality gates, synthesizes results

---

## Usage

### Slash Commands

```bash
/orchestrator "Build a customer churn prediction model"   # Full workflow
/ai "Create a RAG chatbot"                                # AI/ML tasks
/platform "Deploy to Kubernetes with CI/CD"               # DevOps/cloud
/security "Scan for PII and vulnerabilities"              # Security
/data "Build ETL pipeline with quality checks"            # Data engineering
/product "Create user registration with tests"            # Full-stack dev
```

### Natural Language

Just describe what you need — the orchestrator automatically activates, analyzes keywords, and routes to the right agents:

```
"Build a REST API with authentication, rate limiting, and monitoring"
→ Orchestrator → Product Lead (backend) + Security Lead (auth) + Platform Lead (monitoring)
```

### GitHub Copilot

Reference roles in comments to steer Copilot:

```python
# Using AI Engineer approach for RAG pipeline
def build_rag_system():
    pass

# Apply Security Architect best practices
def handle_user_upload(file_data):
    pass
```

---

## Available Roles

| Lead | Domain | Specialists | Skills |
|------|--------|------------|--------|
| **AI/ML Lead** | AI, ML, Data Science | AI Engineer, ML Engineer, Data Scientist, MLOps | 39 |
| **Platform Lead** | Infrastructure, DevOps | DevOps, SRE, Platform Eng, Network, Docker, AWS/Azure/GCP, FinOps | 83 |
| **Security Lead** | Security, Compliance | Security Architect, Compliance Officer, Security Hardener | 23 |
| **Data Lead** | Data Engineering | Data Engineer, Data Governance, Database Admin | 26 |
| **Product Lead** | Product Development | Product Designer, Frontend/Backend Dev, QA, Tech Writer | 38 |

## Key Features

- **200+ Skills** across LLMs, RAG, MLOps, DevSecOps, Lakehouse, Cloud (AWS/Azure/GCP), and more
- **95% Token Efficiency** via lazy-loading skill registries — only loads what's needed
- **Context-First** — Agents analyze your project structure, tech stack, and conventions before acting
- **Security First** — Built-in PII detection, security hardening, and compliance automation
- **Quality Gates** — Mandatory verification including tests, linting, and security checks
- **Safety Guardrails** — File deletion protection, database safety, credential protection, audit logging
- **Parallel Execution** — Independent agents work simultaneously for faster task completion
- **Works on Any Project** — Agents adapt to your existing conventions, no configuration needed

## Project Structure

```
.claude/
  agents/                    # Agent definitions (orchestrator, leads, specialists)
    orchestrator-agent.md    # Master coordinator
    ai-ml-lead.md           # AI/ML domain lead
    platform-lead.md        # Platform/DevOps lead
    security-lead.md        # Security/compliance lead
    data-lead.md            # Data engineering lead
    product-lead.md         # Product development lead
    specialists/            # 25+ specialist agents
    EXECUTION.md            # How agents coordinate
    SKILL-REGISTRY.md       # Skill keyword index
    ROLE-REGISTRY.md        # Role summary index
    QUALITY-GATES.md        # Verification checklist
    CONTEXT-PROTOCOL.md     # Project analysis protocol
    USER-PROTOCOL.md        # User communication rules
  commands/                 # Slash command definitions
  skill-docs/               # Expert guidance (loaded on-demand)
  roles/                    # Detailed skill implementations
  hooks/                    # Safety guardrails
  settings.json             # System configuration
CLAUDE.md                   # Auto-loaded bootstrap
marketplace.json            # Installation metadata
```

## Documentation

- **Architecture**: [AGENTS.md](https://github.com/yakoub-ai/Tech-Skills/blob/main/.claude/AGENTS.md)
- **Safety Guardrails**: [SAFETY-GUARDRAILS.md](https://github.com/yakoub-ai/Tech-Skills/blob/main/SAFETY-GUARDRAILS.md)
- **GitHub Copilot**: [GITHUB_COPILOT.md](https://github.com/yakoub-ai/Tech-Skills/blob/main/GITHUB_COPILOT.md)
- **Changelog**: [CHANGELOG.md](https://github.com/yakoub-ai/Tech-Skills/blob/main/CHANGELOG.md)

## License

MIT
