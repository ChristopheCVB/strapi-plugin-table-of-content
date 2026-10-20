# Repository Guidelines

## Project Structure & Module Organization

This TypeScript plugin adds a table of content to the Strapi v5 content editor.

- `admin/src/`: React registration, components, utilities, and translations. The main UI lives in `components/TableOfContentPanel.tsx`, `PrimitiveSection.tsx`, and `DynamicZoneSection.tsx`.
- `server/src/`: plugin lifecycle hooks, routes, controllers, and configuration. `config/index.ts` defines the Zod schema and exports the shared `Config` type.
- `server/src/__tests__/`: configuration validation tests.
- `assets/`: logo and UI previews; `.github/`: CI and release workflows.
- `dist/`: generated package output; edit source files instead.

## Build, Test, and Development Commands

Use Node 22 via `mise.toml` and the pnpm version pinned in `package.json`. Initial setup:

```sh
mise trust
mise install
pnpm install --frozen-lockfile
```

- `pnpm watch`: rebuild the plugin during development.
- `pnpm watch:link`: run the SDK's linked development workflow with a consuming Strapi application.
- `pnpm build`: generate distributable admin and server bundles.
- `pnpm verify`: validate the built plugin package; run after building.
- `pnpm typecheck:front` / `pnpm typecheck:back`: check admin/server TypeScript.
- `pnpm lint` / `pnpm lint:fix`: check or automatically fix ESLint violations.
- `pnpm test --run`: run tests once; `pnpm test:watch` enables watch mode.
- `pnpm test:coverage`: generate V8 coverage reports.

## Coding Style & Naming Conventions

Follow existing TypeScript and React patterns: two-space indentation, single quotes, no semicolons, multiline trailing commas, and LF endings. ESLint configures these conventions in `eslint.config.mjs`. Use PascalCase for React components and their files, camelCase for functions and utilities, and uppercase constants such as `PLUGIN_ID`. Reuse Strapi design-system components and existing utilities. Keep configuration changes consistent with the shared `Config` type and README examples.

## Testing Guidelines

Vitest runs in Node and discovers `server/src/__tests__/**/*.test.ts`. Use `describe` and descriptive `it` cases; cover valid configurations and rejected inputs when changing validation. Coverage targets server code with no configured minimum. For admin changes, manually check rendering and navigation in a Strapi v5 application; the current test configuration covers server tests only.

## Commit & Pull Request Guidelines

History follows Conventional Commits, such as `fix(ci): use mise and run checks in parallel` and `chore(deps): update dependencies`. Use a concise imperative subject and relevant scope. Target `main`; describe the behavior change, link relevant issues, report validation, and include screenshots for UI changes. Before requesting review, run typechecks, lint, tests, build, and package verification, matching CI.
