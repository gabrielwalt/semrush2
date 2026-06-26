/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-addons.
 * Base block: cards (2 columns — icon image in cell 1, text content in cell 2).
 * Source: https://www.semrush.com/pricing/ (ul[class*="cards--"])
 * Generated: 2026-06-26
 *
 * Structure (from library-description "Cards" + authoring-analysis):
 *   Row 1: block name
 *   One row per add-on card:
 *     cell 1: icon image
 *     cell 2: title (heading), price text, bulleted feature list
 */
export default function parse(element, { document }) {
  const cards = Array.from(
    element.querySelectorAll('li[class*="styles-module__card--"], li[class*="__card--"]'),
  );

  const cells = [];

  cards.forEach((card) => {
    // Icon image (cell 1)
    const iconImg = card.querySelector('[class*="styles-module__icon--"] img, [class*="__icon--"] img');

    // Text content (cell 2)
    const contentCell = [];

    const title = card.querySelector('h3[class*="title--"], h3');
    if (title && title.textContent.trim()) {
      const h = document.createElement('h3');
      h.textContent = title.textContent.trim();
      contentCell.push(h);
    }

    // Price (the visible text span inside the price wrapper)
    const priceWrapper = card.querySelector('[class*="priceWrapper--"]');
    if (priceWrapper) {
      const priceSpan = priceWrapper.querySelector(':scope > span');
      const priceText = (priceSpan || priceWrapper).textContent.replace(/\s+/g, ' ').trim();
      if (priceText) {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${priceText}</strong>`;
        contentCell.push(p);
      }
    }

    // Feature list
    const featureList = card.querySelector('ul[class*="features--"]');
    if (featureList) {
      const items = Array.from(featureList.querySelectorAll(':scope > li'));
      if (items.length) {
        const ul = document.createElement('ul');
        items.forEach((item) => {
          const contentNode = item.querySelector('[class*="SContent"]');
          const text = (contentNode || item).textContent.replace(/\s+/g, ' ').trim();
          if (text) {
            const li = document.createElement('li');
            li.textContent = text;
            ul.append(li);
          }
        });
        if (ul.children.length) contentCell.push(ul);
      }
    }

    if (iconImg || contentCell.length) {
      cells.push([
        iconImg ? [iconImg] : '',
        contentCell.length ? contentCell : '',
      ]);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-addons', cells });
  element.replaceWith(block);
}
