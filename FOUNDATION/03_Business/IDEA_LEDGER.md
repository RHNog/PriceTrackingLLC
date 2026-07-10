# Idea Ledger

This is the permanent living ledger for product, business, monetization, and platform ideas. Registering an idea does not approve implementation.

## Ledger Rules

- Every idea receives a stable ID.
- Ideas may be product, business, monetization, platform, provider, workflow, analytics, or operations.
- Ideas can move independently through discovery, validation, design, engineering planning, implementation, launch, or rejection.
- Engineering work should not begin from this ledger until an idea is promoted into a scoped work order or engineering roadmap item.

## Status Values

- `Captured`: recorded for future evaluation.
- `Discovery`: needs customer, market, or technical research.
- `Validated`: likely valuable, not yet planned.
- `Planned`: accepted into roadmap planning.
- `In Progress`: actively being implemented.
- `Launched`: released.
- `Rejected`: intentionally not pursuing.

## Priority Values

- `High`
- `Medium`
- `Low`
- `Unknown`

## Complexity Values

- `Low`
- `Medium`
- `High`
- `Unknown`

## Ideas

### Idea #001: Intelligence Credit Economy

| Field | Value |
| --- | --- |
| ID | `IDEA-001` |
| Title | Intelligence Credit Economy |
| Category | Monetization / Pricing / Platform Economy |
| Description | Users consume credits only when the platform generates new intelligence. Repeated evaluations of the same asset within a configurable freshness window should consume zero additional credits. The pricing model should reward efficient use of cached intelligence. |
| Potential Value | Aligns customer pricing with actual intelligence generation, encourages trust, reduces perceived nickel-and-diming, and mirrors internal provider cost discipline. |
| Implementation Complexity | Medium |
| Priority | High |
| Status | Captured |
| Notes | Requires a definition of unique asset, freshness window, manual refresh behavior, batch evaluation rules, failed/partial intelligence handling, team/account-level credit ownership, and reporting. |

#### Philosophy

Customers pay for new intelligence generation.

Customers do not pay for:

- Repeated viewing.
- Cached intelligence inside a freshness window.
- Reopening the same evaluation.
- Reviewing historical output that did not require regeneration.

The platform should reward efficient use of cached intelligence.

#### Examples

```text
First evaluation of Mox Opal today
  -> 1 Credit

Second evaluation of Mox Opal today
  -> 0 Credits

Manual Refresh
  -> 1 Credit

Batch Evaluation
  -> Credits per unique asset requiring fresh intelligence
```

Future subscriptions may include monthly credit allocations.

#### Alignment With Provider Economy

Internal provider economy:

- Provider observations are cached to reduce API costs.
- Replay fixtures reduce development API costs.
- Repository freshness avoids unnecessary refreshes.

External customer economy:

- Generated intelligence is cached to reduce customer credit consumption.
- Repeated viewing should not consume credits.
- Customers benefit from the same efficiency discipline the platform uses internally.

The platform rewards efficiency on both sides.
