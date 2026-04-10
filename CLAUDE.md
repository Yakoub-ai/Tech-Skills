# Tech Hub Skills System

This project is a hierarchical multi-agent orchestration framework with **200+ production-ready skills** across **31 agents**. It uses lazy loading to maintain 95% token efficiency while providing expert-level guidance across all technical domains.

## Available Commands

| Command | Routes To | Use For |
|---------|-----------|---------|
| `/orchestrator` | Orchestrator | Full analysis, multi-domain tasks, complex projects |
| `/ai` | AI/ML Lead | Chatbots, RAG, LLMs, ML models, predictions |
| `/platform` | Platform Lead | DevOps, CI/CD, cloud, containers, infrastructure |
| `/security` | Security Lead | Security audits, compliance, PII, IAM |
| `/data` | Data Lead | Pipelines, ETL, databases, governance |
| `/product` | Product Lead | Features, UI, APIs, testing, documentation |

## How the Agent System Works

### Architecture: Orchestrator -> Leads -> Specialists

```
User Request
    |
    v
Orchestrator (analyzes, plans, coordinates)
    |
    v
Lead Agents (5 domain experts: AI/ML, Platform, Security, Data, Product)
    |
    v
Specialist Agents (26 deep experts, each with 5-13 skills)
    |
    v
Skill Documentation (loaded on-demand from .claude/skill-docs/)
```

### Workflow: Brainstorm -> Plan -> Implement

Every task follows this structured approach:

1. **Brainstorm**: Deeply understand the request. Explore the project. Identify constraints, risks, implicit requirements. Ask clarifying questions if gaps exist.
2. **Plan**: Scan registries to identify needed skills. Select minimum specialists (typically 3-7). Define milestones and dependencies. Present plan for user approval.
3. **Implement**: Execute step by step, loading skill docs on demand. Validate each step. Adapt if blockers arise. Synthesize results.

## Context-First Protocol

Before acting on any request, ALWAYS:

1. **Explore the project** — Understand file structure, tech stack, frameworks, and conventions
2. **Read key project files** — package.json, pyproject.toml, Cargo.toml, tsconfig.json, or equivalent
3. **Identify existing patterns** — Naming conventions, directory structure, test patterns, code style
4. **Understand what exists** — Search for related implementations before creating new ones

Reference: `.claude/agents/CONTEXT-PROTOCOL.md` for the full exploration protocol.

## Skill Loading Protocol

**NEVER load all skills at once.** Follow lazy loading:

1. **Scan registries** (~350 tokens total):
   - `.claude/agents/SKILL-REGISTRY.md` — Skill IDs + keywords by domain
   - `.claude/agents/ROLE-REGISTRY.md` — Role summaries + when to invoke
2. **Match request keywords** to skill IDs (e.g., "RAG chatbot" -> ai-02, ai-04, sa-01)
3. **Load expert guidance** only for activated roles: `Read('.claude/skill-docs/[role].md')`
4. **Load detailed implementation** only when executing: `Read('.claude/roles/[role]/skills/[skill-id]/README.md')`
5. **Unload after use** — Don't retain full skill docs in context after step completes

## Subagent Spawning Protocol

When delegating work to lead agents or specialists, use the Agent tool with full context:

```
Agent({
  subagent_type: "[Agent Name]",  // Must match agent's "name" in frontmatter
  description: "[Brief task description]",
  prompt: "PROJECT CONTEXT:
    - Tech stack: [languages, frameworks, databases]
    - Structure: [key directories and their purpose]
    - Conventions: [naming, style, patterns observed]

  TASK: [What to do and why]

  SKILL DOCS TO LOAD:
    - Read .claude/skill-docs/[role].md for [skill-id] guidance
    - Read .claude/roles/[role]/skills/[skill-id]/README.md for implementation details

  CONSTRAINTS: [What not to modify, patterns to follow]

  QUALITY GATES:
    - [Specific verification criteria]

  REPORT FORMAT:
    - Files created/modified with paths
    - Verification checks performed
    - Mandatory collaborations satisfied
    - Issues or follow-up needs"
})
```

### Parallel vs. Sequential Execution

- **Parallel**: Spawn multiple Agent calls in a single message when agents are independent (e.g., security review and frontend scaffolding can run simultaneously)
- **Sequential**: Run one after another when output feeds input (e.g., security assessment BEFORE data processing)
- **Rule**: If agent B needs agent A's results, run sequentially. Otherwise, maximize parallelism.

## User Communication Protocol

- **Ask BEFORE starting** when the request is ambiguous or has multiple valid interpretations
- **Ask BEFORE high-risk actions** like production deployments, data deletion, or breaking changes
- **Ask WHEN multiple approaches exist** and the tradeoffs matter to the user
- **Report AFTER milestones** with progress summaries at key checkpoints
- **Report AFTER completion** with final summary and next steps
- **Don't ask** about obvious implementation details, style choices, or decisions within agent expertise

Reference: `.claude/agents/USER-PROTOCOL.md` for the full protocol.

## Quality Gates

Before completing any task, verify:

- [ ] Mandatory collaborations satisfied (security for PII, cost for cloud, QA for code)
- [ ] Existing tests still pass (if applicable)
- [ ] New code follows project conventions
- [ ] No secrets exposed in code or configs
- [ ] Documentation updated (if applicable)

Reference: `.claude/agents/QUALITY-GATES.md` for the full checklist.

## Mandatory Collaboration Rules

These are ENFORCED, not optional:

| If Task Involves | Must Include | Skill |
|-----------------|-------------|-------|
| Personal data / PII | Security Lead | sa-01 (PII Detection) |
| Production deployment | Security Lead + Platform Lead | sa-03, do-01 |
| Cloud resources | FinOps | fo-01 (Cost Visibility) |
| Code changes | QA Engineer | qa-02 (Test Automation) |
| API modifications | QA Engineer | qa-03 (Integration Tests) |
| Data processing | Data Governance | dg-01 (Catalog), dg-02 (Lineage) |

## Key File Locations

| Purpose | Path |
|---------|------|
| Orchestrator agent | `.claude/agents/orchestrator-agent.md` |
| Lead agents | `.claude/agents/[domain]-lead.md` |
| Specialist agents | `.claude/agents/specialists/[name]-agent.md` |
| Execution protocol | `.claude/agents/EXECUTION.md` |
| Skill registries | `.claude/agents/SKILL-REGISTRY.md`, `ROLE-REGISTRY.md` |
| Expert guidance | `.claude/skill-docs/[role].md` |
| Detailed skills | `.claude/roles/[role]/skills/[id]/README.md` |
| Quality gates | `.claude/agents/QUALITY-GATES.md` |
| Safety hooks | `.claude/hooks/` |
| Settings | `.claude/settings.json` |
