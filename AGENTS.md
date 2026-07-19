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
- Type-check and build the frontend: `pnpm build`
- Type-check the frontend only: `pnpm typecheck`
- Check frontend formatting: `pnpm format`
- Format frontend files: `pnpm format:write`
- Lint frontend files: `pnpm lint`
- Apply safe frontend lint fixes: `pnpm lint:fix`
- Check Rust formatting: `cargo fmt --manifest-path src-tauri/Cargo.toml --check`
- Lint the Rust backend: `cargo clippy --manifest-path src-tauri/Cargo.toml -- -D warnings`
- Check the Rust backend: `cargo check --manifest-path src-tauri/Cargo.toml`

## Working rules

- Keep native filesystem access in the Rust/Tauri layer.
- Treat file paths received from the frontend as untrusted input.
- Preserve existing file contents and user data unless the requested behavior explicitly requires changing them.
- Do not edit generated files under `node_modules/`, `dist/`, or `src-tauri/target/`.
- Preserve unrelated working-tree changes.

## Verification

- For frontend changes, run `pnpm format`, `pnpm lint`, and `pnpm build`.
- For Rust or Tauri-command changes, also run `cargo check --manifest-path src-tauri/Cargo.toml`.
- For Rust changes, also run `cargo fmt --manifest-path src-tauri/Cargo.toml --check` and `cargo clippy --manifest-path src-tauri/Cargo.toml -- -D warnings`.
- For visible UI changes, verify the application with `pnpm tauri dev` when the environment supports it.
- Report checks that could not be run.

## Documentation

- Read `README.md` for the project overview and local setup.
- Add focused documentation under `docs/` only when the information cannot be expressed clearly in code, configuration, or this file.

## Commits

Before creating or proposing a commit message, read the "Commit messages" section in `CONTRIBUTING.md` and follow it exactly.

- Do not create a commit unless the user has requested or authorized it.
