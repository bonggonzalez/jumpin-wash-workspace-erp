# Operational controls and implementation evidence

The operating system connects service records, billing, collection follow-up, and management reporting. This review distinguishes business controls described by the owner or operating documents from mechanisms verified in selected formulas and scripts.

## Controls and evidence

| Control or process | Operating meaning | Evidence and boundary |
|---|---|---|
| Delivery before customer acceptance | The hotel does not physically accept billing documents for a pickup until every item has been delivered. | Owner-confirmed external acceptance gate. The selected formula review does not establish an automatic spreadsheet block on preparation or submission. |
| Pickup-based cutoff | Pickup date determines the billing cutoff even when delivery completes later. | Owner-confirmed rule; selected statement-selection path inspected. This does not verify every workbook path. |
| One statement per account period | Prepare one Statement of Account per hotel–department and cutoff. | Owner-confirmed rule; statement and consolidation layouts reviewed. |
| Correct at source | Documented workflow assigns quantity corrections to the originating service record. | Operating documentation describes the practice; execution was not independently observed. |
| Customer-price snapshot | Copy customer-specific prices into monthly billing files as period snapshots. | Local exact-match price lookup and pricing-copy script inspected; script was not executed. |
| Track billing status | Record dated validation, acceptance, and payment updates in Billing Tracker. | Status fields and selected formulas inspected. Current status uses physical row order in the reviewed path; timestamp ordering and transition enforcement are unverified. |
| Maintain shared item/process standards | Use shared item references, aliases, overrides, and processing parameters. | Selected lookups and override precedence inspected; duplicate labels and an alias with differing parameter rows were observed. |
| Aggregate management outputs | Combine operating, billing, supply, and finance views in reports. | Dashboard sections and selected registry/import formulas inspected; some KPI formulas and complete data lineage remain untraced. |

## Formula behavior and exception visibility

Selected lookups use IFNA or ISERROR to return blanks for some missing-match or calculation errors. A blank output keeps an error string out of the displayed sheet, but it does not explain or log an exception. The alias override checks for a present value, then uses it as a processing key; the reviewed expression does not validate that key against the parameter table.

These are boundaries of inspected expressions, not claims that a particular production failure occurred.

## Recommended checks

These are improvement proposals, not confirmed production controls:

- Report missing, duplicate, and unmatched reference keys explicitly.
- Check input units and positive numeric quantities before calculating implied weights.
- Compare dynamic and static reference outputs used by downstream consumers.
- Reconcile selected source totals with consolidation outputs and record data freshness.
- Preserve event ordering explicitly and validate permitted status transitions.

The [visual walkthrough](implementation-walkthrough.md) shows the evidence in business context. The [verification record](verification.md) states the inspection scope. No production permissions, formulas, or triggers were changed for this portfolio review.