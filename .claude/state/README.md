# State Management System

This directory provides **session persistence and continuity** for the Tech Hub orchestration framework. It enables multi-session autonomous work with context integrity guarantees.

## Files

| File | Purpose | Lifecycle |
|------|---------|-----------|
| `ROADMAP.md` | Long-term task decomposition and progress tracking | Created during Plan phase; updated after each milestone; persists across all sessions |
| `SESSION.md` | Current session decisions, artifacts, and blockers | Created at session start; updated during execution; overwritten each session |
| `CHECKPOINT.md` | File hashes and verification data for drift detection | Updated after each orchestrator phase and batch completion |
| `HANDOFF.md` | Compressed context for session transitions | Created at session end or when context needs compression |

## Session Lifecycle

```
START SESSION
    |
    v
Check ROADMAP.md exists?
    |
    +--> NO: Fresh project. Normal orchestrator flow.
    |
    +--> YES: Continuation session.
              |
              v
         Load state files:
           - HANDOFF.md (compressed context from last session)
           - ROADMAP.md (big picture, what's done, what's next)
           - CHECKPOINT.md (file hashes for verification)
              |
              v
         Verify integrity:
           - Compare file hashes (detect drift)
           - Re-explore drifted files
           - Validate prior decisions still apply
              |
              v
         Resume from ROADMAP.md:
           - Identify current phase/milestone
           - Continue execution
              |
              v
EXECUTE (with checkpoints after each batch)
    |
    v
CHECKPOINT (save state, update roadmap)
    |
    v
Context growing large? --> Compress into HANDOFF.md
    |
    v
END SESSION
    |
    v
Write final HANDOFF.md + CHECKPOINT.md
    |
    v
NEXT SESSION (repeat from top)
```

## Key Principles

1. **Append-only decisions**: The ROADMAP.md decisions log never deletes entries. Invalidated decisions are marked "Still Valid: No" with explanation.
2. **Hash-based verification**: CHECKPOINT.md stores SHA256 hashes of all tracked files. On resume, hashes are recomputed and compared to detect drift.
3. **Minimal handoff**: HANDOFF.md contains only what's needed to resume — not raw agent outputs or intermediate exploration results.
4. **Orchestrator-managed**: Only the orchestrator reads/writes state files. Leads and specialists don't interact with state directly.

## Protocol Reference

See `.claude/agents/SESSION-PROTOCOL.md` for the full continuity protocol including:
- Session start/resume flow
- Checkpoint protocol
- Roadmap management rules
- Context compression and handoff format
- Drift detection and anti-rot verification
