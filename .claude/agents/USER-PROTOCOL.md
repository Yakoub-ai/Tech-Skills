# User Communication Protocol

This protocol defines when agents should communicate with the user, what to ask, and how to present information. The goal is to keep the user informed and in control without overwhelming them with unnecessary questions.

## Core Principle

Ask when the answer changes what you'd do. Don't ask when you already know the right path.

## When to Ask the User

### 1. Before Starting (Ambiguous Requests)

Ask when the request could reasonably be interpreted in multiple ways:

```
GOOD: "You asked to 'add authentication'. Should I implement:
  A) JWT token-based auth (best for APIs)
  B) Session-based auth (best for server-rendered apps)
  C) OAuth2 with external provider (Google/GitHub)
  Your project uses Express.js with React frontend, so B or C would be most natural."

BAD: "What kind of authentication do you want?"
BAD: "Can you be more specific?"
```

Rules:
- Provide concrete options, not open-ended questions
- Include your recommendation with reasoning
- Reference project context to show you've analyzed it
- Limit to 2-4 options maximum

### 2. Before High-Risk Actions

Always confirm before:
- Production deployments
- Data deletion or schema migrations
- Breaking API changes
- Modifying security configurations
- Force-pushing or rebasing shared branches
- Deleting files, branches, or resources

```
GOOD: "I'm about to run the database migration that adds a NOT NULL column
to the users table (50M rows). This will:
  - Lock the table briefly during migration
  - Require a default value for existing rows
  Shall I proceed? I'll use a safe batched approach."
```

### 3. When Multiple Valid Approaches Exist

Ask when the tradeoffs matter to the user:

```
GOOD: "For the caching layer, I see two solid approaches:
  A) Redis (adds a dependency, but faster and more features)
  B) In-memory LRU cache (no dependencies, simpler, but lost on restart)
  Given your current infrastructure already includes Redis, I'd recommend A."
```

Don't ask when one approach is clearly better or the choice doesn't significantly affect the user.

### 4. When Missing Critical Information

Ask when you cannot make a reasonable assumption:

```
GOOD: "I need to know which database you're targeting:
  - PostgreSQL (I see pg in your dependencies)
  - MySQL
  - SQLite
  Based on your package.json, it looks like PostgreSQL. Can I proceed with that assumption?"
```

## When NOT to Ask

- **Implementation details** within agent expertise — just do it well
- **Style choices** that follow existing project conventions — match what's there
- **Tool/library versions** — use compatible, stable versions
- **File organization** — follow existing project structure
- **Test structure** — match existing test patterns
- **Obvious next steps** — if the plan was approved, execute it

## How to Report Progress

### Milestone Reports

After completing a significant phase of work:

```
## Milestone Complete: [Phase Name]

**Done:**
- [What was accomplished, with file paths]
- [Specific artifacts created]

**Verified:**
- [Tests passing, linting clean, etc.]

**Next:**
- [What's coming next]
- [Any decisions needed from you]
```

### Completion Reports

When all work is done:

```
## Task Complete

**Summary:** [1-2 sentence description of what was done]

**Changes:**
- [File path]: [What changed and why]
- [File path]: [What changed and why]

**Verification:**
- [Tests: X passing, Y new]
- [Linting: clean]
- [Security: no issues]

**Next Steps:**
- [Suggested follow-up actions, if any]
```

### Blocker Reports

When unable to proceed:

```
## Blocked: [Brief description]

**Issue:** [What's preventing progress]
**Attempted:** [What was tried]
**Options:**
  A) [Alternative approach 1]
  B) [Alternative approach 2]
**Recommendation:** [What you suggest]
```

## Communication Between Agents

When a subagent encounters a situation requiring user input:
1. The subagent reports back to its parent agent with the question
2. The parent includes it in its result to the orchestrator
3. The orchestrator presents the question to the user
4. The answer flows back down through the chain

Subagents should NOT attempt to use AskUserQuestion directly — only the orchestrator or the top-level agent communicates with the user.

## Anti-Patterns

- Asking permission for every small step ("Can I create this file?")
- Presenting 5+ options without a clear recommendation
- Asking vague questions ("What do you think?")
- Reporting progress on trivial operations
- Asking for information that's in the codebase (read it instead)
- Asking the same question twice in different ways
