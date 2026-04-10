# Agent Execution Protocol

This document defines how agents coordinate and execute in Claude Code. All patterns here use Claude Code's actual Agent tool mechanism — not aspirational protocols.

## How Agents Execute in Claude Code

### The Agent Tool

Claude Code uses the `Agent` tool to spawn subagents. Key facts:

1. **Subagents have NO conversation context** — everything they need must be in the `prompt` parameter
2. **Results return to the parent** — the parent receives the subagent's output as a tool result
3. **Multiple Agent calls in one message = parallel execution** — use this for independent tasks
4. **SendMessage continues a running agent** — use when you need to give follow-up instructions
5. **subagent_type matches agent frontmatter name** — e.g., `subagent_type: "AI/ML Lead"` loads the AI/ML Lead agent definition

### Agent Hierarchy

```
Orchestrator (top-level, talks to user)
    |
    |-- Agent({ subagent_type: "AI/ML Lead", ... })
    |       |-- Agent({ subagent_type: "AI Engineer", ... })
    |       |-- Agent({ subagent_type: "ML Engineer", ... })
    |
    |-- Agent({ subagent_type: "Security Lead", ... })
    |       |-- Agent({ subagent_type: "Security Architect", ... })
    |
    |-- Agent({ subagent_type: "Platform Lead", ... })
            |-- Agent({ subagent_type: "DevOps Engineer", ... })
```

Only the orchestrator (or the top-level agent) communicates with the user. All other agents communicate through their parent via tool results.

---

## Context Passing Protocol

Every subagent prompt MUST include these sections:

### 1. Project Context

```
PROJECT CONTEXT:
  Name: [project name]
  Tech Stack: [languages, frameworks, databases]
  Structure: [key directories and their purpose]
  Conventions: [naming, style, test patterns]
  Relevant Files: [specific files related to the task]
```

The orchestrator gathers this using the Context Gathering Protocol (see CONTEXT-PROTOCOL.md) and passes it to every subagent.

### 2. Task Description

```
TASK:
  What: [specific deliverable]
  Why: [business/technical reason]
  Scope: [what's in scope, what's out]
  Expected Outcome: [what success looks like]
```

### 3. Skill Loading Instructions

```
SKILL DOCS TO LOAD:
  1. Read .claude/skill-docs/[role].md — Focus on [skill-id] section
  2. Read .claude/roles/[role]/skills/[skill-id]/README.md — For implementation details
  
  Load these BEFORE starting work. Apply best practices from the docs.
```

### 4. Constraints

```
CONSTRAINTS:
  - Follow existing patterns in [file/directory]
  - Do not modify [protected files/areas]
  - Use [specific library/framework] for [purpose]
  - Match [naming convention] used in project
```

### 5. Quality Gates

```
QUALITY GATES:
  - [ ] Tests pass after changes
  - [ ] No linting errors introduced
  - [ ] [Domain-specific gates from QUALITY-GATES.md]
```

### 6. Report Format

```
REPORT FORMAT:
  When complete, report:
  - COMPLETED: [skill-ids applied]
  - ARTIFACTS: [files created/modified with paths]
  - QUALITY: [verification checks performed and results]
  - COLLABORATIONS: [mandatory checks satisfied or needed]
  - NOTES: [issues, recommendations, follow-ups]
```

---

## Orchestrator Execution Flow

### Phase 1: Understand

1. **Explore the project** using Glob, Read, Grep to understand structure and tech stack
2. **Scan registries** — Read SKILL-REGISTRY.md and ROLE-REGISTRY.md
3. **Match keywords** from the user's request to skill IDs
4. **Identify gaps** — What do you need to know that you don't?
5. **Ask the user** (via AskUserQuestion) if critical gaps exist

### Phase 2: Plan

1. **Select leads and skills** — Minimum necessary (typically 3-7 skills)
2. **Determine dependencies** — Which agents need others' output?
3. **Group into parallel batches** — Independent agents run together
4. **Define quality gates** — What must be true when each agent completes?
5. **Present plan to user** — Get approval before executing

### Phase 3: Execute

1. **Spawn lead agents** with full context (see Context Passing Protocol above)
2. **Run independent leads in parallel** — Multiple Agent calls in one message
3. **Run dependent leads sequentially** — Wait for results before spawning
4. **Review each result** — Check deliverables, quality gates, collaboration requirements
5. **Iterate if needed** — Send follow-up via SendMessage if quality gates fail

### Phase 4: Synthesize

1. **Collect all results** from lead agents
2. **Verify mandatory collaborations** — Were security, cost, QA checks done?
3. **Run final verification** — Tests pass, linting clean, no regressions
4. **Summarize for user** — What was done, what artifacts were created, next steps

---

## Lead Agent Execution Flow

When a lead agent is spawned:

### Step 1: Parse Context
Read the prompt to understand: project context, task, constraints, skill docs to load.

### Step 2: Load Expert Guidance
```
Read('.claude/skill-docs/[specialist-role].md')
```
This gives you the expert checklist, anti-patterns, and mandatory pairings for each skill.

### Step 3: Plan Specialist Work
- Identify which specialists are needed
- Determine execution order (dependencies)
- Group independent specialists for parallel spawning

### Step 4: Spawn Specialists

For parallel work (independent specialists):
```
// Single message with multiple Agent calls
Agent({ subagent_type: "AI Engineer", prompt: "..." })
Agent({ subagent_type: "Security Architect", prompt: "..." })
```

For sequential work (dependent specialists):
```
// First agent
result1 = Agent({ subagent_type: "Security Architect", prompt: "..." })
// Use result1 to inform second agent
result2 = Agent({ subagent_type: "AI Engineer", prompt: "... Security findings: {result1} ..." })
```

### Step 5: Validate Results
- Check each specialist's QUALITY and COLLABORATIONS sections
- If a mandatory collaboration is flagged as NEEDED, address it
- If quality gates failed, use SendMessage to iterate

### Step 6: Report to Orchestrator
Synthesize specialist results into a cohesive report following the REPORT FORMAT.

---

## Specialist Agent Execution Flow

When a specialist is spawned:

### Step 1: Load Knowledge
Read the skill docs specified in the prompt:
```
Read('.claude/skill-docs/[role].md')         # Expert guidance
Read('.claude/roles/[role]/skills/[id]/README.md')  # Implementation details
```

### Step 2: Explore Project Context
Using the project context from the prompt, explore relevant areas:
```
Glob('src/**/*.ts')                    # Find relevant source files
Grep('existing pattern', type: 'ts')   # Search for patterns to follow
Read('path/to/relevant/file.ts')       # Read existing implementations
```

### Step 3: Execute
Apply skill knowledge to the task:
- Follow best practices from skill docs
- Match existing project conventions
- Create/modify files as needed using Write/Edit tools

### Step 4: Verify
Run quality checks:
```
Bash('npm test')        # or equivalent for the project
Bash('npm run lint')    # or equivalent
```

### Step 5: Report
Return results in the format requested by the parent agent.

---

## Parallel Execution Rules

### When to Parallelize

Spawn multiple agents in a SINGLE message when:
- Tasks are in different domains (security review + frontend scaffold)
- Tasks touch different files/directories
- Neither task needs the other's output
- Both tasks have clear, independent deliverables

### When to Sequence

Run agents one-at-a-time when:
- Security assessment must complete BEFORE data processing
- API design must complete BEFORE frontend integration
- Database schema must be defined BEFORE ORM models
- Test strategy must be set BEFORE writing tests
- One agent's output is the other agent's input

### Dependency Matrix

```
Security Assessment  →  BEFORE  →  Data Processing, API Implementation
API Design           →  BEFORE  →  Frontend Integration, API Tests
Database Schema      →  BEFORE  →  ORM Models, Migration Scripts
Architecture Review  →  BEFORE  →  Implementation of any component
```

---

## Error Handling

### When a Specialist Fails

1. The specialist reports the failure in its result
2. The lead agent reviews the failure
3. If retryable: Lead sends a follow-up via SendMessage with corrective instructions
4. If not retryable: Lead reports to orchestrator with the blocker
5. Orchestrator adjusts the plan or asks the user

### When a Mandatory Collaboration is Missing

1. The specialist flags it: `COLLABORATIONS: NEEDED: sa-01 (PII Detection) not included`
2. The lead agent handles it by:
   - Spawning the collaboration agent (e.g., Security Architect for sa-01)
   - Including the result in its synthesis
3. If the collaboration is cross-domain, lead reports to orchestrator

### When User Input is Needed

1. The specialist flags it: `NOTES: Need user decision on [X vs Y]`
2. The lead includes it in its report to orchestrator
3. The orchestrator presents the question to the user
4. Answer flows back down: orchestrator → lead → specialist (via SendMessage)

---

## Verification Checklist

Before any agent reports completion, verify:

- [ ] All requested deliverables are present
- [ ] Quality gates from the prompt are satisfied
- [ ] Mandatory collaborations are satisfied (or flagged as NEEDED)
- [ ] No regressions introduced (existing tests still pass)
- [ ] Files are in correct locations per project structure
- [ ] Code follows project conventions
- [ ] Report follows the requested format
