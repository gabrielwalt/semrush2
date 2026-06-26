/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-promo.
 * Base block: columns (N cells = N columns).
 * Source: https://www.semrush.com/ (.mp-promo-cards-wrapper)
 * Generated: 2026-06-26
 *
 * Structure (from library-description "Columns" + authoring-analysis):
 *   Row 1: block name
 *   One row with two cells (one per promo panel). Each cell holds the panel's
 *   heading, description, CTA link, and a link to its video.
 *
 * NOTE: the cached wrapper also contains a sibling toolkits section; we scope
 * strictly to `section.mp-promo-cards` panels so that content is not pulled in.
 */
export default function parse(element, { document }) {
  const panels = Array.from(element.querySelectorAll('section.mp-promo-cards, .mp-promo-cards'));

  const rowCells = [];

  panels.forEach((panel) => {
    const cell = [];

    // Heading
    const title = panel.querySelector('.mp-promo-cards__title, h2');
    if (title && title.textContent.trim()) {
      const heading = document.createElement('h2');
      heading.textContent = title.textContent.replace(/\s+/g, ' ').trim();
      cell.push(heading);
    }

    // Description
    const description = panel.querySelector('.mp-promo-cards__description, p');
    if (description && description.textContent.trim()) {
      const descP = document.createElement('p');
      descP.textContent = description.textContent.trim();
      cell.push(descP);
    }

    // CTA
    const cta = panel.querySelector('.mp-button, a[class*="button"], a');
    if (cta && cta.href) {
      const link = document.createElement('a');
      link.href = cta.href;
      link.textContent = cta.textContent.trim();
      cell.push(link);
    }

    // Video → link to its first source so it imports as a video reference.
    // Handle lazy-loaded videos (src may live on data-src or on the <video> element).
    const videoEl = panel.querySelector('.mp-promo-cards__video, video');
    let videoSrc = '';
    if (videoEl) {
      const sourceEl = videoEl.querySelector('source');
      videoSrc = (sourceEl && (sourceEl.getAttribute('src') || sourceEl.getAttribute('data-src')))
        || videoEl.getAttribute('src')
        || videoEl.getAttribute('data-src')
        || '';
    }
    if (videoSrc) {
      const videoLink = document.createElement('a');
      videoLink.href = videoSrc;
      videoLink.textContent = videoSrc;
      cell.push(videoLink);
    }

    if (cell.length) rowCells.push(cell);
  });

  // Empty-block guard
  if (!rowCells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Single content row whose cell count equals the number of panels (columns)
  const cells = [rowCells];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
