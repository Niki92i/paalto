# Cloud Setup

Use this path when a tester does not want to install Node or configure a local machine.

## GitHub Codespaces

1. Open the repo on GitHub: `https://github.com/Niki92i/paalto`.
2. Choose **Code** -> **Codespaces** -> **Create codespace on main**.
3. Wait for the container to finish setup.
4. Run:

```bash
npm run demo
```

The devcontainer runs `npm run setup:local && npm run doctor` automatically after creation.

## What This Solves

Codespaces removes local Node setup, package-manager mismatch, and machine-specific shell issues. It does not remove the need for Claude Code or sandbox credentials if you want a real live tool run.

## Safe Defaults

The cloud setup creates local demo checklists only. It does not include production credentials, does not call external APIs, and does not merge code.
