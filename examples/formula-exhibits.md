# Formula chains behind the handoffs

**Evidence:** formula text observed in Billing Grabber. **Execution:** not run or recalculated during source inspection.

The observed expression below resolves a Summary workbook from a registry and imports its billing-output row. Private workbook identifiers and production values are not included.

```excel
=IFNA(IMPORTRANGE(VLOOKUP("Summary - " & $B4,'Hotel File - URL Index'!$D:$E,2,0),"'Billing - JAN - DEC'!$C$22:$22"),"")
```

Capitalization and whitespace are normalized; references and operators retain the observed formula’s structure. The original formula uses these worksheet labels and contains no hardcoded private workbook URL. This is not a self-contained runnable workbook.

| Input/dependency | Role |
|---|---|
| Current row column B | Supplies the configured Summary suffix |
| `Summary - ` prefix | Constructs the registry lookup key |
| Registry columns D:E | Resolve a workbook reference through exact matching |
| Source billing row | Supplies the consolidated outputs to import |
| Google Sheets authorization | Required for the external import |

The design separates location configuration from the recurring import expression. It depends on matching names, registry correctness, import access and a stable source layout. `IFNA` handles an applicable `#N/A` result; it is not a universal error handler and does not report a missing-match alert.

The referenced source row may spill across many columns; its full output contract and downstream consumers are not established by this one expression. No real customer names, rates, transactions or production links are needed to explain this mechanism.

No fictional dataset or substitute automation is included. This exhibit demonstrates inspected integration logic; it does not claim whole-system reproducibility.

## Keep maintained prices paired with sorted items

Within the inspected central price block, D3 sorts the maintained item list and E3 retrieves the matching price:

```excel
=sort(B$3:B)
=ifna(vlookup(D3,B$3:C,2,false),"")
```

The customer-specific tab uses its G1 selector to locate the relevant central-table header. These inspected expressions project the item and price output columns:

```excel
=ARRAYFORMULA(INDEX('Price List'!$1:$1000, ROW(A3:A), MATCH($G$1, 'Price List'!$1:$1, 0) + 2))
=ARRAYFORMULA(INDEX('Price List'!$1:$1000, ROW(A3:A), MATCH($G$1, 'Price List'!$1:$1, 0) + 3))
```

The offsets depend on the repeated four-column block layout. Headers must match; the formulas do not enforce unique customer headers. Billing Grabber subsequently copies values from that view into the monthly file. Local service-line formulas consume that copy rather than a live central price formula. See the [billing lifecycle](../docs/case-studies/billing-and-collections.md).

## Configure both the location and range

Loading Standards imports the item-name reference with:

```excel
=importrange('URL Sources'!C2,'URL Sources'!D2)
```

The URL Sources row records the data purpose, source filename, workbook location and tab/range. The expression stays the same when those connection settings change. A similar convention appears in the inspected Summary workbook, where sheet name and range are stored separately and combined into an address.

This is a recurring convention across selected modules, not a universal dependency catalogue. Billing Grabber also uses a separate workbook registry and retains a hardcoded external reference in another inspected expression. A `(REF)` name signals a reference role; its name alone does not prove how it is populated or refreshed.

## Select a billing cutoff before importing its total

In the sampled Summary, C22 combines configuration lookups with conditional ingestion:

```excel
=IFNA(
  LET(
    key, "Billing - " & $B22 & " - " & C$20,
    rng, INDEX($D$3:$G$14, MATCH(key, $B$3:$B$14, 0), MATCH(C$21, $D$2:$G$2, 0)),
    tabcell, IF(rng="", "", VLOOKUP(rng, $I$10:$K$16, 3, FALSE)),
    url, IF(rng="", "", VLOOKUP(key, 'Billing URLs'!$B:$C, 2, FALSE)),
    IF(rng="", "-",
      IMPORTRANGE(url, tabcell))
  ),
"NA")
```

| Binding | Meaning |
|---|---|
| `key` | Monthly billing filename built from account and month fields |
| `rng` | Applicable cutoff selected by matching both the monthly filename and cutoff header |
| `tabcell` | Statement tab and total-cell address resolved from the cutoff table |
| `url` | Monthly workbook location resolved from the billing registry |

An empty cutoff returns a dash; otherwise the resolved location and address feed `IMPORTRANGE`. `IFNA` returns the text `NA` for applicable missing/error results; it does not catch every failure. The inspected later-month cells included permission and internal-import errors. Earlier-month cells had populated results, but this is not a freshness or reconciliation test.

The expression is original source with outer whitespace stripped. The account and locations are supplied by worksheet cells rather than literal private identifiers. It depends on the surrounding configuration tables and cannot run as a standalone example.
