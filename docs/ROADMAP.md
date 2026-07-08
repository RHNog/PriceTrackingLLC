# Roadmap

## Completed Or Mostly Completed

- Application shell
- Hot Opportunities
- Watchlists
- Vendor Workspace
- Opportunity Engine
- Profit Engine
- Ranking Engine
- Strategy Engine
- Search Engine
- Query Engine
- Knowledge Platform
- Scryfall Identity Provider
- Canonical Resolution
- Intent Resolution
- Entity Resolution
- Constraint Satisfaction
- Prefix Matching and Progressive Query Resolution
- Progressive printing refinement
- Scryfall Market Provider v1
- Vendor Workspace daily market estimates
- Variant Resolution Policy
- BUY / NEGOTIATE / PASS purchase evaluation
- Decision-first Vendor Workspace
- Vendor Workspace VX optimization
- Card Intelligence Platform
- Asset Intelligence Framework
- Intelligence Console v2
- Intelligence Tile pattern
- Intelligence grade mapping
- Business Profiles Platform
- System Readiness Platform
- Pipeline Integrity
- Pipeline Inspector
- Offer Policy extraction
- Certification Intelligence Platform
- Layered Intelligence Console information architecture
- Final Intelligence Console UI contract
- Playability Intelligence Level 2
- Evidence Sufficiency Framework
- Playability Intelligence Level 3
- Asset Knowledge Graph
- Relationship Registry
- Asset Assessment Engine
- Assessment Registry
- Assessment Drivers
- Risk Factors
- Evidence Coverage
- Intelligence Provider SDK
- Provider SDK Registry
- Provider SDK Diagnostics
- Certification Provider Registry
- Placeholder PSA, BGS, and CGC certification provider coverage
- Marketplace Profile templates
- Cost Profile assumptions
- Playability Intelligence Platform
- Playability Provider Registry
- Scryfall legalities as first Playability provider source
- Condition Resolution
- Market Context foundation
- Negotiation Ladder Engine
- Offer Ladder Validator
- Decision Resolver
- Vendor Workflow State Machine
- Context Invalidation Engine
- Project Atlas

## Current Sprint

Sprint 29: Intelligence Provider SDK

Goals:

- Introduce a reusable provider lifecycle contract.
- Keep providers responsible for supplying data only.
- Move normalization, health, cache hooks, diagnostics, evidence mapping, confidence contribution, metadata, retry hooks, and validation hooks into SDK infrastructure.
- Prepare planned adapters for EDHREC, PSA, BGS, CGC, Cardmarket, TCGplayer, Melee, MTGO, LigaMagic, and eBay.
- Avoid live integrations until approved provider paths exist.

## Near-Term Roadmap

Sprint 25: Live Hot Opportunities

Sprint 26: Live Marketplace Listings

Sprint 27: Printing Descriptor Engine

## Future Roadmap

- Market Provider integrations
- Provider SDK migration for existing Scryfall identity and market providers
- Pricing normalization
- Currency engine
- Market Context Engine
- Persisted Business Profiles
- Business Profile import / export
- Persisted Pipeline Reports for failed evaluations
- Pipeline Report snapshots in Evaluation History
- Business Profile policy validation before save
- Asset Intelligence model health dashboard
- Official certification population providers
- Certification cross-grading indicator
- Certification population growth indicator
- Intelligence Console keyboard and visual regression coverage
- Liquidity Engine
- EDHREC Playability Provider
- MTGGoldfish Playability Provider
- Melee / MTGO / Top8 competitive metagame providers
- Provider-backed Knowledge Graph relationship enrichment
- Relationship confidence calibration from approved providers
- Assessment provider/source weighting controls
- Assessment driver calibration from historical outcomes
- Tournament API Playability Provider
- Deck Penetration indicator implementation
- Meta Stability and Trend provider implementation
- Historical Analytics Engine
- Regional valuation
- Currency normalization
- Import cost modeling
- Regional demand and format popularity
- BR to USA arbitrage
- ARIA active-descendant keyboard refinement for printing rows
- Persisted Vendor Workflow diagnostics behind a development-only surface
- Workflow command analytics for failed or abandoned in-person evaluations
- Persisted Atlas Inspector snapshots for replaying stale-context bugs
- Asset Context generation audit trail
- Condition Intelligence model for provider data gaps only
- Provider-vs-inference audit trail for condition pricing
- Historical intelligence browser
- Backtesting engine over Evaluation Snapshots
- Strategy Replay over immutable history
- Market Replay over historical snapshots
- Signal Validation against outcomes
- Simulation Platform powered by Evaluation History
- Historical backtesting that consumes Evaluation Trace
- Simulation engine for purchase scenarios
- Strategy replay and Evaluation replay
- Market Context replay
- Shared Workflow Command primitives for future workspaces
- Development-only workflow context inspector
- Persisted Vendor Workspace preferences
- Full browser visual regression checks once Playwright browsers are installed
- Portfolio intelligence
- Inventory management
- Strategy builder
- Knowledge Feedback Engine
- Behavior Engine
- Vendor Intelligence Engine
- Personal vocabulary
- Community vocabulary
- AI Knowledge Curator

## Roadmap Rule

When priorities change, update this file in the same sprint.
