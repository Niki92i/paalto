# Triage — week of 2026-04-27 → 2026-05-04  *(reference output)*

**14 items → 5 clusters → 2 tickets filed, 2 PRD candidates surfaced, 1 doc fix.**

---

## Bug · Demo "Share" button broken (3 customers)
**Class:** bug · **Items:** c-002, c-006, c-013 · **Customers:** 3 distinct
**Top quotes:**
- "Share button does nothing. No error, no loading state." — c-002
- "Demo share button still broken on Firefox. Works in Chrome." — c-006
- "Demo share button doesn't work for me either. Safari. iPhone." — c-013

**Proposed:** `[ticket]` — file in Linear, status `Triage`, label `bug`. Cross-browser; reproducible without auth (it's the demo project).

**→ Linear ticket filed:** `<TKT-URL>` · "Demo project share button does nothing on Firefox + Safari mobile"

---

## Bug · Demo "Try a demo project" load latency (1 customer)
**Class:** bug · **Items:** c-001 · **Customers:** 1 distinct
**Top quotes:**
- "Nothing happens for like 8 seconds. I thought it was broken." — c-001

**Proposed:** `[ticket]` — file in Linear with `needs-repro` label. PRD AC was "within 2s." This violates it.

**→ Linear ticket filed:** `<TKT-URL>` · "Demo project copy exceeds 2s budget for some users"

> *Note:* singleton in this batch but maps directly to a published AC, so it gets filed (rule: ≥2 items OR violates an existing AC).

---

## PRD candidate · Bulk-invite teammates (2 customers)
**Class:** request · **Items:** c-004, c-005 · **Customers:** 2 distinct
**Top quotes:**
- "Inviting people one by one is painful for 12 people." — c-004
- "CSV upload?" — c-005

**Proposed:** `[PRD candidate]` — surface to operator. Not filed as a ticket. Needs scoping: invite UX, billing implications, role assignment at invite time.

---

## PRD candidate · Jira integration (3 customers)
**Class:** request · **Items:** c-008, c-009, c-010 · **Customers:** 3 distinct
**Top quotes:**
- "We're a Jira shop and Linear isn't on the table." — c-008
- "+1 on Jira. We'd switch off our current tool tomorrow." — c-009
- "4 squads on Jira, no plans to migrate." — c-010

**Proposed:** `[PRD candidate]` — strong demand signal (3 customers, one explicit "would switch"). Already in the v0.4 plan; this batch confirms priority. Surface for operator decision on whether to pull it forward.

---

## Doc fix · Navigation back from demo project (2 customers)
**Class:** confusion · **Items:** c-011, c-012 · **Customers:** 2 distinct
**Top quotes:**
- "I had to use the browser back button." — c-011
- "Where's the back button in the demo?" — c-012

**Proposed:** `[doc fix]` *and* a short copy/UX tweak. Not engineering scope — likely a Designer `ux-copy` change to add a "← Back to dashboard" link in the demo-project header. Surface to Designer.

---

## Anomalies (singletons, not actioned)

- c-007 — "Where do I change my billing email?" → support response, route to docs.
- c-014 — "Pricing page 500." → ops/site, not product. Already alerted via uptime monitoring.

---

## Praise (counted, not actioned)

- c-003 — "Got me from 'huh' to 'oh I see' in like a minute. Thanks."

> Useful for the next release-note headline if we ship the share-button fix and latency fix together.
