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

12. A printing is not always the final purchasable object. Multi-finish printings require finish variant resolution before evaluation.

13. Vendor Workspace must not implement finish defaults. The Variant Resolution Policy owns automatic finish selection.

14. Scryfall pricing is a daily market estimate source. It must not be represented as live listings, recent sales, or buylist data.

15. Purchase evaluation should consume normalized market prices, not provider-specific response shapes or listing-shaped placeholders.

16. Nonfoil is the default purchasable variant when a multi-finish printing includes Nonfoil and the user did not request another finish.

17. Purchase evaluation should explain BUY / NEGOTIATE / PASS decisions with profit, ROI, margin, confidence, and recommended offer.

18. Vendor Workspace should be decision-first: printing exploration and purchase decision must remain visible together on desktop.

19. Decision Drivers are business-engine output, not presentation copy assembled in UI.

20. Vendor Workspace should evaluate automatically after short input debounce instead of requiring a manual Evaluate button.

21. Printing refinement should prefer buyer vocabulary chips before free-text filtering.

22. Keyboard shortcuts must accelerate the buying workflow without overriding normal input, select, or textarea behavior.

23. Card Intelligence must never decide BUY, NEGOTIATE, or PASS. It only produces reusable signals.

24. Strategies interpret Card Intelligence signals through explicit signal weights.

25. Negotiation Ladder is the single source of truth for negotiation guidance.

26. Decision Resolver compares asking price against the Negotiation Ladder and must not contradict it.

27. If asking price is less than or equal to Target Offer, the decision must be BUY.

28. If asking price is greater than Target Offer and less than or equal to Maximum Buy Price, the decision must be NEGOTIATE.

29. If asking price is greater than Maximum Buy Price, the decision must be PASS.

30. Condition influences market estimate, Negotiation Ladder, Card Intelligence, and purchase evaluation, but never identity resolution.

31. Signal versions protect future intelligence changes from breaking the architecture.

32. Future adaptive systems should learn vocabulary and behavior without changing core parser logic.

## Documentation Rule

Every sprint must update:

1. `CHANGELOG.md`
2. `docs/SPRINT_HISTORY.md`
3. `docs/AGENT_HANDOFF.md` if current state or next steps changed
4. `docs/ARCHITECTURE.md` if architecture changed
5. `docs/ROADMAP.md` if priorities changed
6. `docs/DECISIONS.md` if a major product or architecture decision was made

No sprint is complete until documentation is updated.
