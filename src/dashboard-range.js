/**
 * Finds the last row and last column containing non-blank or non-zero data in a sheet.
 * This defines a tight export range to avoid extra blank pages.
 */
function findDataRange(sheet) {
  const dataRange = sheet.getDataRange();
  const data = dataRange.getValues();
  let lastRow = 0;
  let lastCol = 0;

  // --- 1. Find the Last Row ---
  for (let r = data.length - 1; r >= 0; r--) {
    const hasContent = data[r].some(cell =>
      (typeof cell === 'string' && cell.trim().length > 0) ||
      (typeof cell === 'number' && cell !== 0) ||
      (typeof cell === 'boolean')
    );
    if (hasContent) {
      lastRow = r + 1; // 1-based row number
      break;
    }
  }

  // --- 2. Find the Last Column ---
  if (lastRow > 0) {
    const maxColIndex = data.reduce((max, row) => Math.max(max, row.length), 0);

    for (let c = maxColIndex - 1; c >= 0; c--) {
      for (let r = 0; r < lastRow; r++) {
        const cell = data[r][c];
        if (
          (typeof cell === 'string' && cell.trim().length > 0) ||
          (typeof cell === 'number' && cell !== 0) ||
          (typeof cell === 'boolean')
        ) {
          lastCol = c + 1; // 1-based column number
          break;
        }
      }
      if (lastCol > 0) break;
    }
  }

  return {
    lastRow: lastRow || sheet.getLastRow(),
    lastCol: lastCol || sheet.getLastColumn()
  };
}
