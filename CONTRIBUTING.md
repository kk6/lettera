# Contributing

## Commit messages

All commit messages must follow
[Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

### Format

```text
<type>[optional scope][optional !]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat` — add or change user-visible functionality
- `fix` — fix incorrect user-visible behavior
- `docs` — change documentation only
- `style` — change formatting without changing behavior
- `refactor` — restructure code without adding features or fixing bugs
- `perf` — improve performance
- `test` — add or change tests
- `build` — change the build system or dependencies
- `ci` — change continuous-integration configuration
- `chore` — perform maintenance not covered by another type
- `revert` — revert an earlier commit

Use the most specific applicable type. Do not use `chore` when another type
describes the change accurately.

### Scope

A scope is optional. When used, it should identify the affected area with a
short lowercase noun.

Common scopes in this repository include:

- `editor` — React editor behavior
- `ui` — visual presentation
- `tauri` — Tauri integration and configuration
- `fs` — native filesystem operations
- `deps` — dependencies
- `docs` — documentation structure

Do not add a scope if it does not make the message clearer.

### Description

- Write the description in English.
- Use the imperative mood.
- Start with a lowercase letter.
- Do not end with a period.
- Describe the resulting change, not the implementation process.
- Keep the first line concise.

### Body

Use a body when the reason, constraints, or behavioral consequences are not
clear from the subject.

Separate the body from the subject with a blank line. Explain why the change
was needed and any important tradeoffs.

### Breaking changes

Add `!` before the colon or include a `BREAKING CHANGE:` footer when a commit
introduces a breaking change.

```text
feat(document)!: change the persisted document format

BREAKING CHANGE: existing document files require migration
```

### Commit boundaries

Each commit should represent one coherent change. Split unrelated changes into
separate commits.

### Examples

```text
feat(editor): add markdown file saving
```

```text
fix(fs): preserve existing file contents when saving fails
```

```text
docs: replace the generated project README
```

```text
build(deps): update Tauri dependencies
```

### Commit template

This repository provides `.gitmessage` as an optional input aid. Enable it for
this clone with:

```shell
git config --local commit.template .gitmessage
```

`CONTRIBUTING.md` is the source of truth if the template and this document ever
differ.
