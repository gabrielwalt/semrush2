/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-stats.
 * Base block: cards (no images variant — 1 column, one row per card).
 * Source: https://www.semrush.com/ (section.mp-stats)
 * Generated: 2026-06-26
 *
 * Structure (from library-description "Cards (no images)" + authoring-analysis):
 *   Row 1: block name
 *   One single-cell row per stat: number as heading, title, description paragraph.
 * The arrow span is decorative and is omitted.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.mp-stats__item, li[class*="stats__item"]'));

  const cells = [];

  items.forEach((item) => {
    const contentCell = [];

    // Large number → heading
    const count = item.querySelector('.mp-stats__item-count, [class*="item-count"] b, b');
    if (count) {
      const heading = document.createElement('h3');
      heading.textContent = count.textContent.trim();
      contentCell.push(heading);
    }

    // Short title
    const title = item.querySelector('.mp-stats__item-title, [class*="item-title"]');
    if (title && title.textContent.trim()) {
      const titleP = document.createElement('p');
      titleP.innerHTML = `<strong>${title.textContent.trim()}</strong>`;
      contentCell.push(titleP);
    }

    // Description
    const description = item.querySelector('.mp-stats__item-description, [class*="item-description"]');
    if (description && description.textContent.trim()) {
      const descP = document.createElement('p');
      descP.textContent = description.textContent.trim();
      contentCell.push(descP);
    }

    if (contentCell.length) {
      cells.push([contentCell]); // 1-column row
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-stats', cells });
  element.replaceWith(block);
}
