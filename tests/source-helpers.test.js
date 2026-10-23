// Isolated tests of recovered helper functions. No Google services are called.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const context = vm.createContext({});
for (const name of ['dashboard-range.js', 'drive-file-search.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src', name), 'utf8'), context);
}
function sheet(data, fallbackRow = data.length, fallbackCol = data[0]?.length || 0) {
  return { getDataRange: () => ({ getValues: () => data }),
    getLastRow: () => fallbackRow, getLastColumn: () => fallbackCol };
}
function range(data, fallbackRow, fallbackCol) {
  const r = context.findDataRange(sheet(data, fallbackRow, fallbackCol));
  return { lastRow: r.lastRow, lastCol: r.lastCol };
}
// Trailing blanks/zeros are excluded; false is deliberately retained by the source.
assert.deepEqual(range([['Title', '', 0], ['', false, 0], [' ', '', 0]]),
  { lastRow: 2, lastCol: 2 });
// Empty-content fallback uses sheet dimensions rather than returning a zero range.
assert.deepEqual(range([['', 0], ['', 0]], 4, 3), { lastRow: 4, lastCol: 3 });
// Date objects are not one of the helper's selected types: a trailing date is ignored.
assert.deepEqual(range([['Title', ''], ['', new Date('2026-01-01T00:00:00Z')]]),
  { lastRow: 1, lastCol: 1 });
function iterator(items) {
  let i = 0;
  return { hasNext: () => i < items.length, next: () => items[i++] };
}
function folder(files = [], children = []) {
  return { getFiles: () => iterator(files), getFolders: () => iterator(children) };
}
function file(name, url) { return { getName: () => name, getUrl: () => url }; }
// All names and return strings below are fictional; no Drive access occurs.
const nested = folder([], [folder([file('target', 'fictional-nested-location')])]);
assert.equal(context.findFileInFolder('target', nested), 'fictional-nested-location');
assert.equal(context.findFileInFolder('absent', nested), 'File not found');
// Search returns the first current-folder match before visiting nested folders.
const duplicates = folder([file('target', 'fictional-first-location')], [nested]);
assert.equal(context.findFileInFolder('target', duplicates), 'fictional-first-location');
console.log('6 isolated helper checks passed; no Google service execution.');
