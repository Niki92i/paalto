---
name: migration-plan
role: engineer
inputs: [migration_topic, current_state, target_state, optional:tech_spec_url]
outputs: [runs/<run_id>/migration-plan.md]
tools: [filesystem, mcp:github]
gates: [emits_g4_summary]
---

# Skill — Schema / System Migration Plan

Phased plan to move from state A to state B without an outage and with a real rollback at every step. Default pattern: expand → migrate → contract. Mandatory double-write phase. Kill switches independent of feature flags.

## Procedure

1. **Characterize current and target state.**
   - Schema (or system) snapshot: tables, columns, indexes, constraints, callers.
   - Data volume + write rate (drives phase duration).
   - Dependencies: services that read/write affected surfaces.
2. **Choose migration pattern:**
   - **Expand-Contract (recommended default for online schemas):** add new alongside old, double-write, backfill, switch reads, deprecate old.
   - **Blue/green:** for stateless services with feature parity.
   - **Strangler-fig:** for large legacy replacements over months.
   - Document why this pattern, not the others.
3. **Design phases.** Every phase must satisfy:
   - **<48h rollback** (faster the better; for high-risk schema phases, <1h)
   - Independent feature flag *and* independent kill switch (kill switches bypass flag system in case the flag system is what failed)
   - Verification step with explicit pass/fail criteria
   - DRI per phase
4. **The canonical phases for expand-contract:**

| Phase | Action | Rollback | Verification |
|---|---|---|---|
| **0. Prep** | Add new column/table, add code path behind off-flag, deploy | Revert PR, no data change | Schema diff matches spec; new code paths covered by tests but unreached |
| **1. Double-write** | Flip flag: writes go to BOTH old and new | Flag off → reverts to old-only | New table row count grows at write rate; row contents byte-equal modulo expected diffs |
| **2. Backfill** | Run backfill job for historical rows | Truncate new table, restart from phase 1 | Row count parity; sampled diff = 0 |
| **3. Shadow read** | Reads still hit old; new is read in parallel and compared | Disable shadow read | Mismatch rate < 0.01% over 24h |
| **4. Cutover** | Reads switch to new; writes still double-written | Flip flag back to old reads | Error rate flat; latency within budget |
| **5. Single-write** | Stop writing to old | Re-enable double-write | 24h soak with no errors |
| **6. Drop old** | Delete old column/table | Restore from snapshot | Disk freed; no callers reference old |

5. **Kill switches.** For each phase that flips behavior:
   - The flag (controlled by flag system)
   - The kill switch (controlled by env var or config file, independent of flag system)
   - The runbook entry that says exactly which to flip in which failure mode
6. **Write the plan:**

```markdown
# Migration plan — <topic>
**Pattern:** Expand-Contract · **Total duration:** <weeks> · **DRI:** <name>

## Current state
<schema, callers, volume>

## Target state
<schema, callers expected>

## Why this pattern
<2-3 sentences>

## Phases
<table per above, with dates, DRIs per phase>

## Rollback per phase
| Phase | Rollback action | Estimated time | Data loss risk |

## Kill switches
| Switch | Mechanism | When to use |

## Communication plan
- Internal heads-up: T-N days
- Status updates: per phase
- Incident channel: #<channel>

## Risks
| Risk | Mitigation |

## Success criteria
- <metric per phase>
- Final: <e.g., latency p99 unchanged, error rate flat, disk freed by X>
```

7. **G4 emission.** Merge approval gate gets a summary listing the phases, the explicit "we accept the cutover risk on <date>" statement, and the rollback plan. Human approval required to proceed past Phase 4 (cutover).
8. **Audit.** `events.jsonl`: `{ "type": "migration.plan", "pattern": "expand-contract", "phases": N, "rollback_max_minutes": N, "kill_switches": N }`.

## Hard rules

- **Double-write phase is mandatory.** Cutover without a double-write phase is a coin flip.
- **<48h rollback per phase.** If you can't roll back, you don't have a phase, you have a hope.
- **Kill switches independent of feature flags.** When the flag system is what's broken, you need a non-flag escape hatch.
- **Verification per phase, not at the end.** Catch drift inside a phase, not after.
- **Backfill and cutover are different days.** Never combine them in one deploy window.

## Refusal

- Asked to do a "big bang" migration on a live system without an expand-contract path? Refuse and write the phased plan instead.
- Asked to skip the shadow-read phase to "go faster"? Refuse — shadow-read is the only place you'll catch a wrong-data bug before users do.
