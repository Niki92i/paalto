# Design-system audit — First-run demo  *(reference output)*

**Verdict:** 4 deviations, **1 BLOCKER.** Recommended action: **fix blockers then approve.**

| Frame | Layer | Property | Found | Expected | Severity | Suggested fix |
|---|---|---|---|---|---|---|
| 1/3 Empty dashboard | `Button / Try a demo project` | fill | `#FF4500` (raw hex) | token `--brand-primary` | **BLOCKER** | Replace fill with the brand-primary token; remove the local override. |
| 1/3 Empty dashboard | `Hero card` | padding | `28 / 22 / 28 / 22` | spacing scale (use `space-6` = 24 or `space-7` = 32) | MAJOR | Snap to `space-7` on all sides; remove asymmetric padding. |
| 2/3 Demo project | `Banner` | text style | local 14/20 medium | text style `text-body-md` | MINOR | Apply the `text-body-md` style; delete local. |
| 3/3 Post-aha toast | `Toast / Start a real project` | fill | detached instance of `<TextLink>` | system component instance | MAJOR | Re-attach to the system `<TextLink>` component. |
