/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-cta.
 * Base block: columns (N cells = N columns).
 * Source: https://www.semrush.com/pricing/ (section[class*=CustomPlanRequest])
 * Generated: 2026-06-26
 *
 * Structure (from library-description "Columns" + authoring-analysis):
 *   Row 1: block name
 *   One row with two cells —
 *     cell 1: heading + feature list (the dark Enterprise demo banner copy)
 *     cell 2: "Request demo" CTA
 *
 * NOTE: The source CTA is a <button> with no href (it opens a JS modal). We
 * emit it as a link so authors can wire the target; text is preserved.
 */
export default function parse(element, { document }) {
  // Text/features cell
  const contentCell = [];

  const title = element.querySelector('h2[class*="title--"], h2');
  if (title && title.textContent.trim()) {
    const h = document.createElement('h2');
    h.textContent = title.textContent.replace(/\s+/g, ' ').trim();
    contentCell.push(h);
  }

  const featureList = element.querySelector('ul');
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

  // CTA cell
  const ctaCell = [];
  const button = element.querySelector('button[class*="button--"], button, a[class*="button--"]');
  if (button) {
    const text = button.textContent.replace(/\s+/g, ' ').trim();
    if (text) {
      const link = document.createElement('a');
      link.href = button.getAttribute('href') || '#';
      link.textContent = text;
      const p = document.createElement('p');
      p.append(link);
      ctaCell.push(p);
    }
  }

  // Empty-block guard
  if (!contentCell.length && !ctaCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Single content row, two columns
  const cells = [[
    contentCell.length ? contentCell : '',
    ctaCell.length ? ctaCell : '',
  ]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-cta', cells });
  element.replaceWith(block);
}
