# Jumpin Wash — Commercial Laundry Operations System

Jumpin Wash is a commercial laundry serving hotels. Its Google Workspace system connects each hotel–department’s laundry service from pickup and delivery through billing and collection follow-up, while giving management a view across operations and finance.

The operating challenge is coordinating item-level delivery completion with pickup-based billing cutoffs: a pickup cannot be billed until every item is delivered, yet its statement period is set by the pickup date. For example, a June 14 pickup completed June 18 remains in the June 1–15 statement. Each hotel–department receives one Statement of Account per cutoff. These are owner-confirmed rules; automatic enforcement of the delivery gate has not been established by the selected formula review.

**See the system:** [Open the visual walkthrough](docs/implementation-walkthrough.md) for redacted production screens covering the combined SOS form, Statement of Account, Billing Tracker history, and Reports Dashboard.

## What the system does

Specialized Google Workspace workbooks, shared references, spreadsheet formulas, and Apps Script support pickup/service records, delivery and linen-balance records, monthly billing, hotel–department summaries, status tracking, and management reporting. Billing preparation uses local period pricing; the Billing Tracker records dated validation, acceptance, and payment statuses. The Reports Dashboard aggregates outputs from operations, billing, supplies, and finance. Some KPI formulas and their exact lineage remain untraced.

This repository follows how information moves between those parts and documents selected formulas, scripts, business relationships, and verification limits. Its proposed relational design is portfolio analysis, not a deployed database or an ERP rebuild.

## Reported business impact

Workforce assessments indicated billing turnaround moved from roughly **2–3 months to under one week**, and payroll preparation from **about one workday to two hours**. These are workforce assessments, not formal timing-study results.

## My contribution

I built the original Google Workspace production system and evolved it as operating needs changed. The project span of 2021–2026 is user-reported; available evidence does not date or attribute every later enhancement individually. The 2026 portfolio review mapped selected source-grounded business relationships, inspected formulas and Apps Script, and documented a proposed relational design. AI assisted this documentation and source review; it did not build the original system.

## Explore the evidence

| Start with | What it covers |
|---|---|
| [Visual walkthrough](docs/implementation-walkthrough.md) | Production screen tour, billing rules, formula example, contribution, impact, and evidence limits |
| [Production standards](docs/case-studies/production-standards.md) | Shared item definitions, new-item mapping, overrides, and processing parameters |
| [Billing and collections](docs/case-studies/billing-and-collections.md) | Customer pricing, monthly file preparation, service amounts, consolidation, and status tracking |
| [Executive reporting](docs/case-studies/executive-reporting.md) | Aggregate reporting inputs, management outputs, PDF/email distribution, and limits in KPI lineage |

The [business relationships](docs/business-data-model.md#1-business-relationships) explain the source basis for SOS, delivery, billing, and cutoff rules; [how the workbooks connect](docs/architecture.md) documents module relationships.

For implementation detail, inspect the [formula walkthrough](examples/formula-exhibits.md), [selected original automation helpers](src/README.md), and [data lineage](docs/data-model-and-lineage.md). The [proposed relational design](docs/business-data-model.md#3-proposed-relational-design) expresses business relationships as tables and constraints; it is separate from the deployed Google Workspace implementation.

## Scope and verification

The walkthroughs focus on billing, production standards, and reporting; payroll is part of the wider system but has no dedicated implementation walkthrough here. Selected source-derived formulas and historical documentation support different levels of detail; see [verification scope](docs/verification.md). Production records and private configuration are excluded. This is system documentation, not a complete deployment package. The selected Apps Script helpers have six isolated checks; they do not constitute a production test.
