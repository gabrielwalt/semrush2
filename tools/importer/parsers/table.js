/* eslint-disable */
/* global WebImporter */
/**
 * Parser for table (vanilla Block Collection "table").
 * Source: https://www.semrush.com/pricing/ (div[class*=MultiColumnTable])
 * Generated: 2026-06-26
 *
 * Structure (from library-description "Table" + blocks/table/table.js):
 *   Row 1: block name
 *   Row 2 (header): [feature label, Pro, Guru, Business] — first row becomes <thead>.
 *   Subsequent rows: one per feature with its cell values.
 *
 * The "Compare Plans" comparison table is a CSS-grid pseudo-table:
 *   - the header (`___SHead`) holds the plan column titles (Pro/Guru/Business);
 *   - the body (`___SBody`) holds `tableRow`s, each with cell wrappers.
 * Some body rows are category dividers with only a label cell (e.g.
 * "Website monitoring"); these are padded out to the full column count.
 * Checkmark images carry screen-reader "Yes" text, which we surface as the
 * cell value; numeric/text values are taken verbatim.
 */
export default function parse(element, { document }) {
  const cells = [];

  // --- Header row: feature-label slot + plan column titles ---
  const planTitles = Array.from(
    element.querySelectorAll('[class*="tableHeaderColumn--"] [class*="columnTitle--"]'),
  ).map((el) => el.textContent.replace(/\s+/g, ' ').trim());

  const tableName = element.querySelector('[class*="tableName--"]');
  const labelHeader = tableName ? tableName.textContent.replace(/\s+/g, ' ').trim() : '';

  const columnCount = planTitles.length + 1; // label column + plan columns

  const headerRow = [labelHeader, ...planTitles];
  // Pad header to column count just in case
  while (headerRow.length < columnCount) headerRow.push('');
  cells.push(headerRow);

  // Helper: read a cell wrapper's value (checkmark → "Yes", else its text)
  const readCellValue = (wrapper) => {
    // Title cell — feature name (button text) + optional tag
    const nameText = wrapper.querySelector('[class*="NameColumnText--"]');
    if (nameText) {
      return nameText.textContent.replace(/\s+/g, ' ').trim();
    }
    // Plain bold label (category cell)
    const cellInner = wrapper.querySelector('[class*="tableCell--"], [class*="SCell"]') || wrapper;
    // Checkmark icon → use the screen-reader-only text ("Yes")
    const srOnly = cellInner.querySelector('[class*="ScreenReaderOnly"]');
    if (srOnly && cellInner.querySelector('img')) {
      return srOnly.textContent.replace(/\s+/g, ' ').trim() || 'Yes';
    }
    // Otherwise the visible text value (e.g. "500", "unlimited")
    const text = cellInner.textContent.replace(/\s+/g, ' ').trim();
    return text;
  };

  // --- Body rows ---
  const rows = Array.from(element.querySelectorAll('[class*="tableRow--"]'));

  rows.forEach((row) => {
    const wrappers = Array.from(
      row.querySelectorAll(':scope > [class*="SCellWrapper"]'),
    );
    if (!wrappers.length) return;

    const rowValues = wrappers.map((w) => readCellValue(w));

    // Pad/truncate to the column count (category-divider rows have only a label)
    while (rowValues.length < columnCount) rowValues.push('');
    if (rowValues.length > columnCount) rowValues.length = columnCount;

    cells.push(rowValues);
  });

  // Empty-block guard (only the header was produced)
  if (cells.length <= 1) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'table', cells });
  element.replaceWith(block);
}
