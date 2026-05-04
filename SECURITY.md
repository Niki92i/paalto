# Security Policy

paalto is local-first. Your keys, transcripts, PRDs, and run artifacts stay on your machine unless you configure integrations that write to your tools.

For the full security posture, see [docs/security.md](docs/security.md).

## Reporting a Vulnerability

Please do not open a public issue for security vulnerabilities. Use GitHub private security advisories on this repository, or email `hellopaalto@gmail.com` with `[security]` in the subject.

## Defaults We Intend to Preserve

- Draft PRs only; no auto-merge path.
- Human approval at all five gates.
- Least-privilege API scopes.
- `runs/` and `.env` ignored by git.
- No telemetry to paalto.
