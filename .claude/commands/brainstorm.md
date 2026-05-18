# Brainstorm Architect Command

Route to the Brainstorm Architect Agent for solution discovery, architecture exploration, and project strategy.

## Usage

```
/brainstorm [your request]
```

## Examples

```
/brainstorm what's the best architecture for a RAG chatbot?
/brainstorm should I use serverless or containers for this API?
/brainstorm how should I structure this microservices project?
/brainstorm what database should I use for this use case?
/brainstorm design a data pipeline for our analytics
```

## What Happens

1. **Brainstorm Architect** takes ownership and parses your request
2. **Targeted questions** (max 5) to clarify constraints that change the recommendation
3. **Project explored** to understand existing stack, patterns, and constraints
4. **Skill registries scanned** to identify relevant domain expertise
5. **Architecture options generated** (2-3 approaches with tradeoffs)
6. **Clear recommendation delivered** with implementation roadmap

## Available Skills

| Skill ID | Name                        | Purpose                                         |
| -------- | --------------------------- | ----------------------------------------------- |
| bs-01    | Problem Discovery           | Parse request, identify implicit needs          |
| bs-02    | Context Research            | Explore project, existing stack, constraints    |
| bs-03    | Architecture Evaluation     | Compare approaches, score against constraints   |
| bs-04    | Recommendation & Roadmap    | Deliver verdict with implementation phases      |

## When to Use

- You're unsure which approach, stack, or architecture to choose
- You need a second opinion on a design decision
- You want tradeoff analysis before committing to a direction
- You're starting a new project and want a solid blueprint
- You need to evaluate "build vs. buy" or "tool A vs. tool B"

## Note

Brainstorm Architect is a **solution discoverer**, not a code writer. Output is a concrete architecture recommendation — use `/orchestrator` or a domain command to implement it.
