# Quality Gates

Every agent must verify their work against these quality gates before reporting completion. These are not optional — they are mandatory checkpoints.

## Universal Gates (All Tasks)

### Gate 1: Code Quality
- [ ] Code follows existing project conventions (naming, structure, style)
- [ ] No linting errors introduced (check with project's linter if configured)
- [ ] No type errors introduced (check with project's type checker if configured)
- [ ] No unnecessary dependencies added
- [ ] No dead code or unused imports left behind

### Gate 2: Testing
- [ ] Existing tests still pass (run `npm test`, `pytest`, `cargo test`, etc.)
- [ ] New code has appropriate tests (match project's testing patterns)
- [ ] Edge cases considered and tested
- [ ] No test pollution (tests don't depend on execution order)

### Gate 3: Security
- [ ] No secrets, API keys, or credentials in code or configs
- [ ] No hardcoded passwords or tokens
- [ ] User input properly validated and sanitized (if applicable)
- [ ] No SQL injection, XSS, or command injection vectors
- [ ] Dependencies don't have known critical vulnerabilities

### Gate 4: Conventions
- [ ] New files placed in correct directories per project structure
- [ ] Naming follows existing patterns (camelCase, snake_case, etc.)
- [ ] Documentation updated where existing docs cover the changed area
- [ ] No files created that duplicate existing functionality

## Domain-Specific Gates

### AI/ML Tasks
- [ ] PII detection performed if processing user data (sa-01)
- [ ] Guardrails included for customer-facing AI (ai-04)
- [ ] Cost optimization considered for LLM calls (fo-07)
- [ ] Experiment tracking set up (mo-01)
- [ ] Model monitoring included for production (mo-06)

### Platform/DevOps Tasks
- [ ] Infrastructure defined as code (no manual resource creation)
- [ ] Secrets managed through vault/key management (sa-06)
- [ ] Monitoring and alerting configured (do-08)
- [ ] Cost tracking enabled for cloud resources (fo-01)
- [ ] Security scanning included in pipeline (do-09)

### Data Tasks
- [ ] Data cataloged and discoverable (dg-01)
- [ ] Data lineage tracked (dg-02)
- [ ] Quality validations in place (de-03)
- [ ] PII detected and handled before processing (sa-01)
- [ ] Schema versioned and migration-safe (db-06)

### Security Tasks
- [ ] Threat model documented (sa-02)
- [ ] Least privilege enforced (sa-04)
- [ ] Audit logging configured (co-06)
- [ ] Compliance requirements verified (co-01 through co-05)
- [ ] Security monitoring active (sa-07)

### Product/Frontend Tasks
- [ ] Accessibility standards met (WCAG 2.1 AA) (fe-06)
- [ ] Responsive design verified
- [ ] API documentation updated (tw-01)
- [ ] Integration tests cover critical paths (qa-03)
- [ ] Performance within acceptable bounds (fe-05)

### Backend Tasks
- [ ] API follows OpenAPI specification (be-01)
- [ ] Rate limiting configured (be-06)
- [ ] Caching strategy appropriate (be-07)
- [ ] Error responses standardized
- [ ] Database queries optimized (db-01)

## Mandatory Collaboration Verification

Before marking any task complete, verify these collaborations were satisfied:

| Condition | Required Collaboration | How to Verify |
|-----------|----------------------|---------------|
| Task involves PII/personal data | Security Lead consulted | sa-01 skill was applied |
| Task creates cloud resources | FinOps consulted | fo-01 cost tracking included |
| Task modifies code | QA review performed | Tests written and passing |
| Task affects production | Security review done | sa-03/sa-05 applied |
| Task involves data storage | Data Governance consulted | dg-01 catalog updated |
| Task changes APIs | QA integration tests | qa-03 tests passing |

If a mandatory collaboration was NOT included in the task prompt:
1. Note it in your result report under COLLABORATIONS
2. Flag it as "NEEDED: [collaboration] was not included but is required"
3. The parent agent must address this before proceeding

## Verification Commands

Common verification commands to run (adapt to project):

```yaml
javascript/typescript:
  lint: "npm run lint" or "npx eslint ."
  type_check: "npx tsc --noEmit"
  test: "npm test"
  build: "npm run build"

python:
  lint: "ruff check ." or "flake8"
  type_check: "mypy ."
  test: "pytest"

rust:
  lint: "cargo clippy"
  test: "cargo test"
  build: "cargo build"

go:
  lint: "golangci-lint run"
  test: "go test ./..."
  build: "go build ./..."
```

## Result Reporting Format

After passing quality gates, report in this format:

```
COMPLETED: [skill-id] [skill-name]
ARTIFACTS:
  - [file path]: [created/modified] - [what and why]
QUALITY:
  - Tests: [X passing, Y new, Z skipped]
  - Lint: [clean / N warnings]
  - Types: [clean / N errors]
  - Security: [no issues / findings]
COLLABORATIONS:
  - [collaboration]: [satisfied / NEEDED]
NOTES:
  - [anything the parent agent needs to know]
```
