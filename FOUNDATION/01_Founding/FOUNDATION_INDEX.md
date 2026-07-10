# Project Phronesis Foundation Index

The Foundation is the mature corporate knowledge structure for Project Phronesis.

It is the governing layer for philosophy, brand, business strategy, partnership materials, reusable templates, and presentation assets.

## Institutional Role

The Foundation exists so future contributors can make decisions consistent with Project Phronesis even when the founders are not present.

It governs:

```text
Engineering
  -> Product
  -> Business
  -> Partnership
  -> Brand
  -> Communication
```

The Foundation does not replace implementation documentation, product planning, business strategy, or partner materials. It organizes and governs them.

## Work Order Rule

Every future work order begins with:

```text
Foundation Check
  -> Architecture Check
  -> Implementation
```

### Foundation Check

Ask:

- Does this align with practical wisdom?
- Does this preserve evidence before conclusions?
- Does this improve explainability?
- Does this support judgment before automation?
- Does this strengthen platform coherence?
- Does this protect trust?

### Architecture Check

Ask:

- Which boundary owns this behavior?
- Does this preserve existing architecture?
- Does this require a Feature ID?
- Does this update canonical documentation?
- Does this avoid duplicating responsibility?

### Implementation

Implementation may proceed only after Foundation and Architecture checks pass or the exception is documented.

## Canonical Structure

```text
FOUNDATION/
  01_Founding/
  02_Brand/
  03_Business/
  04_Partnerships/
  05_Templates/
  06_Presentations/
  PARTNERSHIP_SUBMISSION_PACKAGE/
```

## 01_Founding

Canonical founding documents:

- `PROJECT_PHRONESIS_FOUNDING_CHARTER.md`
- `ENGINEERING_PHILOSOPHY.md`
- `PRODUCT_PHILOSOPHY.md`
- `BUSINESS_PHILOSOPHY.md`
- `COMMUNICATION_PRINCIPLES.md`
- `DECISION_PRINCIPLES.md`
- `FOUNDATION_INDEX.md`

Purpose:

Define why Project Phronesis exists, what it believes, and how decisions should be made.

## 02_Brand

Canonical brand documents:

- `BRAND_BOOK.md`
- `Brand_Production_Brief_v1.0.md`
- `Brand_Production_Brief_v1.0.docx`
- `Brand_Production_Brief_v1.0.pdf`
- `Brand_Board_v1.0.png`
- `CorporateStyleGuide.md`

Purpose:

Define brand philosophy, visual identity, production guidance, typography, color, design rules, and communication style.

## 03_Business

Canonical business documents:

- `BUSINESS_STRATEGY.md`
- `PRODUCT_ROADMAP.md`
- `MONETIZATION.md`
- `IDEA_LEDGER.md`
- `PARTNERSHIP_STRATEGY.md`
- `IP_STRATEGY.md`
- `PARTNER_DISCLOSURE_POLICY.md`

Purpose:

Separate business strategy, product direction, monetization possibilities, partnership posture, intellectual property boundaries, and disclosure rules.

## 04_Partnerships

Canonical partnership materials:

```text
04_Partnerships/
  TCGPLAYER/
    Proposal/
    Executive_Summary/
    Email/
    Executive_Deck/
```

Purpose:

Organize partner-specific proposals, executive summaries, outreach emails, and decks.

Future partners may include:

- PSA.
- Cardmarket.
- Beckett.
- eBay.
- Publishers.
- Distributors.
- Investors.
- Strategic marketplaces.

## 05_Templates

Canonical reusable templates:

- `CorporateProposalTemplate.md`
- `CorporateProposalTemplate.docx`
- `CorporateProposalTemplate.pdf`
- `ExecutiveDeckTemplate.md`
- `WhitepaperTemplate.md`
- `TechnicalProposalTemplate.md`
- `InvestorMemoTemplate.md`

Purpose:

Provide reusable formats for future proposals, decks, whitepapers, technical proposals, and investor memoranda.

## 06_Presentations

Presentation assets:

- Current and future presentation decks.
- Presentation-ready PDFs.
- Slide source files.

Purpose:

Collect presentation artifacts without replacing the canonical partner-specific folders.

## Partnership Submission Package

`FOUNDATION/PARTNERSHIP_SUBMISSION_PACKAGE/` is intentionally temporary.

Its purpose is to gather every document required to build a professional partnership proposal using another AI system such as Gemini.

No duplicate maintenance rule:

- Canonical documents remain in Foundation and docs.
- Future updates should be made to canonical documents first.
- The submission package should then be refreshed by copying the updated versions.

Start with:

- `FOUNDATION/PARTNERSHIP_SUBMISSION_PACKAGE/README.md`
