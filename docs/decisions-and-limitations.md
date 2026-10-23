# Decisions and limitations

The system grew around Jumpin Wash’s operating needs. I used specialized workbooks, shared references and Apps Script to connect processes while the business continued operating. The architecture documentation records that evolution; it should not be read as a claim that every module began with a formal architecture plan.

## Choices that shape the system

**Separate responsibilities.** Monthly Billing workbooks hold service detail and calculations. Summary workbooks consolidate their outputs. Billing Tracker handles status. Reports Dashboard brings selected reporting outputs together. This makes the responsibilities understandable, while introducing cross-workbook dependencies.

**Reuse templates and configuration.** The documented Billing Grabber process provisions monthly workbooks and copies period pricing. Selected formulas show billing-period selection and registry-driven imports. Templates support recurring work, but naming, cell positions and annual/monthly organization become part of the operating contract.

**Share processing references.** Loading Standards maps items to process aliases and retrieves parameters through the effective alias. A small override expression provides explicit precedence. Key quality and override validity still matter; a lookup is not a complete reference-governance mechanism.

**Use quantity and weight for different questions.** The architecture documentation distinguishes customer fulfillment quantities from production workload in kilograms. The inspected weight expression includes a KG exception, but its alternate denominator’s units remain unresolved. Documentation of that formula does not establish dimensional correctness.

## Reading the evidence

Source-derived formulas in this repository were inspected as text, not executed end-to-end. Historical module documentation supports broader workflow descriptions. Operational improvements are based on on-ground workforce assessments. These evidence types support different claims.

The bound billing and dashboard script files have been recovered and inspected. Selected original helpers are included with isolated tests; surrounding Google service workflows were not executed. The billing file references an unavailable helper on an error path, so complete project recovery is not claimed. Delivery-gate enforcement, current status selection and complete KPI lineage remain open where noted.

The documents describe selected parts of a production system. They exclude customer records, financial transactions, salaries, pricing, personal data, credentials, private workbook locations and deployment configuration. They are not a complete installation or reproducibility package.

I built the original system. Current source inspection and documentation used AI assistance.
