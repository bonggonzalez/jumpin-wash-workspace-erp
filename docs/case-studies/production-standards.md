# Reference data and production planning

Shared item references, process aliases, override rules, and loading parameters.

An item name tells us what the customer sent. Production also needs to know how that item should be processed: the relevant loading quantity, processing time, and weight assumptions.

I brought those references together in Loading Standards. An item maps to a process alias, and that alias supplies the washer and dryer parameters. Items can share a processing definition, with an override where a different alias is needed. The module documentation connects these standards to Night Shift Planning; the formulas below show the reference mechanism itself.

The reference chain separates three choices: the item's usual process, any override, and the parameters selected by the effective process. The formulas below were inspected in the source workbook; [verification scope](../verification.md) records the inspection boundaries.

## Bring new items into the reference chain

Standard item labels originate in Hotel Pricing. Loading Standards records the external workbook location and source range in a **URL Sources** table, then imports those configured values into **(REF) Std Line Item Names**. The reference tab separates the incoming list from the local processing mappings.

When the central list gains an item, this expression identifies names not already in the established mapping:

```excel
=FILTER(E2:E, ISNA(MATCH(E2:E, A2:A, 0)))
```

Column E contains incoming names; A contains the established mapping's names. The result becomes a worklist for assigning added items. Separate lookups retrieve established and added mappings before the effective-alias rule below handles item-specific exceptions. In one inspected row, the added mapping supplied the alias while the established mapping was blank.

This lets reference maintenance accommodate new items without replacing the entire mapping table. The combined mapping concatenates the two lookup results; it assumes they do not conflict rather than enforcing that assumption. Added aliases sit beside a dynamically generated worklist, so changes in its ordering also need care to keep manual assignments paired with the intended items.

## One reference chain, several processing parameters

### Resolve an inherited alias or an override

The Load Parameters sheet keeps the mapped alias in B, an override in C, and the effective alias in D:

```excel
=if(C2<>"",C2,B2)
```

The override wins when present; otherwise the mapped alias carries through. That small expression lets the shared lookup chain handle an exception without replacing the rest of the row's formulas.

| Mapped alias | Override | Effective alias |
|---|---|---|
| Process A | Blank | Process A |
| Process A | Process B | Process B |

*Fictional labels illustrating the observed precedence rule; not production records or executed test results.*

This rule checks presence, not validity. It does not verify that the override exists in the downstream parameter table, and it does not retry B2 if an override later fails a lookup. A whitespace-only override or an unmatched alias therefore needs attention elsewhere; no separate diagnostic has been verified here.

### Look up shared processing parameters

The mapped alias is retrieved from the item-to-process reference with an exact match:

```excel
=ifna(vlookup(A2,'Std Line Item vs Process Proxy'!E$2:F,2,false),"")
```

The effective alias in D2 then selects processing parameters. For example, the observed washer-quantity expression is:

```excel
=ifna(vlookup($D2,'Item Process Details'!$B:$J,4,false),"")
```

Companion expressions retrieve washer minutes, dryer quantity, and dryer minutes using return indices 5, 7, and 8. One effective process key therefore drives several parameters. `IFNA` returns blank for a missing-match result; it does not validate reference-key uniqueness or provide an exception alert.

### Treat kilogram items separately

The current read confirms `Items`, `Washer qty`, `Manual Wt`, `KG or RW`, and `Implied Wt` headers. The classifier is:

```excel
=IF(REGEXMATCH(A3,"KG"),"KG",IF(REGEXMATCH(A3,"RW"),"RW",""))
```

It checks for `KG` before `RW`, returning blank when neither matches. The literal expressions contain no case normalization or token boundaries; classification depends on text matching, not a separately validated item type. The trailing source newline is omitted above.

The inspected implied-weight expression is:

```excel
=if(A3="","",if(D3 = "KG", "", if(B3<>"", 23/B3,23/C3)))
```

Its control flow is explicit: blank A3 returns blank; a `KG` classification in D3 returns blank; otherwise the expression divides 23 by B3 when B3 is nonblank, or by C3 otherwise.

The KG branch clearly returns blank. The alternate denominator needs clarification: column C is headed `Manual Wt`, yet the formula divides 23 by it. Its intended units remain unresolved, so this expression is shown as observed logic rather than a verified conversion.

## Dependencies, exceptions, and tradeoffs

- **Reference consistency:** shared aliases reduce repeated parameter definitions, but the lookup chain depends on consistent keys and appropriate override choices. Duplicate-key or missing-key controls have not been verified.
- **Input handling:** the denominator selection checks nonblank content, not positive numeric validity. Zero, incompatible text, or upstream errors are possible calculation concerns; no operational failure or native-engine test is claimed.
- **Dynamic versus static references:** a selected Summary consumer imports the static item and implied-weight columns, labelled as a retained reference from September 2025. This establishes one consumer, not all downstream use or automatic refresh.
- **Planning versus execution:** historical documentation describes a planning role, with limited adoption. There is no claim of optimized scheduling, consistent use, or measured production performance from these formulas.

## Count workload separately from revenue

A traced Summary workbook imports the static item names and implied weights into its own reference tab. Its monthly kilogram analysis looks up weight by item, uses measured kilograms for KG-labelled items, and derives quantity-based weight for selected other items. Rewash rows can contribute kilograms while showing zero revenue: work can consume processing capacity without adding sales.

The selected ordinary-item and rewash outputs were populated at inspection time. These are worksheet results, not independently reconciled weights. Text-based classification, separate-column import alignment and a fixed aggregation range remain dependencies; the unresolved alternate field's units are not settled by this consumer trace.

Historical documentation also connects standards to Night Shift Planning, where adoption was limited. Planning parameters are not measured production execution. See the [billing case study](billing-and-collections.md) for the pricing lifecycle and [formula walkthrough](../../examples/formula-exhibits.md) for cross-workbook configuration.
