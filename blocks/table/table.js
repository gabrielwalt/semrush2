/*
 * Table Block
 * Recreate a table
 * https://www.hlx.live/developer/block-collection/table
 */

// This project's scripts/scripts.js does not export moveInstrumentation, so
// provide a local equivalent: copy Universal Editor instrumentation attributes.
function moveInstrumentation(from, to) {
  if (!from || !to) return;
  [...from.attributes]
    .filter((attr) => attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-'))
    .forEach(({ name, value }) => {
      to.setAttribute(name, value);
      from.removeAttribute(name);
    });
}

/**
 *
 * @param {Element} block
 */
export default async function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const header = !block.classList.contains('no-header');

  [...block.children].forEach((row, i) => {
    const tr = document.createElement('tr');
    moveInstrumentation(row, tr);

    [...row.children].forEach((cell) => {
      const td = document.createElement(i === 0 && header ? 'th' : 'td');

      if (i === 0) td.setAttribute('scope', 'column');
      td.innerHTML = cell.innerHTML;
      tr.append(td);
    });
    if (i === 0 && header) thead.append(tr);
    else tbody.append(tr);
  });
  table.append(thead, tbody);

  // Enhance body cells to match the Semrush "Compare Plans" treatment.
  const CHECK_SVG = '<svg class="table-check" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M6.4 11.2 3.2 8l1.13-1.13L6.4 8.94l5.27-5.27L12.8 4.8z"/></svg>';
  [...tbody.children].forEach((tr) => {
    const cells = [...tr.children];
    const valueCells = cells.slice(1);

    // Category-group row: only the first cell has content, value cells empty.
    const isGroupRow = cells.length > 1
      && cells[0].textContent.trim() !== ''
      && valueCells.every((c) => c.textContent.trim() === '');
    if (isGroupRow) tr.classList.add('table-group-row');

    // Affirmative value cells ("Yes") render as a green checkmark; the text
    // is preserved as a visually-hidden accessible label.
    valueCells.forEach((td) => {
      if (td.textContent.trim().toLowerCase() === 'yes') {
        td.classList.add('table-yes');
        td.innerHTML = `${CHECK_SVG}<span class="table-yes-label">Yes</span>`;
      }
    });
  });

  block.replaceChildren(table);
}
