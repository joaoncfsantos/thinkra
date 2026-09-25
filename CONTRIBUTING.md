# Contributing

Thanks for your interest in improving Gap and Gain! This is a small personal project, so the process is intentionally lightweight.

## Getting set up

Follow the [Setup section in the README](README.md#setup) to get the client and server running locally.

## Workflow

1. Fork the repo and create a branch off `main`.
2. Make your change. Keep pull requests focused — one feature or fix per PR is easier to review.
3. Before opening a PR, make sure the project builds and lints cleanly:
   ```bash
   npm run lint --prefix client
   npm run build --prefix client
   npm run typecheck --prefix server
   ```
4. Open a pull request describing what changed and why. Link any related issue.

## Reporting bugs / suggesting features

Please open a GitHub issue using the templates under `.github/ISSUE_TEMPLATE`. Include steps to reproduce for bugs, and the problem you're trying to solve for feature requests.

## Code style

- TypeScript everywhere, `strict` mode.
- The client follows the existing ESLint config (`npm run lint --prefix client`); please don't add new lint errors.
- No test suite exists yet — if you add one, `vitest` (client) and `node --test` or `vitest` (server) are reasonable defaults that fit the existing tooling.

## Security

If you find a security vulnerability, please do **not** open a public issue. See [SECURITY.md](SECURITY.md) instead.
