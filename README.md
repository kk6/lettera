# Lettera

<img src="public/lettera.png" width="100" height="auto" alt="Description">

A desktop plain-text and Markdown editor built with Tauri 2, React, and TypeScript.

## Documentation

See the [documentation index](docs/README.md) for the complete set of project documents and the role of each one.

- [Product proposal](docs/proposal.md) — purpose, intended user, initial scope, and priorities
- [Initial requirements handoff](docs/requirements-handoff.md) — requirements baseline, anticipated questions, and the process for handling changes
- [Development roadmap](docs/roadmap.md) — phased implementation and learning order
- [Architecture](docs/architecture.md) — current structure, responsibility boundaries, and data flow
- [Constitution](docs/constitution.md) — long-lived development principles

## Requirements

- Node.js
- pnpm
- Rust
- Platform-specific dependencies required by Tauri 2

## Development

```shell
pnpm install
pnpm tauri dev
```

### Code quality

The frontend uses [Biome](https://biomejs.dev/) for formatting and linting, and TypeScript for type checking.

```shell
pnpm format          # Check frontend formatting
pnpm format:write    # Format frontend files
pnpm lint            # Lint frontend files
pnpm lint:fix        # Apply safe lint fixes
pnpm typecheck       # Type-check the frontend
```

The Rust backend uses the standard Rust toolchain:

```shell
cargo fmt --manifest-path src-tauri/Cargo.toml --check
cargo clippy --manifest-path src-tauri/Cargo.toml -- -D warnings
cargo check --manifest-path src-tauri/Cargo.toml
```

When this repository is opened in VS Code, install the recommended Biome and rust-analyzer extensions. Workspace settings format supported frontend files with Biome and Rust files with rust-analyzer whenever a file is saved. Biome also applies safe lint fixes and organizes imports on save.

### Project skills

Project-specific Codex skills live under `.agents/skills/`.

- [`review-lettera-phase`](.agents/skills/review-lettera-phase/SKILL.md) — review the current roadmap phase against its specification, implementation, architecture, and required verification. Invoke it with `$review-lettera-phase` for requests such as checking whether a phase is ready to mark `Implemented`.
- [`suggest-lettera-next-step`](.agents/skills/suggest-lettera-next-step/SKILL.md) — inspect the repository's current documentation, implementation, verification evidence, and Git state, then recommend one concrete next action. Invoke it with `$suggest-lettera-next-step` when deciding what to do next or which Phase is ready to proceed.

For Computer Use during a visible UI review, build and launch a discoverable macOS app bundle:

```shell
pnpm tauri build --debug --bundles app
```

The bundle is generated at `src-tauri/target/debug/bundle/macos/lettera.app`. Pass its absolute path with the review request. Computer Use can verify committed text and standard editing operations, but Japanese IME composition and conversion candidates still require a developer-run manual check.

## Build

```shell
pnpm tauri build
```

## Contributing

Development setup and commit conventions are documented in
[CONTRIBUTING.md](CONTRIBUTING.md).
