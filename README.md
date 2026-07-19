# Lettera

<img src="public/lettera.png" width="100" height="auto" alt="Description">

A desktop plain-text and Markdown editor built with Tauri 2, React, and
TypeScript.

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

The frontend uses [Biome](https://biomejs.dev/) for formatting and linting,
and TypeScript for type checking.

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

When this repository is opened in VS Code, install the recommended Biome and
rust-analyzer extensions. Workspace settings format supported frontend files
with Biome and Rust files with rust-analyzer whenever a file is saved. Biome
also applies safe lint fixes and organizes imports on save.

## Build

```shell
pnpm tauri build
```

## Contributing

Development setup and commit conventions are documented in
[CONTRIBUTING.md](CONTRIBUTING.md).
