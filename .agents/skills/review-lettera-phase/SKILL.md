---
name: review-lettera-phase
description: Review the current Lettera roadmap phase against its feature specification, acceptance criteria, architecture, requirements workflow, repository rules, implementation, Git diff, and required verification. Use for requests such as "セルフレビューして", "このPhaseは完成？", "実装をレビューして", or "Implementedにしてよい？", and whenever deciding whether a Lettera feature specification is ready to move from Draft to Implemented.
---

# Review Lettera Phase

Perform an evidence-based, read-only completion review. A review request alone never authorizes file edits, status changes, dependency changes, commits, or fixes. Make changes only after an explicit user request.

## Establish the review scope

1. Read the repository-root `AGENTS.md` first and obey it.
2. Read `docs/README.md` to identify the current sources of truth; do not rely on a copied checklist in this skill.
3. Read `docs/roadmap.md` and inspect feature-spec statuses, Git history/diff, and implementation state to identify the current Phase. State the selected Phase and evidence. If the evidence is genuinely ambiguous, explain the ambiguity and ask the user before making a completion judgment.
4. Read the corresponding file under `docs/features/` in full. If it is absent, report that the Phase cannot be marked Implemented.
5. Read the specification's completion record and the relevant implementation commit message when present. Treat an explicit developer record of manual checks or learning-goal confirmation as evidence; distinguish a contemporaneous record from a clearly labeled retrospective record when reporting confidence and provenance. Do not infer those checks from code or `Implemented` status alone.
6. Read the source-of-truth documents linked by that specification and `docs/README.md` that are relevant to the Phase. Read `docs/architecture.md` when responsibility boundaries or data flow matter. Read `docs/requirements-handoff.md` when judging workflow, document changes, or readiness for Implemented.
7. Inspect the complete relevant working-tree state: `git status`, staged and unstaged diffs, untracked files, and the implementation code needed to evaluate behavior. Preserve unrelated changes and distinguish pre-existing changes from the reviewed work when possible.

## Evaluate completion

Build an explicit list from the feature specification's acceptance criteria and evaluate every item as **Pass**, **Fail**, or **Unverified**. Cite concrete file paths, code locations, test output, or required manual observations. Never treat code presence alone as proof of user-visible behavior.

Also check, using the repository's current source documents rather than duplicating their requirements here:

- the Phase outcomes, exclusions, states, failure behavior, validation plan, and learning goals;
- leakage of features, dependencies, abstractions, or preparation belonging only to later Phases;
- responsibility boundaries among React, Tauri, and Rust, including native filesystem access and untrusted frontend paths when applicable;
- risks of losing, overwriting, or unexpectedly transforming user files or in-progress content, including relevant cancellation and failure paths;
- dead or unnecessary code, CSS, dependencies, configuration, and speculative abstractions;
- mismatches between implemented behavior and the feature specification or current-state documentation;
- required updates to the feature specification, architecture, or other source-of-truth documents.

Treat learning goals and environment-dependent UI behavior as manual checks unless objective evidence or an explicit developer confirmation is recorded. Report the provenance and date or commit context of recorded confirmation. Re-run a manual check only when the reviewed changes could invalidate it, the record is ambiguous, or the user requests fresh verification.

## Verify

Run the verification commands required by the current `AGENTS.md` for the kinds of implementation changes under review, plus checks named by the feature specification. Inspect existing tests before deciding whether coverage is sufficient. For visible UI behavior, attempt the prescribed application-level verification when the environment supports it; avoid using real user documents as test data.

For Computer Use on macOS, prefer an app bundle over the raw process started by `cargo run` or `pnpm tauri dev`; raw development executables may not be discoverable as applications. Use an already-running bundle when the user provides one. Otherwise, when building generated artifacts is in scope, run:

```sh
pnpm tauri build --debug --bundles app
```

Then target the absolute path `src-tauri/target/debug/bundle/macos/lettera.app` first, falling back to bundle identifier `com.kk6.lettera` or display name `lettera`. For a historical-commit review, first prove that the bundle's frontend, Rust code, configuration, and dependencies match the reviewed commit; otherwise build and test that commit in an isolated temporary tree.

Before UI actions, capture the editor's initial value. Use synthetic text only, re-read the application state after each operation, and restore the initial value after testing. Exercise each required standard editing operation independently where practical. Treat Computer Use `set_value` as evidence that committed Japanese text is accepted and preserved, not as evidence of IME composition behavior. Unless actual conversion candidates and uncommitted text were exercised, leave IME composition **Unverified** and request a developer-run manual check.

Record each command, its result, and relevant failure details. Clearly label commands and manual checks that could not be run, why they were not run, and how that limits the conclusion. A failed check is a finding, not something to fix during a review-only request.

## Decide readiness

Recommend changing `Draft` to `Implemented` only when every acceptance criterion and Phase completion condition has adequate evidence, required automated checks pass, required documentation is aligned, and any remaining manual checks do not block the repository's definition of completion. Do not edit the status during a review-only request.

Use one of these conclusions:

- **Ready for Implemented** — completion is supported by evidence.
- **Not ready** — one or more required conditions fail.
- **Conditionally ready after manual verification** — only specifically identified manual evidence remains and no known defect blocks completion.
- **Unable to determine** — essential scope, specification, code, or verification evidence is unavailable.

## Report

Use this structure unless the request calls for a narrower response:

1. **結論** — Phase, readiness decision, scope, and concise rationale.
2. **問題点** — findings ordered by severity, each with impact, evidence, and the violated criterion or source document. If none, say so and explain the evidence basis.
3. **受け入れ条件ごとの判定** — every criterion with Pass/Fail/Unverified and evidence.
4. **実行した検証と結果** — commands and manual checks, including anything not run.
5. **必要な文書更新** — required alignment work, or evidence that none is needed.
6. **Phase完了前に行う次の作業** — the smallest ordered set of remaining actions; include outstanding manual checks even when no problems were found.

Separate defects from optional improvements. Give severity based on user/data risk and whether the issue blocks an acceptance criterion. Avoid proposing implementation beyond the current Phase.
