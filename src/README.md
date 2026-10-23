# Selected original automation helpers

I used Apps Script for work that formulas alone could not handle: preparing customer billing files, locating workbooks in Drive, and distributing the management report.

These two small exhibits retain the recovered helper bodies, with trailing whitespace normalized:

- [Dashboard range detection](dashboard-range.js) scans displayed data values to find the report boundary.
- [Recursive file search](drive-file-search.js) finds the first exact filename match in a Drive folder tree.

The surrounding billing script copies a template, maps customer fields by worksheet headers, hides billing-period sheets, copies pricing values and selected formatting, then distributes and archives prepared files. Customer and pricing selection use filename substrings; uniqueness is not enforced. Pricing is a copied snapshot, but rerunning the function can overwrite it. Distribution can rename an existing file, copy replacements and trash the staging original; those steps have no transaction or rollback.

The reporting script exports the dashboard as a landscape PDF and emails recipients read from a worksheet. Source inspection establishes the sequence, not PDF rendering correctness or successful delivery. Neither project was executed during this review. One billing error path references `listAllSheetNames`, whose definition was not present in the recovered file; this is not a complete deployment package.

## Check the helpers locally

Run `node tests/source-helpers.test.js` from the repository root. The [six checks](../tests/source-helpers.test.js) use fictional Drive objects and worksheet values, without Google service calls.

The checks make edge cases visible: zero values and Date objects do not extend the detected dashboard boundary, false booleans do, and an all-zero or blank matrix falls back to worksheet dimensions. Recursive search returns the first match and does not establish filename uniqueness. These tests verify the helpers against selected inputs; they do not validate production execution, access, triggers or email delivery.
