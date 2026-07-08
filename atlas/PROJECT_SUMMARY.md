# Project Summary

Sprint 24 adds Certification Intelligence as a first-class Asset Intelligence model.

Certification Intelligence measures collectible certification characteristics through a provider abstraction. Current coverage is placeholder-only for PSA, BGS, and CGC, with TAG, SGC, and ARS registered as future providers. It does not scrape, does not use unofficial APIs, and never decides BUY/PASS.

Dependency rule:

Certification Intelligence -> Collector Intelligence -> Strategy -> Negotiation Ladder -> Decision Resolver.

## Current Architecture

PriceTrackingLLC is a Next.js, TypeScript, and Tailwind CSS application for professional trading-card buying decisions.

The runtime architecture separates:

- Query and identity interpretation.
- Printing, finish, and condition resolution.
- Market provider normalization.
- Business Profile and Offer Policy assumptions.
- System Readiness and Pipeline Integrity.
- Card and Asset Intelligence.
- Strategy scoring.
- Negotiation Ladder generation.
- Offer Ladder validation.
- Deterministic decision resolution.
- Vendor Workspace presentation.

Atlas is not part of this runtime architecture. It is an internal companion system.

## Current Sprint

Atlas Sprint A1

## Current Milestone

Internal Development Companion foundation.

## Open Issues

- Atlas report generation is not automated yet.
- Known issues are tracked manually.
- Repository scanning is available as a standalone TypeScript utility but not connected to a script.
- Existing test execution needs a formal alias-aware test runner.

## Technical Debt

- Business Profile persistence remains future work.
- Readiness Reports and Pipeline Reports are not persisted.
- Live marketplace listings and recent sales are not integrated.
- Browser visual regression coverage is not active.
- Atlas has no drift detection yet.

## Next Recommended Sprint

Atlas Sprint A2: automate scanner execution, write generated summary output, add architecture drift checks, and produce a generated sprint report without touching runtime code.
