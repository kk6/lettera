---
name: review-lettera-frontend-tests
description: Review and help design Lettera React/TypeScript frontend tests against the repository testing policy, current feature specifications, and installed Vitest, React Testing Library, and jsdom setup. Use for requests such as「フロントエンドのテストをレビューして」「Vitestの書き方を確認して」「RTLらしいテストになっている？」「テスト名の英語を直して」「このコンポーネントのテストを一緒に考えて」「このテストケースで十分？」, and when reviewing additions or changes to React/TypeScript tests. Do not use for detailed review of Rust implementations, Rust tests, Tauri commands, or native filesystem operations.
---

# Review Lettera Frontend Tests

Perform an evidence-based specialist review or provide learning-oriented test design help. Treat a review request as read-only: do not edit files, install dependencies, or implement fixes unless the user explicitly asks. When implementation is explicitly delegated, complete the requested change and verify it.

## Establish scope and evidence

1. Read the repository-root `AGENTS.md` first and obey it.
2. Read `docs/testing.md` in full. Treat it as the source of truth for frontend test policy; do not substitute or duplicate its detailed rules here.
3. Read `docs/README.md` to identify sources of truth, then read the relevant specification under `docs/features/` in full. Use its user-visible behavior, acceptance criteria, exclusions, and verification plan to establish expected coverage.
4. Read the target component, its tests, and the directly relevant frontend code and configuration. Inspect `package.json`, `vitest.config.ts`, and `src/test/setup.ts` when available APIs or configuration affect the judgment.
5. When reviewing work in progress, inspect `git status`, staged and unstaged diffs, and relevant untracked files. Preserve unrelated user changes and distinguish them from the review scope.
6. If the scope is ambiguous, choose the narrowest relevant React/TypeScript test scope supported by the request and repository evidence. Ask only when an unresolved choice would materially change the result.

## Review the tests

For each test or missing case in scope:

- Check that the English name is a natural present-tense description that reads with its `describe` subject.
- Map the assertion to a user-observable behavior or an explicit DOM-structure requirement.
- Check query choice, matcher intent, and synchronous or asynchronous handling against `docs/testing.md`.
- Identify coupling to implementation details and mocks that remove meaningful behavior.
- Assess normal, boundary, and failure paths required by the feature specification and the risk of the component.
- Check that every used library, helper, and matcher is currently installed and configured. Do not recommend code that assumes an unavailable dependency without labeling dependency addition as a proposal requiring approval.

Do not turn every stylistic preference into a defect. Classify as a problem only when the test can give misleading confidence, misses required behavior, is fragile because it tests implementation details, uses unavailable APIs, contains incorrect English that obscures the behavior, or violates repository policy. Report non-blocking clarity or maintainability ideas separately as optional improvements.

## Support learning or implementation

For pair-programming, naming help, or test design, explain the reason for each recommendation, clarify the English expression, show alternatives and tradeoffs, and use small examples. Guide the developer toward the next decision instead of supplying a complete implementation unasked.

When the user explicitly delegates a fix or implementation, make the complete scoped change. Follow `docs/testing.md`, avoid adding dependencies without explicit approval, preserve unrelated work, and explain the important test and language choices afterward.

## Verify

Use commands currently defined by the repository. For frontend test changes, run at least:

```sh
pnpm format
pnpm lint
pnpm build
pnpm test
```

In a read-only review, formatting commands that might write are not authorized; use a check-only equivalent when available or report that the write-capable command was not run. Run targeted tests first when useful, followed by the required suite. Report each command, result, and any check that could not run with its reason. Do not run Rust checks for frontend-test-only changes unless another in-scope change requires them.

## Respect skill boundaries

This skill specializes in individual frontend tests and test design. It does not replace:

- `review-lettera-phase`, which decides completion of an entire Phase using specifications, implementation, tests, documentation, manual checks, and learning evidence.
- A possible future `review-lettera-frontend`, which would review React/TypeScript implementation broadly.
- A possible future `review-lettera-rust`, which would review Rust, Tauri commands, native file operations, and Rust tests.

Do not create or assume those future skills. If a request crosses boundaries, review only the frontend-test portion with this workflow and route the broader completion or implementation judgment to the appropriate existing workflow.

## Report

Lead with findings ordered by severity. For each problem, give the affected behavior, evidence with a precise file and location, and a concrete direction for correction. Then provide:

1. Required problems, or a clear statement that none were found.
2. Optional improvements, kept separate from problems.
3. Coverage assessment for relevant normal, boundary, and failure paths.
4. Verification commands and results, including anything not run.

For a narrow naming or learning request, adapt the format and answer directly while preserving the same evidence and policy basis. Never claim the whole Phase is complete from this specialist review alone.
