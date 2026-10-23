# Keeping records and reports connected

A billing amount, a delivery balance, and a collection status answer different questions. They still need to agree about the work they describe. In the documented operating process, corrections belong at the originating service record; downstream workbooks consolidate those outputs and track what happens next.

## Controls described in the operating documentation

| Area | Documented practice | What has been inspected |
|---|---|---|
| Billing reconciliation | Compare pickup, delivery and customer records; correct agreed discrepancies in originating service sheets | Selected quantity, pricing and statement formulas; reconciliation execution not observed |
| Pricing | Copy customer-specific prices into monthly workbooks as period snapshots | Local exact-match price lookup and pricing-copy script inspected; script not executed |
| Billing status | Record timestamped status updates; derive current status from the latest event | Module documentation only; timestamp ties and update implementation remain unverified |
| Item/process standards | Maintain shared item references and processing aliases | Override precedence and exact-match parameter formulas inspected |
| Workbook integration | Resolve Summary locations through a registry | Selected registry lookup/import formula inspected |

Delivery completion is a documented billability rule. The selected formula trace has not established its enforcement; the [billing case study](case-studies/billing-and-collections.md) explains that distinction.

## What the inspected formulas actually do

Some lookup expressions use `IFNA` to return blank for missing matches. The inspected service-price and amount expressions use `ISERROR` to return blank when their enclosed expressions fail. Those wrappers affect the displayed result; they do not, by themselves, record or explain an exception.

The alias override checks whether a value is present, then uses it as the processing key. The expression does not validate that the override exists in the parameter table. The weight expression selects a denominator by presence rather than checking for a positive numeric value.

These are useful boundaries to understand when maintaining the system. They are not claims that particular failures occurred.

## Checks I would add

The following are recommendations, not confirmed production controls:

- Report missing, duplicate and unmatched reference keys explicitly.
- Check input units and positive numeric quantities before calculating implied weights.
- Compare the dynamic and static reference outputs used by downstream consumers.
- Reconcile selected source totals with consolidation outputs and record freshness.
- Define and check status-event tie handling and any permitted transition rules.

The [verification record](verification.md) states the inspection scope. No production permissions, formulas or triggers were changed for this documentation.
