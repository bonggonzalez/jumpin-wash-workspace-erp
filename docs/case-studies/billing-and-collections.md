# Connecting service records to billing and collections

At Jumpin Wash, billing starts with the laundry records: what was picked up, what was delivered, and which prices apply. After the statement is prepared, there is still another process to manage—reconciliation with the hotel, acceptance, and payment.

I built separate workbooks for those responsibilities and connected them. The monthly Billing workbook holds the service detail and calculations. Summary workbooks consolidate the monthly outputs. Billing Grabber brings those summaries together, while Billing Tracker follows the billing through validation, acceptance, and payment.

That connection is the part worth looking at closely. A statement, a collection status, and a management report serve different purposes, but they need to refer back to the same underlying work.

A **Service Order Slip (SOS)** represents one pickup form. The hotel physically accepts its billing documents only after all picked-up items have been delivered. Pickup date determines its statement period: a June 14 pickup completed June 18 remains in the June 1–15 statement. Each hotel–department has one Statement of Account per cutoff. These are owner-confirmed business rules; the selected formulas do not establish universal automatic enforcement. See [the business data model](../business-data-model.md) for the ER views and source mapping.

## Design and responsibilities

| Layer | Responsibility | Evidence |
|---|---|---|
| Service records | Capture pickup quantities, delivery quantities and service details | Workbook structure and selected formulas inspected |
| Monthly billing workbook | Select records for a billing period and assemble statement fields and totals | Selected formulas inspected |
| Customer pricing | Authoritative pricing copied into monthly workbooks as period snapshots | Pricing projections, local lookups and recovered distribution source inspected |
| Summary workbook | Consolidate monthly billing for a hotel/department | Selected cycle selection, conditional imports and totals inspected |
| Billing Grabber | Provision monthly workbooks and integrate Summary outputs | Provisioning source and integration formulas inspected |
| Billing Tracker | Track validation, acceptance and payment separately from quantities | Selected event fields, account/period matching and last-row status formulas inspected |

In the documented workflow, a quantity correction belongs in the original service worksheet. A status update belongs in Billing Tracker. Keeping those responsibilities separate means the tracker follows the billing without becoming another place to edit the quantities. This is an operating rule; permission enforcement has not been verified.

~~~mermaid
flowchart TD
  T["Service records"] --> B["Monthly billing"]
  B --> S["Hotel / department Summary"]
  S --> G["Billing Grabber consolidation"]
  G --> C["Billing Tracker"]
  C --> R["Collections reporting"]
~~~

*Workflow from module documentation; selected formula paths are examined below.*

## Inside the workbooks

### Preparing the monthly files

Billing Grabber also handles setup. The recovered source copies a billing template, matches customer information to the new filename, maps fields by header into Customer Details, and hides worksheets according to the configured billing cycle. A separate function copies pricing values and selected formatting into the prepared file. This creates a period pricing snapshot; it does not prevent later overwrites.

Distribution then copies files to customer destinations and an archive before trashing staging originals. Filename substring matching, first-match selection and the lack of rollback are practical limits of this implementation. I treat these as design tradeoffs visible in the source, not evidence that a production incident occurred. See the [automation exhibits](../../src/README.md) for code and inspection boundaries.

### From a maintained price list to a customer view

Hotel Pricing keeps item names and prices together in customer-specific input blocks. A sorted item column creates the ordered output; an exact lookup retrieves each corresponding price. Sorting the names does not independently reorder the price values and risk breaking the association.

Each customer worksheet then uses a selector in G1 to find its header in the central table. INDEX projects the corresponding sorted item and price columns into a consistent two-column view. I could maintain customer prices centrally while giving the monthly-file update a common source layout. The [formula walkthrough](../../examples/formula-exhibits.md) opens up these expressions.

A Revision History worksheet records changes and maintenance decisions, and dated retained price sheets preserve earlier references. These provide historical context; they are not an enforced, immutable audit trail. The copied monthly view includes an update-date field, but the inspection does not establish automatic selection of a particular historical revision by billing date.

### Period selection and record addressing

The monthly template supports different billing periods through configured day bounds. Its selection formula filters the service-sheet numbers by pickup day and transposes them into statement rows. Companion formulas use INDIRECT to address the corresponding service tab and retrieve its date, receipt reference, and amount.

The same template can therefore address repeated service worksheets and different billing periods. It also depends on consistent tab names and cell positions. The selector compares day-of-month values, so the monthly workbook boundary matters: this expression does not independently validate the complete date.

### Registry-based consolidation

Billing Grabber keeps workbook locations in a registry. Two FILTER formulas populate the configured lists. Each billing row builds a Summary lookup key, resolves the location with an exact-match VLOOKUP, and uses IMPORTRANGE to retrieve the billing-output row. An outer IFNA returns blank for an applicable missing-match error.

The [formula exhibit](../../examples/formula-exhibits.md) shows the expression. The import logic can be repeated across rows while workbook locations are maintained in the registry. Source layout, naming, and access are still dependencies; this inspection did not measure refresh latency or validate every configured import.

### Accommodating different billing schedules

One Summary structure handles monthly, biweekly and weekly accounts. A configuration table translates the account's billing cycle into applicable cutoffs, and another table maps each cutoff to a statement tab and total-cell address.

A LET expression names the monthly key, selected cutoff, source address and workbook location. It uses two-axis INDEX/MATCH selection and exact lookups to resolve those values, then calls IMPORTRANGE only when a cutoff applies. An inapplicable cutoff returns a dash. Local sums consolidate the cutoff values; Billing Grabber imports that standardized Summary output across accounts.

This is why the connection is more than an import formula: billing schedules, workbook locations and source addresses are represented as configuration that the recurring expressions use. The inspected earlier-month outputs were populated. Some later-month dependencies displayed permission or import errors at inspection time, so that observation does not establish a fully healthy current-year pipeline.

### Pricing and line amounts

The inspected service-line formulas look up the item in the local Price List, then multiply the quantity by the returned unit price. These are the actual formulas from the inspected workbook:

~~~excel
=IF(ISERROR(VLOOKUP(E10,'Price List'!$A$2:$B,2,FALSE)),"",VLOOKUP(E10,'Price List'!$A$2:$B,2,FALSE))
=IF(ISERROR(H10*O10),"",H10*O10)
~~~

Here, H is quantity, O is unit price, and P is amount. Both formulas return blank when the enclosed expression produces an error. That keeps error text out of the output, but it does not provide a visible exception alert. The same lookup expression appears twice; no execution-count or performance measurement is claimed.

### Hotel acceptance gate and spreadsheet evidence

The operating rule is that the hotel does not physically accept billing documents for a pickup until every item from that pickup has been delivered. This is an owner-confirmed customer-acceptance gate. It explains why completing delivery is part of the service-to-billing control loop.

The selected statement path filters by pickup day and reads a service-sheet total that sums line amounts. That limited formula trace does not establish an automatic spreadsheet block that prevents preparation or submission before delivery is complete. It also does not prove that such enforcement is absent elsewhere. The hotel's acceptance rule and spreadsheet enforcement are separate claims.

A delivery-date display formula uses non-KG pickup/balance totals and delivery-date cells to display a date or a dash. A displayed completion date alone does not prove that an incomplete pickup is excluded from billing. Further tracing would be needed to establish formula-level enforcement.

## Controls, exceptions and limits

- Historical documentation describes reconciliation against pickup forms, delivery records and customer records, with corrections at the source.
- Billing Tracker stores date/time fields, but inspected current-status formulas select the last matching physical row for account/month/cutoff in annual context. No claim of timestamp-based selection, immutable history or enforced transition order is made.
- The observed IFNA wrapper does not handle every possible import, permission or calculation error. A blank result can also reduce the visibility of a missing registry match.
- Registry naming, source layout and access dependencies are part of the integration design. Their failure modes are review considerations, not evidence of incidents.
- [Verification scope](../verification.md) records source inspection and execution boundaries.

## Contribution and operational context

I designed and built the original system. The formula excerpts retain the source worksheet labels and structure; capitalization and whitespace are normalized where noted.

On-ground assessments with the workforce indicated shorter billing turnaround. This assessment provides operational context; it was not a controlled timing study.