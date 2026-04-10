# Tech Hub Orchestrator Command

Invoke the Tech Hub Orchestrator to analyze your request and coordinate the right agents and skills.

## Usage

```
/orchestrator [your request]
```

## What This Command Does

1. **Explores** your project to understand structure, tech stack, and conventions
2. **Analyzes** your request to identify domains, complexity, and requirements
3. **Selects** optimal skills from 200+ available across 31 agents
4. **Plans** the implementation with milestones and presents for approval
5. **Executes** by spawning lead agents with full context, in parallel where possible
6. **Validates** results against quality gates before reporting completion

## Examples

```
/orchestrator Build a RAG chatbot for internal knowledge base
/orchestrator Create CI/CD pipeline with security scanning
/orchestrator Implement data pipeline with quality checks
/orchestrator Build full-stack app with authentication
```

## How It Works

The orchestrator follows the **Brainstorm → Plan → Implement** workflow:

1. Scans `.claude/agents/SKILL-REGISTRY.md` to match keywords to skill IDs
2. Loads expert guidance from `.claude/skill-docs/` for selected roles
3. Spawns lead agents (AI/ML, Platform, Security, Data, Product) as needed
4. Leads coordinate specialists for deep technical execution
5. Quality gates are verified before completion

Full definition: `.claude/agents/orchestrator-agent.md`
