# Jumpin Wash | Hotel laundry service to billing

Jumpin Wash is a commercial laundry serving hotels. I built and evolved its live Google Workspace operations system to connect pickup and delivery work with customer billing, collection follow-up, and management reporting.

## The operating problem

A pickup can be delivered in stages and cross a billing cutoff. The pickup date sets the statement period, but the hotel does not physically accept billing documents for that pickup until every item has been delivered. Each hotel–department receives one Statement of Account (SOA) per cutoff. The system has to keep the service record, billing period, statement, and follow-up aligned.

![Redacted production Reports Dashboard showing Production, Admin, and Finance views](assets/evidence/04-live-reports-dashboard.png)

*Read-only export from the live Google Sheets dashboard. Client identifiers, date values, operating metrics, and formula-error cells are redacted.*

## The service-to-billing loop

| Step | How the operation works | Evidence in this repo |
|---|---|---|
| Record the service | The Service Order Slip (SOS) combines pickup and delivery information, with item lines and quantities. | [Matched SOS–SOA example](assets/evidence/05-service-to-statement-match.png) |
| Complete delivery | Pickup items move through delivery; the hotel’s acceptance gate is reached only after all items are delivered. | [Business rule and evidence boundary](docs/implementation-walkthrough.md#the-control-that-connects-delivery-to-billing) |
| Assign the cutoff | Pickup date determines the statement cutoff, even when delivery finishes later. | [Billing rule and example](docs/implementation-walkthrough.md#the-control-that-connects-delivery-to-billing) |
| Prepare and follow up | Billing is consolidated into one SOA per hotel–department/cutoff; dated tracker statuses follow validation, acceptance, and payment. | [SOA example](assets/evidence/05-service-to-statement-match.png) · [Tracker history](assets/evidence/03-billing-status-history.png) |

The hotel's physical acceptance rule is an operational control. The inspected statement formula does not establish that the spreadsheet automatically blocks preparation or submission for an incomplete pickup; this repo keeps those claims separate.

## Reported impact

Workforce assessments indicated billing turnaround moved from roughly **2–3 months to under one week**, and payroll preparation from **about one workday to two hours**. These are reported assessments, not results from a formal timing study.

## My role

I built the original Google Workspace production system during 2021–2024. In 2026, I reviewed selected formulas and Apps Script, mapped the business relationships, and documented a proposed relational design. AI assisted that review and documentation, not the original production system.

## Start here

**[Open the visual implementation walkthrough](docs/implementation-walkthrough.md)** for the screen-by-screen story, the hotel acceptance control, formula evidence, and a claim-to-evidence map.

For deeper detail, see [billing and collections](docs/case-studies/billing-and-collections.md), [production standards](docs/case-studies/production-standards.md), [executive reporting](docs/case-studies/executive-reporting.md), [controls and validation](docs/controls-and-validation.md), and the [source-grounded business model](docs/business-data-model.md).

This repository documents and analyzes the operating Google Workspace system. The proposed relational design is portfolio analysis; it is not a deployed database or an ERP rebuild. Production records and private configuration are excluded.
