# Atlas Backlog

## High Priority

- Add Atlas visual Market Ontology capability matrix.
- Remove Transitional Evidence Projection after Market Intelligence Engine implementation.
- Add persistent Atlas Evidence Coverage Map explorer.
- Add domain-level provider priority configuration.
- Add Market Ontology consensus rules after multiple connected providers support the same domain.
- Add database-backed Market Intelligence Repository storage.
- Add future Market Consensus Engine once multiple validated market providers are available.
- Add Atlas Evidence Stack visual explorer for market provider provenance.
- Add provider-priority configuration editor once provider administration exists.
- Expand provider identity evidence coverage for collector number, language, product identifiers, and timestamps.
- Add distributed background refresh workers for stale repository fields.
- Add repository storage adapters for SQLite, PostgreSQL, Redis, and cloud object storage.
- Add JustTCG Provider SDK retry hooks.
- Add JustTCG Provider SDK cache hooks.
- Expand JustTCG known-card retrieval into production-safe lookup flows.
- Add official-provider Certification population ingestion once permitted sources are selected.
- Configure credentialed TCGplayer API access for live marketplace synchronization.
- Expand TCGplayer provider coverage beyond Sprint 30 verification assets.
- Migrate Scryfall Identity Provider to the Provider SDK lifecycle.
- Migrate Scryfall Market Provider to the Provider SDK lifecycle.
- Add approved live SDK adapters for EDHREC, PSA, BGS, CGC, Cardmarket, Melee, MTGO, LigaMagic, and eBay.
- Add provider-backed relationship enrichment for the Asset Knowledge Graph.
- Add Assessment driver calibration from Evaluation History outcomes.
- Add Atlas Assessment diagnostics for drivers, risk factors, and evidence coverage.
- Add configurable Assessment source weights.
- Add relationship confidence calibration after approved provider integrations exist.
- Add graph export diagnostics to Atlas Inspector.
- Add EDHREC Playability Provider once an approved integration path exists.
- Add MTGGoldfish, Melee, MTGO, and Tournament API Playability providers once approved integration paths exist.
- Add provider-specific adapters for EDHREC, MTGGoldfish, Melee, MTGO, and Tournament APIs.
- Add Provider SDK contract tests for retry and validation failure paths.
- Add automated validation for Playability role classification.
- Add generated Evidence Sufficiency reports grouped by Intelligence model.
- Add a command or script to run `RepositoryScanner` and write generated summaries.
- Generate `ATLAS_SPRINT_REPORT.md` from git status, repository scan data, and canonical docs.
- Add architecture drift detection between `docs/ARCHITECTURE.md` and repository structure.
- Track known issues with status, owner, first-seen sprint, and last-verified date.

## Medium Priority

- Add automated UI assertions that Vendor Workspace Intelligence panels contain no implementation terminology.
- Add automated UI assertions for expanded Intelligence tile session memory.
- Add provider-backed Playability demand validation against known format staples.
- Add card role confidence calibration from provider evidence once integrations exist.
- Add visual regression coverage for Unknown grade presentation.
- Add Certification provider health diagnostics for PSA, BGS, CGC, TAG, SGC, and ARS.
- Add Certification cross-grading and population growth indicators.
- Generate dependency graphs for engines, providers, intelligence models, workflows, and UI boundaries.
- Add documentation freshness checks for sprint history, roadmap, decisions, prompts, and architecture docs.
- Add a generated technical-debt report grouped by subsystem.
- Add report templates for architecture review and regression review.

## Low Priority

- Add Markdown index pages for each Atlas folder.
- Add lightweight changelog generation for Atlas-only changes.
- Add repository statistics snapshots by sprint.

## Research

- Evaluate official certification population data access patterns without scraping or unofficial APIs.
- Evaluate static import graph tooling that can remain internal-only.
- Explore AST-based boundary checks for production imports from Atlas.
- Explore comparing Evaluation History and Pipeline Reports once persistence exists.

## Future Platforms

- Atlas Architecture Graph.
- Atlas Intelligence Implementation Ledger.
- Atlas Sprint Autowriter.
- Atlas Risk Radar.
- Atlas Documentation Freshness Monitor.
- Atlas Regression Intelligence.
- Atlas Technical Debt Ledger.
