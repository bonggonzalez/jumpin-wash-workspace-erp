# Further work

The first priority is to understand the existing implementation precisely. These are proposed follow-ups, not features represented as already deployed.

| Priority | Follow-up | Reason |
|---|---|---|
| 1 | Trace the delivery-completion condition through the billing path | Establish how the documented operating rule is implemented |
| 1 | Resolve the alternate weight field’s intended units | Explain the calculation without guessing its meaning |
| 1 | Extend pricing and cross-workbook coverage beyond the inspected chains | Selected central-pricing-to-local-amount and configured-import chains are documented; other accounts, periods and exception paths remain unverified |
| 2 | Extend the selected static-weight consumer trace | One Summary kg-analysis consumer is established; other consumers and dynamic/static agreement remain open |
| 2 | Add explicit missing-reference and reconciliation diagnostics | Make exceptions visible rather than relying on blank outputs |
| 2 | Document selected KPI definitions and freshness dependencies | Make management figures easier to trace and maintain |

The earlier architecture work considered database-backed modernization. PostgreSQL, Python ETL, a warehouse and AI enhancements are not part of the implemented system demonstrated here. This repository does not undertake that rebuild.
