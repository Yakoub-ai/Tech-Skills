# Agent Definition Schema

This document defines the standard structure for all agents in the Tech Hub Skills system. Every agent — lead or specialist — follows this schema.

## Frontmatter (Required)

```yaml
---
name: "[Agent Name]"          # Must match subagent_type used to spawn this agent
model: "sonnet" | "haiku"     # sonnet for leads, haiku for specialists
description: "[One-line description of expertise and responsibilities]"
---
```

## Agent Body Structure

### For Lead Agents

```markdown
# [Agent Name] Agent

[1-2 sentence role description]

## Your Specialists
[Table: Specialist | Expertise | Skills]

## Activation Protocol

When spawned as a subagent, follow these steps:

### Step 1: Parse Context
Read your spawn prompt to extract: project context, task description,
constraints, skill docs to load, quality gates, report format.

### Step 2: Load Expert Guidance
Read('.claude/skill-docs/[relevant-role].md')
Focus on the skills identified in the task.

### Step 3: Plan Specialist Work
- Identify which specialists are needed
- Determine execution order (dependencies)
- Group independent specialists for parallel spawning
- Check mandatory collaborations

### Step 4: Spawn Specialists
Use the Agent tool with full context for each specialist.
Spawn independent specialists in parallel (multiple Agent calls in one message).
Run dependent specialists sequentially.

### Step 5: Validate Results
Check each specialist's report:
- ARTIFACTS present?
- QUALITY gates passed?
- COLLABORATIONS satisfied?
If not, iterate via SendMessage.

### Step 6: Synthesize & Report
Combine specialist results into a cohesive report for the orchestrator.

## Specialist Delegation Template
[How to spawn each specialist with proper context]

## Parallel vs Sequential
[Which specialists can run in parallel, which must be sequential]

## Mandatory Collaborations
[Required cross-domain checks with enforcement]

## Skill Chains
[Pre-defined workflows for common tasks]
```

### For Specialist Agents

```markdown
# [Agent Name] Agent

[1-2 sentence role description]

## Your Skills
[Table: Skill ID | Name | Auto-Execute level]

## Activation Protocol

When spawned as a subagent, follow these steps:

### Step 1: Parse Context
Read your spawn prompt to extract: project context, task description,
skill IDs to apply, constraints, quality gates, report format.

### Step 2: Load Skill Documentation
Read the skill docs specified in your prompt:
- Read('.claude/skill-docs/[role].md') for expert guidance
- Read('.claude/roles/[role]/skills/[skill-id]/README.md') for implementation details

### Step 3: Explore Project
Before modifying anything:
- Read relevant existing files in the project
- Search for existing patterns to follow (Grep, Glob)
- Understand conventions already in use
- Identify what can be reused

### Step 4: Execute
Apply skill knowledge to the task:
- Follow best practices from skill docs
- Match existing project conventions
- Create/modify files as needed

### Step 5: Verify
Run quality checks appropriate to the project:
- Tests pass
- Linting clean
- No regressions

### Step 6: Report
Return results in the format requested by parent:
COMPLETED, ARTIFACTS, QUALITY, COLLABORATIONS, NOTES

## Mandatory Collaborations
[What this specialist must NOT skip]

## Example Tasks
[Common task patterns with skill IDs]
```

## Automation Decision Matrix

Agents use this matrix to determine auto-execute vs. approval:

### Risk Assessment

| Factor | Score 0 (Low) | Score 1 (Medium) | Score 2 (High) | Score 3 (Critical) |
|--------|--------------|-------------------|-----------------|---------------------|
| Scope | Single file | Multiple files | Cross-module | Cross-system |
| Reversibility | Easy undo | Moderate effort | Difficult | Impossible |
| Data Impact | Read-only | Modify config | Modify data | Delete/corrupt |
| Security | No secrets | Access control | Credentials | PII exposure |
| Production | Dev/test | Staging | Production-adjacent | Production |

### Action Thresholds

```
Risk Score = sum of all factors (0-15)

Score 0-3:   Auto-execute (report what was done)
Score 4-7:   Show plan first, then execute
Score 8-11:  Request confirmation before proceeding
Score 12+:   Require explicit user approval
```

## Communication Protocol

### Between Parent and Child Agents

- Parent spawns child via `Agent` tool with full context in prompt
- Child returns result to parent as tool call output
- Parent continues child via `SendMessage` if iteration needed
- Children NEVER communicate directly with each other

### Between Agent and User

- Only the orchestrator (or top-level agent) talks to the user
- Specialists report questions to their lead, leads report to orchestrator
- Use AskUserQuestion for critical gaps, not for routine decisions
- Follow `.claude/agents/USER-PROTOCOL.md`

## Quality Gate Enforcement

Every agent must verify quality gates before reporting completion. Reference `.claude/agents/QUALITY-GATES.md` for the full checklist. Key requirements:

1. **Code quality**: Follows conventions, no linting errors, no type errors
2. **Testing**: Existing tests pass, new tests added where appropriate
3. **Security**: No secrets exposed, PII handled, inputs validated
4. **Collaborations**: All mandatory cross-domain checks satisfied or flagged
