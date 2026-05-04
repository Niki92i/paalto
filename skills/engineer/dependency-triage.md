---
name: dependency-triage
role: engineer
inputs: [optional:dependabot_alerts, optional:scope]
outputs: [runs/<run_id>/dependency-triage.md, optional:bundled_pr_url]
tools: [filesystem, mcp:github, shell:sandboxed]
gates: []
---

# Skill — Dependency Triage

Weekly triage of dependency updates and security advisories. Bundles by risk level. Open draft PRs with green CI and human review. Security-with-breaking-change is always P0.

## Procedure

1. **Pull the queue.**
   - Dependabot / Renovate open PRs
   - GitHub security advisories for the repo
   - `npm audit` / `pip-audit` / equivalent
2. **Classify each item:**

| Risk | Examples | Default action |
|---|---|---|
| **R0 — Security + breaking** | CVE in transitive, requires major bump | **P0**, hand-merge, test plan, named approver |
| **R1 — Security + non-breaking** | CVE patch in patch/minor | Bundle into a security-only PR within 48h |
| **R2 — Major version bump** | New major of a runtime dep | Tech-spec sized; treat as a project, not a triage item |
| **R3 — Minor version bump** | New minor of a runtime dep | Bundle weekly; manual review of changelog |
| **R4 — Patch bump (runtime dep)** | Patch of a runtime dep | Bundle weekly; draft PR with green CI |
| **R5 — Patch bump (dev dep)** | Patch of a dev dep | Draft PR with green CI |

3. **Bundle by risk level.** Don't open one PR per dependency — open one PR per risk class:
   - `security/<date>` — all R1
   - `deps-minor/<date>` — all R3
   - `deps-patch/<date>` — all R4 + R5
   - R0 and R2 get their own PR (with full review)
4. **Per bundle PR:**
   - Generated changelog (one section per included dep, linked release notes)
   - CI must be green before merge
   - For R3+, manual changelog scan for "breaking" / "deprecated" keywords
5. **Write the triage:**

```markdown
# Dependency triage — <date>
**Triager:** <name>

## Summary
| Risk | Count | Action |
| R0 | N | Hand-merge: <links> |
| R1 | N | Bundle: <link to security PR> |
| R2 | N | Sized as projects: <list> |
| R3 | N | Bundle: <link to minor PR> |
| R4+R5 | N | Bundle: <link to patch draft PR>, request human review after green CI |

## R0 details (security + breaking)
| Dep | Current → Target | CVE | Severity | Owner | Plan |

## R2 details (major bumps)
| Dep | Current → Target | Effort estimate | Owner |

## Bundles opened
- <link> — N deps included
- <link> — N deps included

## Skipped this week (with reason)
- ...
```

6. **Audit.** `events.jsonl`: `{ "type": "dependency.triage", "r0": N, "r1": N, "r2": N, "r3": N, "r4_r5": N, "draft_prs_opened": N }`.

## Hard rules

- **No auto-merge path.** Even low-risk patch bundles stay as draft PRs until a human reviews and merges.
- **Security + breaking = P0.** Always hand-merge. Always named approver.
- **Bundle by risk class, not one-per-dep.** One PR per dep buries the team.
- **R2 (major bumps) is a project, not a triage item.** Spin out with `tech-spec-writer` if needed.
- **Manual changelog scan for R3+.** Minor-version semver violations happen.

## Refusal

- Asked to auto-merge any dependency PR? Refuse — all dependency changes require a draft PR and human merge.
- Asked to delay a R0 because "we don't have time"? Refuse — escalate to engineering lead with the CVE link.
