# Context Gathering Protocol

Every agent — orchestrator, lead, or specialist — MUST understand the project before making changes. This protocol defines how to analyze any project systematically.

## When to Use This Protocol

- When the orchestrator first receives a request
- When a subagent is spawned and needs to understand the project
- When switching to a new area of the codebase
- Before any code modification

## Step-by-Step Protocol

### Step 1: Identify the Project Type

Use `Glob` and `Read` to find the project manifest:

```yaml
check_in_order:
  - package.json          # Node.js / JavaScript / TypeScript
  - pyproject.toml        # Python (modern)
  - setup.py              # Python (legacy)
  - Cargo.toml            # Rust
  - go.mod                # Go
  - pom.xml               # Java (Maven)
  - build.gradle          # Java/Kotlin (Gradle)
  - Gemfile               # Ruby
  - composer.json         # PHP
  - *.csproj / *.sln      # .NET / C#
```

Read the manifest to understand: name, version, dependencies, scripts/commands.

### Step 2: Understand Directory Structure

Use `Bash('ls -la')` at the project root, then explore key directories:

```yaml
common_structures:
  src/          # Source code
  lib/          # Library code
  tests/        # Test files
  test/         # Alternative test directory
  spec/         # Spec files (Ruby, etc.)
  docs/         # Documentation
  config/       # Configuration files
  scripts/      # Build/deploy scripts
  .github/      # GitHub workflows
  .claude/      # Claude Code configuration
  public/       # Static assets (frontend)
  api/          # API definitions
  migrations/   # Database migrations
```

### Step 3: Identify Tech Stack & Frameworks

Look for framework-specific indicators:

```yaml
frontend:
  - next.config.js / next.config.ts    # Next.js
  - vite.config.ts                      # Vite
  - angular.json                        # Angular
  - svelte.config.js                    # Svelte/SvelteKit
  - nuxt.config.ts                      # Nuxt

backend:
  - manage.py                           # Django
  - app.py / wsgi.py                    # Flask
  - main.go                             # Go
  - src/main.rs                         # Rust
  - Dockerfile                          # Containerized

infrastructure:
  - terraform/                          # Terraform IaC
  - kubernetes/ / k8s/                  # Kubernetes configs
  - docker-compose.yml                  # Docker Compose
  - .github/workflows/                  # GitHub Actions CI/CD
  - Jenkinsfile                         # Jenkins CI/CD
```

### Step 4: Check Coding Conventions

Look for convention enforcers:

```yaml
linting:
  - .eslintrc* / eslint.config.*       # JavaScript/TypeScript linting
  - .prettierrc*                        # Code formatting
  - .ruff.toml / ruff.toml             # Python linting
  - .golangci.yml                       # Go linting
  - rustfmt.toml                        # Rust formatting

typing:
  - tsconfig.json                       # TypeScript configuration
  - mypy.ini / pyproject.toml [mypy]   # Python typing

style:
  - .editorconfig                       # Editor-agnostic style
  - CONTRIBUTING.md                     # Contribution guidelines
```

### Step 5: Understand Testing Patterns

Find existing tests and understand how they're structured:

```yaml
search_patterns:
  - Glob('**/*.test.*')                 # Jest/Vitest tests
  - Glob('**/*.spec.*')                 # Spec-style tests
  - Glob('**/test_*.py')               # Python tests
  - Glob('**/*_test.go')               # Go tests
  - Glob('**/tests/**')                # Test directories

understand:
  - Test runner (jest, pytest, go test, cargo test)
  - Test structure (describe/it, class-based, function-based)
  - Assertion library (expect, assert, should)
  - Test data patterns (fixtures, factories, mocks)
```

### Step 6: Check for Architecture Documentation

```yaml
read_if_present:
  - README.md                           # Project overview
  - ARCHITECTURE.md                     # Architecture decisions
  - docs/adr/                           # Architecture Decision Records
  - CONTRIBUTING.md                     # How to contribute
  - .claude/AGENTS.md                   # Agent system architecture
  - API.md                              # API documentation
```

### Step 7: Understand Deployment & CI/CD

```yaml
check:
  - .github/workflows/*.yml            # GitHub Actions
  - .gitlab-ci.yml                     # GitLab CI
  - Jenkinsfile                        # Jenkins
  - .circleci/config.yml               # CircleCI
  - Dockerfile                         # Container build
  - docker-compose*.yml                # Multi-container setup
  - Makefile                           # Build commands
```

## Context Summary Format

After gathering context, produce a summary:

```
PROJECT: [name] ([language/framework])
STRUCTURE: [key directories and their purpose]
TECH STACK: [languages, frameworks, databases, cloud]
CONVENTIONS: [linting, formatting, typing, naming patterns]
TESTING: [runner, patterns, coverage requirements]
DEPLOYMENT: [CI/CD, containerization, cloud provider]
KEY FILES: [most important files for the current task]
```

This summary gets passed to subagents in their spawn prompts so they don't need to re-explore.

## What NOT to Do

- Do NOT skip exploration and start writing code immediately
- Do NOT assume a tech stack without checking
- Do NOT ignore existing patterns and conventions
- Do NOT read every file — focus on what's relevant to the task
- Do NOT spend excessive time exploring — gather enough context to act confidently
