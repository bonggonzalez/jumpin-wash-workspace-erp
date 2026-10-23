# From operational outputs to executive reporting

I wanted management to see what had arrived, what still needed delivery, and where billing was waiting in one place. I built **Reports Dashboard** to bring those answers into the **Jumpin Dashboard** worksheet while keeping operational calculations in their source workbooks.

The connections below come from the June 2026 module documentation. The bound PDF/email script was subsequently inspected directly; selected KPI formulas remain untraced.

## Start with the management question

| Question | Input to Reports Dashboard | Source module |
|---|---|---|
| What was the latest pickup volume? | Daily Pick-up with Loading and Pick-up Revenue references | Hotel Pick-up Entries and Night Shift Planning |
| Are deliveries keeping pace with pickups? | Delivery Report: kilograms, line items, and hotel-departments | Delivery Reporting |
| What remains undelivered? | Linen Balance: oldest balance and outstanding items | Linen Balance |
| Where is billing waiting? | Year-specific Billing Summary references | Balance - Billing - Collectible Dashboard |
| Is billing moving through the workflow? | Billing Status, summarized by week and month | Balance - Billing - Collectible Dashboard |
| What supplies need attention? | Reorder output imported through `IMPORTRANGE` | Supplies Inventory |

Monthly P&L comes from Financial Integrator; Revenue KG Tables come from Revenue Cost vs KG. The dashboard adds month-over-month and year-over-year comparisons to those outputs.

## Separate balances from movement

I needed both the amount waiting at each billing stage and the amount moving through the process. The dashboard combines 2025 and 2026 billing summaries into a total pipeline view. Its throughput section separately summarizes processing → validation, validation → collection, and collection → paid using local `SUMIFS` calculations over weekly and monthly periods.

Those summaries answer different questions. A large collection balance does not by itself show how much billing advanced during the week. The literal formulas and event-date criteria remain unrecovered, so treatment of repeated transitions and period boundaries is unresolved.

The production-priority section makes another small local transformation: it counts total and completed items from Night Shift Planning’s checklist and calculates completion percentage. It summarizes the checklist rather than recording production execution.

## Distribute the management view

The recovered `exportAndEmailJumpinDashboardPDF()` source reads the **Jumpin Dashboard** worksheet, uses `findDataRange()` to choose a range, requests a landscape PDF through the spreadsheet export endpoint, and checks for a successful HTTP response. It reads recipients from **Mailing List**, filters for addresses containing `@`, and sends the attachment through `MailApp`. A catch block logs errors and displays an alert.

This distribution belongs to **Reports Dashboard**; Balance - Billing - Collectible Dashboard supplies billing inputs and has a separate responsibility. The recipient filter is basic, with no deduplication. Source inspection does not establish trigger configuration, successful delivery, or correct PDF cropping.

The [original range helper and isolated checks](../../src/README.md) show a concrete tradeoff: nonzero numbers, nonempty strings and booleans extend the boundary; Date objects and zeros do not. When none qualifies, it falls back to worksheet dimensions. That behavior needs consideration when the layout changes.

## What the separation costs

Using shared reporting outputs let me bring the management view together without repeating each module’s calculations. It also made reporting dependent on upstream access, updates, and stable layouts. Delayed inputs could affect the dashboard without making it unreadable; a freshness warning or reconciliation control has not been verified.

The documentation describes local pickup fallbacks and a fixed printable layout. How those fallbacks refresh, and how the export handles an empty or changed layout, remain unresolved.

See [verification scope](../verification.md) for inspection boundaries and [billing and collections](billing-and-collections.md) for the upstream workflow.
