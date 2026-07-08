# Decisions

## Major Product And Architecture Decisions

1. PriceTrackingLLC is not a price tracker. It is a decision platform.

2. Identity and pricing are separate domains. Identity Providers and Market Providers are different provider families.

3. Provider data must be adapted and normalized before entering the domain model.

4. Search became the Query Engine. The system interprets intent instead of only matching text.

5. The Query Engine must be dictionary-driven. Game knowledge lives in `knowledge/` packages.

6. Canonical Resolution exists because vendors use community shorthand such as `bolt`, `fow`, `bob`, and `monkey`.

7. Intent Resolution exists because user queries communicate meaning, not just keywords.

8. Entity Resolution exists because related card entities are not equivalent to the intended card identity.

9. Constraint Satisfaction exists because selecting a printing is different from selecting a card identity.

10. Condition and grading should not select printings. They should be preserved for purchase evaluation.

11. Images belong to domain objects, not UI-specific provider calls.

12. A printing is not always the final purchasable object. Multi-finish printings require explicit finish variant resolution before evaluation.

13. Vendor Workspace must not auto-select a finish unless the query or source data makes the finish unambiguous.

14. Scryfall pricing is a daily market estimate source. It must not be represented as live listings, recent sales, or buylist data.

15. Purchase evaluation should consume normalized market prices, not provider-specific response shapes or listing-shaped placeholders.

16. Future adaptive systems should learn vocabulary and behavior without changing core parser logic.

## Documentation Rule

Every sprint must update:

1. `CHANGELOG.md`
2. `docs/SPRINT_HISTORY.md`
3. `docs/AGENT_HANDOFF.md` if current state or next steps changed
4. `docs/ARCHITECTURE.md` if architecture changed
5. `docs/ROADMAP.md` if priorities changed
6. `docs/DECISIONS.md` if a major product or architecture decision was made

No sprint is complete until documentation is updated.
