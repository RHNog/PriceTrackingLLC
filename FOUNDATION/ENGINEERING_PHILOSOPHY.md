# Engineering Philosophy

Engineering in Project Phronesis exists to build practical judgment infrastructure.

The platform is not a collection of features. It is a system for moving from observation to reasoning to decision without losing context, provenance, or uncertainty.

## Core Belief

Evidence must precede conclusions.

This matters because collectible-market decisions often happen under pressure with incomplete data. If the platform hides missing evidence or treats provider output as truth, it creates false confidence. Engineering must make uncertainty visible rather than conceal it.

## Engineering Principles

### Explainability Over Opacity

Every meaningful output should be explainable.

Scores, grades, and decisions are useful only when the platform can explain what evidence supported them, what confidence they carry, and what limitations remain.

### Observations Separate From Reasoning

Providers contribute observations. The platform interprets them.

This boundary matters because provider fields are not automatically business truth. Observations must be classified, validated, attributed, and interpreted before they influence user decisions.

### Explicit Boundaries Over Hidden Coupling

Identity, eligibility, providers, repository, evidence, market intelligence, assessment, strategy, negotiation, and decision each have separate responsibilities.

The system should be understandable by its boundaries. If one layer silently performs another layer's job, the architecture becomes harder to trust and harder to extend.

### Careful Systems Over Clever Systems

Project Phronesis should prefer architecture that future contributors can reason about.

Clever shortcuts are acceptable only when they remain explainable, traceable, and bounded. A shortcut that makes future reasoning harder is a debt, even if it works today.

### Documentation As Implementation

The written architecture is part of the system.

Meaningful changes require Feature IDs, specifications, prompts where relevant, release notes, and dependent documentation updates. Future AI agents and future humans should never need founder memory to understand why the system behaves as it does.

## Engineering Standard

Before implementing, ask:

- What evidence supports this behavior?
- Which layer owns it?
- What happens when evidence is missing?
- What does the user see?
- What remains internal?
- How will a future agent understand this change?

If those questions cannot be answered, the work is not ready.
