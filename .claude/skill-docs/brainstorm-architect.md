# Brainstorm Architect - Expert Guidance

Expert techniques for solution discovery, architecture exploration, and project strategy.

## Available Skills

| Skill ID | Name | Purpose |
|----------|------|---------|
| bs-01 | Solution Discovery | Understand the problem space, ask targeted questions, identify constraints |
| bs-02 | Architecture Research | Cross-domain research using skill registries, evaluate patterns and technologies |
| bs-03 | Tradeoff Analysis | Generate and compare viable approaches against constraints |
| bs-04 | Architecture Recommendation | Synthesize research into concrete, actionable architecture with roadmap |

## Trigger Keywords

```yaml
brainstorm, architecture, solution, design, approach: → bs-01, bs-02, bs-03, bs-04
"what should I use", "best way to", "how should I": → bs-01, bs-02
compare, tradeoff, versus, "should I use X or Y": → bs-03
recommend, proposal, blueprint, strategy: → bs-04
"help me think through", "figure out": → bs-01, bs-03
```

---

## bs-01: Solution Discovery

### Purpose
Deeply understand the problem before proposing solutions.

### Protocol

1. **Parse the stated request** — What did they literally ask for?
2. **Identify implicit needs** — What will they obviously need but didn't mention?
3. **Explore the project** — What already exists? What are the constraints?
4. **Ask targeted questions** — Maximum 5, only if the answer changes the recommendation
5. **Document assumptions** — What you assumed and why

### Question Quality Checklist

```yaml
GOOD questions (ask these):
  - "Are you targeting 100 or 10K+ concurrent users?" (changes architecture)
  - "Does this need to handle PII?" (changes security requirements)
  - "Is this replacing an existing system?" (changes migration strategy)

BAD questions (don't ask these):
  - "What language do you want?" (check the project — it's already decided)
  - "Should I use TypeScript?" (check existing config files)
  - "What's your budget?" (too vague — ask about specific tradeoffs instead)
```

### Anti-Patterns
- Asking more than 5 questions (analysis paralysis)
- Asking questions you could answer by reading project files
- Asking opinion questions instead of constraint questions
- Starting to recommend before understanding the problem

---

## bs-02: Architecture Research

### Purpose
Research the solution space efficiently using the skill registry system.

### Protocol

1. **Scan registries** (~400 tokens total):
   ```
   Read('.claude/agents/SKILL-REGISTRY.md')
   Read('.claude/agents/ROLE-REGISTRY.md')
   ```
2. **Map problem to domains** — Which leads/specialists are relevant?
3. **Load expert guidance** — Only the skill-docs files, not full implementation docs
4. **Extract patterns** — Architecture patterns, anti-patterns, technology recommendations
5. **Cross-reference** — Identify synergies, tensions, dependencies across domains

### Token Budget

```yaml
registry_scan: ~400 tokens (always)
expert_guidance: ~1000-2000 tokens per domain (load 2-4 relevant domains)
project_exploration: ~500-1000 tokens (targeted reads)
total_budget: <5000 tokens for research phase
```

### What to Extract from Skill Docs

For each relevant domain, extract:
- **Architecture patterns** that apply to this problem
- **Technology recommendations** with pros/cons
- **Anti-patterns** to avoid
- **Mandatory pairings** (security, cost, compliance requirements)
- **Scale considerations** (what changes at 10x, 100x)

### Anti-Patterns
- Loading all skill docs (token waste)
- Reading implementation docs during brainstorming (premature detail)
- Researching domains not relevant to the problem
- Spending more than 5,000 tokens on research reads

---

## bs-03: Tradeoff Analysis

### Purpose
Generate and evaluate multiple viable approaches.

### Protocol

1. **Generate 2-3 approaches** — Each must be genuinely viable, not strawmen
2. **Define each clearly** — Architecture, stack, strengths, weaknesses
3. **Score against constraints** — Evaluate each against the user's actual situation
4. **Identify the winner** — Be decisive; recommend ONE approach

### Evaluation Framework

```yaml
dimensions:
  - matches_existing_stack: Does it work with what's already built?
  - scales_to_target: Can it handle the expected load?
  - team_can_maintain: Does the team have skills for this?
  - budget_appropriate: Does it fit the cost constraints?
  - time_to_value: How fast to first working version?
  - security_posture: Does it meet security/compliance needs?
  - migration_path: Can we get from here to there?
  - ecosystem_maturity: Are the tools production-ready?
```

### How to Compare Technologies

```yaml
DO:
  - Compare against specific project constraints
  - Reference real performance characteristics
  - Consider operational complexity (not just development)
  - Factor in team expertise and hiring market

DON'T:
  - Compare technologies in the abstract (always in context)
  - Recommend based on popularity alone
  - Ignore operational costs (monitoring, maintenance, upgrades)
  - Present false equivalences (some options are clearly better for specific cases)
```

### Anti-Patterns
- Presenting only one option (not a real analysis)
- Making all options seem equal (be decisive)
- Including strawman options for appearance of choice
- Ignoring the user's existing stack and constraints

---

## bs-04: Architecture Recommendation

### Purpose
Deliver a clear, concrete, actionable architecture recommendation.

### Protocol

1. **State the recommendation clearly** — Lead with the answer, not the analysis
2. **Show the architecture** — Components, data flow, technology choices
3. **Justify key decisions** — Why THIS technology for THIS layer
4. **Provide a roadmap** — What to build first, second, third
5. **Identify risks** — What could go wrong and how to mitigate
6. **Define next steps** — Concrete first actions to start building

### Recommendation Quality Checklist

```yaml
clarity:
  - Can someone understand the architecture in 2 minutes of reading?
  - Are technology choices specific (not "use a database" but "use PostgreSQL because...")?
  - Is the implementation roadmap concrete (not "build the backend" but "create the user API with these endpoints")?

completeness:
  - Security considerations addressed?
  - Cost profile estimated?
  - Scalability path defined?
  - Monitoring/observability mentioned?
  - Compliance requirements noted?

actionability:
  - First three concrete steps defined?
  - Which orchestrator agents/skills to invoke for implementation?
  - Which phase to tackle first and why?
```

### Mandatory Checks Before Finalizing

Every recommendation MUST address:

| Check | Question | If Yes |
|-------|----------|--------|
| PII/Personal data | Does this handle user data? | Flag sa-01, GDPR/HIPAA compliance |
| Cloud resources | Does this deploy to cloud? | Flag fo-01 cost tracking |
| Customer-facing AI | Does this use LLMs for users? | Flag ai-04 guardrails |
| Data processing | Does this process data at scale? | Flag dg-01 catalog, dg-02 lineage |
| Production deployment | Will this go to production? | Flag sa-03, do-01 CI/CD |

### Anti-Patterns
- Recommending without exploring the existing project
- Proposing architecture that fights the existing codebase
- Leaving key decisions as "it depends" (commit to a recommendation)
- Forgetting operational concerns (monitoring, cost, maintenance)
- Over-engineering for current scale (design for 10x, not 1000x)

---

## Cross-Domain Synergies

Common brainstorming patterns that span multiple domains:

```yaml
RAG_Application:
  domains: [AI/ML, Data, Security, Platform]
  key_skills: [ai-02, de-02, sa-01, do-01]
  critical_decision: "Embedding model + vector DB choice drives everything"

Microservices_Architecture:
  domains: [Backend, Platform, Security, Data]
  key_skills: [be-01, do-02, sa-04, db-01]
  critical_decision: "Service boundaries and inter-service communication"

Data_Platform:
  domains: [Data, Platform, Security, FinOps]
  key_skills: [de-01, do-03, sa-01, fo-01]
  critical_decision: "Batch vs streaming vs lambda architecture"

Full_Stack_App:
  domains: [Product, Backend, Frontend, Security]
  key_skills: [pd-01, be-01, fe-01, sa-05]
  critical_decision: "Monolith vs separated frontend/backend"

ML_Pipeline:
  domains: [AI/ML, Data, MLOps, Platform]
  key_skills: [ds-01, de-02, mo-01, do-01]
  critical_decision: "Training infrastructure and model serving strategy"
```
