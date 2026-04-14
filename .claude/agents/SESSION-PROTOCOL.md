# Session Continuity Protocol

This protocol enables **autonomous multi-session orchestration** with context integrity guarantees. It defines how the orchestrator saves state, resumes work, detects drift, and compresses context across session boundaries.

## Core Principle

```
NEVER start from scratch when prior work exists.
NEVER trust prior state without verification.
ALWAYS checkpoint before context boundaries.
```

---

## 1. Session Start Flow

When the orchestrator begins any task, it first checks for existing state.

### Step 1: Check for Existing State

```
Read .claude/state/ROADMAP.md

If ROADMAP.md is empty/template-only:
  → This is a FRESH PROJECT
  → Proceed to normal Phase 1 (Understand)
  → Skip remaining steps

If ROADMAP.md has project data:
  → This is a CONTINUATION
  → Proceed to Step 2
```

### Step 2: Load State Files

Read these files in order:

```
1. .claude/state/HANDOFF.md    — Compressed context from last session
2. .claude/state/ROADMAP.md    — Big picture: phases, milestones, decisions
3. .claude/state/CHECKPOINT.md — File hashes and execution position
4. .claude/state/SESSION.md    — Last session's detailed log (if exists)
```

Extract from state:
- **Current phase and milestone** (from ROADMAP.md)
- **File integrity data** (from CHECKPOINT.md)
- **Compressed context** (from HANDOFF.md)
- **Prior decisions** (from ROADMAP.md decisions log)

### Step 3: Verify Integrity (Drift Detection)

Run the drift detection protocol (see Section 4 below).

### Step 4: Report to User

```
## Session Resumed

**Project**: [name]
**Resuming at**: Phase [X], Milestone [Y]
**Integrity**: Verified [N] files — [M] unchanged, [K] drifted

[If drifted]:
**Drifted files**: [list]
**Impact**: [which decisions are affected]
**Action**: Re-analyzing affected areas before continuing.

[If clean]:
**Status**: All prior state verified. Continuing from [next step].

Shall I proceed?
```

Wait for user confirmation before executing.

---

## 2. Checkpoint Protocol

Checkpoints capture the full execution state so work can resume from any point.

### When to Checkpoint

| Trigger | Action |
|---------|--------|
| Orchestrator phase completes (Understand/Plan/Execute/Verify) | Full checkpoint |
| Batch of parallel agents completes | Incremental checkpoint |
| Before context compression | Full checkpoint |
| User requests pause | Full checkpoint |
| Blocker encountered | Checkpoint + blocker report |

### What to Save

Write `.claude/state/CHECKPOINT.md` with:

```markdown
---
checkpoint_id: [YYYY-MM-DD-HHMMSS]
phase: [understand|plan|execute|verify]
step: [specific step description]
---

# Checkpoint: [checkpoint_id]

## Current Position
- **Phase**: [phase name]
- **Step**: [what was just completed]
- **Next**: [what comes next]

## Decisions Made This Session
| Decision | Reasoning | Reversible |
|----------|-----------|------------|
| [what] | [why] | [yes/no] |

## File Integrity
| File | SHA256 | Status |
|------|--------|--------|
| [path] | [hash] | [created/modified/unchanged] |

## Artifacts Created
- [file path]: [purpose]

## Quality Gates
- [x] [gate that passed]
- [ ] [gate still pending]

## Mandatory Collaborations
- [x] [collaboration completed]
- [ ] [collaboration pending]

## Blockers
- [None / description of blocker]
```

### How to Compute File Hashes

```bash
sha256sum [file_path] | awk '{print $1}'
```

Track hashes for:
- All files created during this session
- All files modified during this session
- Key project files referenced in decisions (e.g., package.json, config files)

### Checkpoint Update Rules

1. **Overwrite** CHECKPOINT.md on each checkpoint (only latest matters for resumption)
2. **Append** to ROADMAP.md decisions log (never delete prior entries)
3. **Update** ROADMAP.md milestone status (mark completed milestones)
4. **Update** SESSION.md with current session log

---

## 3. Roadmap Management

The roadmap is the persistent source of truth across all sessions.

### Creation

The orchestrator creates ROADMAP.md during the Plan phase when:
- The task will span multiple sessions
- The task has 3+ phases or milestones
- The user explicitly requests long-term tracking

### Format

```markdown
# Project Roadmap: [Project Name]

## Goal
[One-sentence objective]

## Timeline
- **Created**: [date]
- **Last Updated**: [date]
- **Estimated Sessions**: [number]

---

### Phase 1: [Name] - STATUS: [done|active|pending]
- [x] Milestone 1.1: [description] (Session: [id], Date: [date])
- [ ] Milestone 1.2: [description]
  - Depends on: [milestone IDs]
  - Assigned to: [lead agent]

### Phase 2: [Name] - STATUS: [pending]
- [ ] Milestone 2.1: [description]
  - Depends on: 1.2
  - Assigned to: [lead agent]

---

### Decisions Log
| # | Decision | Reasoning | Session | Date | Still Valid |
|---|----------|-----------|---------|------|-------------|
| 1 | [what was decided] | [why] | [session-id] | [date] | Yes |

### Risk Register
| Risk | Impact | Mitigation | Status |
|------|--------|------------|--------|
| [risk] | [high/med/low] | [mitigation plan] | [open/mitigated/closed] |
```

### Update Rules

1. **Milestones**: Mark `[x]` when completed, add session ID and date
2. **Decisions**: Append-only. Never delete. Mark "Still Valid: No" with explanation if invalidated
3. **Risks**: Update status as risks are mitigated or materialize
4. **Phase status**: Update as phases begin (`active`) and complete (`done`)
5. **Last Updated**: Always update the timestamp

---

## 4. Drift Detection & Anti-Rot Protocol

This protocol prevents context rot by verifying that prior state is still accurate.

### On Session Resume

```
1. Read CHECKPOINT.md → extract file hashes

2. For EACH tracked file:
   a. Check if file still exists
      - Missing: Mark as DELETED_DRIFT
   b. Compute current SHA256
   c. Compare with stored hash
      - Match: Mark as VERIFIED
      - Mismatch: Mark as CONTENT_DRIFT

3. Categorize results:
   - VERIFIED: [count] files unchanged — prior analysis trustworthy
   - CONTENT_DRIFT: [count] files changed — must re-analyze
   - DELETED_DRIFT: [count] files removed — decisions may be invalid

4. For CONTENT_DRIFT files:
   a. Re-read the file
   b. Identify what changed (diff against prior understanding)
   c. Check ROADMAP.md decisions log:
      - Does any decision depend on this file?
      - If yes: mark "Still Valid" = "No — file changed, needs re-evaluation"
   d. Re-plan affected steps

5. For DELETED_DRIFT files:
   a. Check if file was moved (search for similar filename)
   b. If moved: update references
   c. If truly deleted: invalidate dependent decisions
   d. Flag to user for confirmation

6. Report findings:
   "Verified [X] files. [Y] unchanged, [Z] drifted.
    [List of drifted files and impact assessment]"
```

### During Execution

Even within a session, verify assumptions before acting on cached information:

1. Before applying a decision from a prior phase, verify the referenced file hasn't changed
2. Before modifying a file that another agent also targets, re-read it first
3. If a quality gate references specific line numbers, re-verify they're still accurate

### Anti-Hallucination Rules

1. **Never reference a file without reading it** — even if you "remember" its contents
2. **Never assume a prior decision is valid** without checking "Still Valid" in ROADMAP.md
3. **Never skip drift detection** on session resume — even if "nothing should have changed"
4. **Always re-run tests** after resuming from a checkpoint — tests are the ultimate verification

---

## 5. Context Compression & Handoff

When context grows large or a session ends, compress into a handoff document.

### When to Compress

| Trigger | Action |
|---------|--------|
| Session ending (task incomplete) | Mandatory handoff |
| Many agent results accumulated | Compress intermediate results |
| User requests pause | Handoff + checkpoint |
| Approaching context limits | Compress and continue |

### What to Preserve vs Drop

**PRESERVE** (include in HANDOFF.md):
- Current project state summary (1-3 sentences)
- Key decisions with reasoning (carry forward)
- Tech stack, conventions, critical file paths
- Architecture decisions that constrain future work
- What was completed (with file paths)
- Exact next steps with dependencies
- Verification checklist for next session

**DROP** (do NOT include):
- Raw agent outputs (already synthesized)
- Intermediate exploration results (already acted upon)
- Superseded decisions (marked "Still Valid: No" in ROADMAP.md)
- Full file contents (reference paths instead)
- Verbose quality gate logs (just pass/fail status)

### Handoff Format

```markdown
# Session Handoff

## Session Info
- **Session ID**: [timestamp or identifier]
- **Date**: [YYYY-MM-DD]
- **Project**: [name]
- **Duration**: [approximate]

## Where We Are
[1-3 sentences describing the current state of the project]

## What Was Done This Session
- [Concise list of completed work]
- [Include file paths for all created/modified files]

## Key Decisions (Carry Forward)
| Decision | Reasoning | Applies To |
|----------|-----------|------------|
| [what] | [why] | [which phases/milestones] |

## Active Context
- **Tech Stack**: [languages, frameworks, databases]
- **Conventions**: [naming, style, patterns]
- **Critical Files**: [paths that matter for next steps]
- **Architecture**: [key design decisions]

## Next Session Should
1. [First priority — be specific]
2. [Second priority]
3. [Dependencies or blockers to check first]

## Verification Checklist
- [ ] File hashes in CHECKPOINT.md match current state
- [ ] Decisions in ROADMAP.md still valid
- [ ] No new commits by others that conflict with our work
- [ ] Test suite still passes
- [ ] No new issues filed that affect our roadmap
```

### Handoff Quality Check

Before finalizing a handoff, verify:
1. A fresh agent reading ONLY HANDOFF.md + ROADMAP.md + CHECKPOINT.md could resume work
2. No critical context is lost — everything needed is either in the handoff or referenced by file path
3. Next steps are specific enough to act on without re-asking the user
4. Verification checklist covers all assumptions that could break

---

## 6. Session Log (SESSION.md)

The session log is a detailed record of the current session's activity.

### Format

```markdown
# Session Log

## Session Info
- **Started**: [timestamp]
- **Project**: [name]
- **Resuming From**: [checkpoint_id or "fresh start"]
- **Drift Detected**: [none / list of drifted files]

## Activity Log
### [HH:MM] Phase 1: Understand
- Explored project structure
- Identified tech stack: [...]
- Scanned registries, matched skills: [skill-ids]

### [HH:MM] Phase 2: Plan
- Selected roles: [list]
- Execution batches: [summary]
- User approved plan

### [HH:MM] Phase 3: Execute
- Batch 1: [agents spawned, results summary]
- Checkpoint saved: [checkpoint_id]
- Batch 2: [agents spawned, results summary]
- Checkpoint saved: [checkpoint_id]

### [HH:MM] Phase 4: Verify
- Tests: [pass/fail]
- Quality gates: [all passed / list failures]

## Artifacts Created
- [file path]: [purpose]

## Decisions Made
- [decision]: [reasoning]

## Issues Encountered
- [issue]: [resolution or status]
```

---

## 7. Integration with Orchestrator

The orchestrator's workflow becomes a 5-phase cycle:

```
Phase 0: Resume Check ← NEW
  |
  v
Phase 1: Understand (with state-aware exploration)
  |
  v
Phase 2: Plan (create/update ROADMAP.md)
  |
  v
Phase 3: Execute (checkpoint after each batch)
  |
  v
Phase 4: Verify & Synthesize (save final state, create handoff)
```

### Phase 0 Details

```
1. Check .claude/state/ROADMAP.md
   - Empty/template → Fresh project → Phase 1
   - Has data → Continuation → Load state

2. Load state:
   a. Read HANDOFF.md (compressed context)
   b. Read ROADMAP.md (phases, milestones, decisions)
   c. Read CHECKPOINT.md (file hashes, position)

3. Verify integrity:
   a. Run drift detection (Section 4)
   b. Validate decisions still apply
   c. Report to user

4. Resume:
   a. Set current phase/step from ROADMAP.md
   b. Load context from HANDOFF.md
   c. Continue from next pending step
```

### Checkpointing in Phase 3

After each execution batch:
1. Compute SHA256 hashes for all artifacts
2. Write CHECKPOINT.md
3. Update ROADMAP.md milestone status
4. Update SESSION.md activity log
5. If context is growing large: create HANDOFF.md, report to user

### State Saving in Phase 4

After verification completes:
1. Update ROADMAP.md (mark milestones done, log decisions)
2. Write final CHECKPOINT.md with all file hashes
3. If more work remains: write HANDOFF.md for next session
4. Report completion summary to user with next steps

---

## 8. Error Recovery

### Corrupted State Files

If any state file is malformed or unreadable:
1. Report the corruption to the user
2. Attempt to reconstruct from other state files (ROADMAP + CHECKPOINT can reconstruct HANDOFF)
3. If reconstruction fails: treat as fresh start with user confirmation
4. Never silently ignore corrupted state

### Conflicting State

If ROADMAP.md and CHECKPOINT.md disagree (e.g., roadmap says Phase 2 active but checkpoint says Phase 3):
1. Trust CHECKPOINT.md for execution position (more recently updated)
2. Update ROADMAP.md to match
3. Report the discrepancy to the user

### Lost Session

If HANDOFF.md is missing but ROADMAP.md and CHECKPOINT.md exist:
1. Reconstruct context from ROADMAP.md decisions log
2. Re-explore files listed in CHECKPOINT.md
3. Build a fresh HANDOFF.md
4. Proceed with caution — verify more assumptions than usual
