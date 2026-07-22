# Repository guidance

## Project

This is a desktop text editor built with Tauri 2, React, TypeScript, and Rust.
React owns the editor UI and invokes Rust commands for native filesystem operations.

## Important paths

- `src/` — React and TypeScript frontend
- `src-tauri/src/` — Rust application and Tauri commands
- `src-tauri/tauri.conf.json` — Tauri application configuration
- `src-tauri/capabilities/` — Tauri permissions and capabilities

## Commands

Use `pnpm`; do not use npm or Yarn.

- Install dependencies: `pnpm install`
- Run the frontend only: `pnpm dev`
- Run the desktop application: `pnpm tauri dev`

## Working rules

- Keep native filesystem access in the Rust/Tauri layer.
- Treat file paths received from the frontend as untrusted input.
- Preserve existing file contents and user data unless the requested behavior explicitly requires changing them.
- Do not edit generated files under `node_modules/`, `dist/`, or `src-tauri/target/`.
- Preserve unrelated working-tree changes.

## Collaboration modes

The developer primarily implements Lettera while learning React, Tauri, and Rust, but may explicitly delegate implementation to an AI agent.

Determine the working mode from the user's request:

- When asked to explain, investigate, discuss, plan, or review, do not modify files unless explicitly requested. Provide reasoning, alternatives, tradeoffs, and concrete next steps.
- When asked for hints or pair-programming help, help the developer make progress without completing the implementation on their behalf. Prefer small examples and questions that reveal the next step.
- When explicitly asked to implement or fix something, make the requested changes completely, verify them, and explain the important design and code decisions afterward.
- If the requested mode is unclear, prefer explanation and a small next step over a broad implementation.

## Before implementing a feature

- Follow the phase workflow in `docs/requirements-handoff.md`.
- Use `docs/README.md` to identify the source-of-truth documents, confirm the current phase in `docs/roadmap.md`, and read the corresponding specification under `docs/features/` when one exists.
- Do not advance to another roadmap phase or implement adjacent features unless explicitly requested.
- If an unresolved choice would change user-visible behavior, stop and ask the user before implementing that choice.
- Prefer existing dependencies and platform capabilities. Do not add a production dependency without explicit user approval; first explain why it is needed and what tradeoffs it introduces.

### After implementing

- Explain how responsibilities are divided among React, Tauri, and Rust when relevant.
- Point out decisions or remaining questions the developer should understand.

## Verification

- For frontend changes, run `pnpm format`, `pnpm lint`, and `pnpm build`.
- For Rust or Tauri-command changes, also run `cargo check --manifest-path src-tauri/Cargo.toml`.
- For Rust changes, also run `cargo fmt --manifest-path src-tauri/Cargo.toml --check` and `cargo clippy --manifest-path src-tauri/Cargo.toml -- -D warnings`.
- For visible UI changes, verify the application with `pnpm tauri dev` when the environment supports it.
- Report checks that could not be run.

## Documentation

- Read `README.md` for the project overview and local setup.
- When observable behavior changes, update the corresponding specification under `docs/features/`.
- When a requirement changes, update the source-of-truth documents by following `docs/requirements-handoff.md`.
- Keep `docs/architecture.md` aligned with implemented responsibility boundaries and data flow; do not use it to justify speculative abstractions.
- Add an ADR only for an important design decision with meaningful alternatives.
- Add focused documentation under `docs/` only when the information cannot be expressed clearly in code, configuration, or this file.

## Commits

Before creating or proposing a commit message, read the "Commit messages" section in `CONTRIBUTING.md` and follow it exactly.

- Do not create a commit unless the user has requested or authorized it.
