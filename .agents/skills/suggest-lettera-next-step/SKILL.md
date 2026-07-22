---
name: suggest-lettera-next-step
description: Inspect the current Lettera repository, authoritative documentation, feature specifications, implementation, verification evidence, and Git history, then recommend one concrete, small, evidence-backed next action for the developer. Use for requests such as "次は何をすればいい？", "現在地を確認して", "次の一手を教えて", or "どのPhaseに進むべき？".
---

# Suggest Lettera Next Step

Recommend one bounded action the developer can complete and verify. Investigate only; do not modify code or documentation unless the user explicitly asks.

## Inspect the repository

1. Read the repository-root `AGENTS.md` first and obey its current instructions.
2. Read `docs/README.md` to identify the source-of-truth documents. Do not copy project facts from this skill; derive them from the repository each time.
3. Read `docs/roadmap.md` to identify the current completed, active, and next phases.
4. Inventory `docs/features/`. Read the specification for the current phase and, when relevant, the next phase. Distinguish `Draft`, `Implemented`, and missing specifications.
5. For the current or next specification, inspect its acceptance criteria, unresolved decisions, exclusions, learning goals, verification plan, and completion record.
6. Read `docs/requirements-handoff.md` when deciding phase readiness, handling missing specifications, requirements changes, dependencies, or completion evidence. Read `docs/architecture.md` when responsibility boundaries, data flow, or implementation-document consistency matters.
7. Inspect `git status --short`, the full unstaged and staged diffs, and recent commits. Preserve and account for unrelated uncommitted work.
8. Inspect the relevant implementation and configuration closely enough to compare them with the specification and current-state documentation.

## Determine readiness

- Treat a phase as complete only when the implementation, acceptance criteria, required automated checks, developer-run manual checks, learning-goal confirmation, specification status, and completion record provide evidence of completion. Do not infer an unrecorded check from code or an `Implemented` label.
- Identify unfinished verification, manual confirmation, documentation updates, or implementation-document mismatches before considering later work.
- Check whether the next action requires a production dependency or an important design decision. For a production dependency, require comparison of candidates, necessity, safety or maintenance implications, and explicit developer agreement before addition. Reserve an ADR for an important decision with meaningful alternatives.
- Never recommend advancing while the current phase is incomplete. Do not pull work or abstractions forward from later phases.
- Prefer the smallest action that removes the highest-priority blocker and has an observable completion condition. Do not recommend a whole phase when a single investigation, decision, implementation slice, verification, or documentation correction is the actionable unit.
- When two or more candidates are genuinely tied, present the choices and tradeoffs and ask the developer to choose; do not manufacture a winner.
- Separate repository evidence from inference. State uncertainty and name missing evidence.

## Choose one action

Rank candidate actions in this order unless repository evidence justifies otherwise:

1. Prevent data loss, unsafe behavior, or a violated repository rule.
2. Resolve a mismatch between implementation and authoritative documentation.
3. Finish missing acceptance, verification, manual-check, learning-goal, or completion-record evidence for the current phase.
4. Resolve one blocking unresolved decision for the current phase.
5. Create the missing specification for the immediate next phase, limited to that phase.
6. Perform the smallest implementation step already authorized and ready.

Make the recommendation executable in one sitting and binary enough to judge complete. For example, recommend comparing the Markdown parser candidates required by specification 002, not merely "start Phase 2."

## Report

Use this structure by default:

1. **現在地** — Current phase and specification state; mention relevant dirty-worktree context.
2. **次に行う一手** — Exactly one concrete action. If tied, give the tied choices and tradeoffs instead of selecting.
3. **そう判断した根拠** — Cite repository paths, Git evidence, and specific unmet conditions.
4. **完了と判断する条件** — Give observable, bounded completion criteria for this action.
5. **その後に予定される作業** — Briefly name the likely follow-up without implementing or prematurely recommending a later phase.

Keep the answer concise, distinguish facts from inference, and report checks that could not be performed.
