---
name: security-review
role: engineer
inputs: [feature_or_service, optional:tech_spec_url, optional:data_classification]
outputs: [runs/<run_id>/security-review.md]
tools: [filesystem, mcp:github]
gates: [emits_g4_summary]
---

# Skill — Security Review (STRIDE-based)

Threat-model a feature or service before launch. Uses STRIDE (Spoofing, Tampering, Repudiation, Information disclosure, DoS, Elevation of privilege). Output is 5-15 pages, not 100. Includes an "already handled" section so reviewers don't re-litigate solved problems.

## Procedure

1. **Scope.** What's in: components, data flows, trust boundaries. What's out: explicitly stated.
2. **Asset inventory.**
   - Data: classification (public / internal / confidential / regulated)
   - Endpoints: public, authenticated, admin
   - Secrets: where stored, how rotated
   - Trust boundaries: where untrusted input crosses into trusted code
3. **Data-flow diagram (DFD).** Lightweight: external entities, processes, data stores, trust boundaries. Even a textual description works if a diagram is overkill.
4. **STRIDE walk** per component or per data flow:

| Category | Question to ask | Mitigation pattern |
|---|---|---|
| **S — Spoofing** | Can someone pretend to be another user/service? | Auth, mTLS, signed tokens |
| **T — Tampering** | Can data be modified in transit / at rest? | TLS, signing, integrity checks |
| **R — Repudiation** | Can an actor deny an action? | Audit logs, signed events |
| **I — Information disclosure** | Can secrets / PII leak? | Encryption, access control, redaction |
| **D — Denial of service** | Can someone exhaust resources? | Rate limits, quotas, timeouts |
| **E — Elevation of privilege** | Can a user gain rights they shouldn't? | Authz checks, least privilege |

5. **Per identified threat:**
   - Description (1 sentence)
   - Likelihood (high/med/low)
   - Impact (high/med/low)
   - Status: **Mitigated** (with reference to where) / **Accepted** (with sign-off) / **Open** (must-fix before launch if P0/P1)
6. **"Already handled" section.** Lists the standard protections this feature inherits (e.g., "All endpoints behind WAF; all writes require CSRF token; PII columns encrypted at rest"). Stops reviewers from re-asking the same questions.
7. **Compliance & privacy notes.** GDPR / CCPA / HIPAA / SOC2 implications if any. Data retention. Deletion / export rights.
8. **Write:**

```markdown
# Security review — <feature/service> · <date>
**Author:** <name> · **Reviewers:** <names> · **Status:** Draft · **Decision needed by:** <date>

## Scope
In: ... · Out: ...

## Assets
| Asset | Classification | Location |

## Data flow
<diagram or textual description; mark trust boundaries>

## Already handled (inherited protections)
- ...
- ...

## Threats (STRIDE)
| ID | Category | Threat | Likelihood | Impact | Status | Mitigation / Owner |

## P0 / P1 (must fix before launch)
- ...

## Accepted risks (with sign-off)
| Risk | Rationale | Approver |

## Compliance & privacy
- Data classification: ...
- Retention: ...
- Deletion / export: ...
- Regulatory implications: ...

## Open questions
- <q> — owner, due
```

9. **G4 emission.** Merge approval gate gets a summary listing P0/P1 status. Merge blocked until P0/P1 closed or explicitly accepted by named approver.
10. **Audit.** `events.jsonl`: `{ "type": "security.review", "threats": N, "p0": N, "p1": N, "accepted_risks": N }`.

## Hard rules

- **STRIDE walk per data flow.** Free-form "what could go wrong" misses categories.
- **5-15 pages.** A 100-page security review doesn't get read; everyone scrolls to the verdict.
- **"Already handled" section.** Reviewers re-litigate solved problems otherwise.
- **P0/P1 must be fixed before launch** — or explicitly accepted with sign-off from a named approver. "We'll fix it later" is not acceptance.
- **Compliance is part of the same doc**, not a separate exercise. Privacy and security live together.

## Refusal

- Asked to sign off without an "already handled" section? Refuse — without it the review will be re-asked next time.
- Asked to mark a P0 as "accepted" without a named approver? Refuse — accountability requires a name.
