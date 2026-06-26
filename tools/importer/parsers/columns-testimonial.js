/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-testimonial.
 * Base block: columns (N cells = N columns).
 * Source: https://www.semrush.com/ (.mp-client-testimonials__layout)
 * Generated: 2026-06-26
 *
 * Structure (from library-description "Columns" + authoring-analysis):
 *   Row 1: block name
 *   One row with two cells —
 *     cell 1: brand logo image, blockquote, author photo and citation (name + role)
 *     cell 2: stat illustration image, big number, label text.
 */
export default function parse(element, { document }) {
  // Quote cell
  const quoteCell = [];
  const quoteBlock = element.querySelector('.mp-client-testimonials__quote-block, figure');

  if (quoteBlock) {
    // Brand logo
    const logo = quoteBlock.querySelector('.mp-client-testimonials__logo-img, img.mp-client-testimonials__logo-img');
    if (logo) quoteCell.push(logo);

    // Blockquote
    const quote = quoteBlock.querySelector('.mp-client-testimonials__quote, blockquote');
    if (quote && quote.textContent.trim()) {
      const bq = document.createElement('blockquote');
      bq.textContent = quote.textContent.trim();
      quoteCell.push(bq);
    }

    // Author photo
    const authorImg = quoteBlock.querySelector('.mp-client-testimonials__author-img, figcaption img');
    if (authorImg) quoteCell.push(authorImg);

    // Citation: name + role
    const cite = quoteBlock.querySelector('cite');
    if (cite) {
      const name = cite.querySelector('b');
      const role = cite.querySelector('span');
      if (name && name.textContent.trim()) {
        const nameP = document.createElement('p');
        nameP.innerHTML = `<strong>${name.textContent.trim()}</strong>`;
        quoteCell.push(nameP);
      }
      if (role && role.textContent.trim()) {
        const roleP = document.createElement('p');
        roleP.textContent = role.textContent.trim();
        quoteCell.push(roleP);
      }
    }
  }

  // Stats cell
  const statsCell = [];
  const statsBlock = element.querySelector('.mp-client-testimonials__stats-block, [class*="stats-block"]');

  if (statsBlock) {
    // Stat illustration
    const statImg = statsBlock.querySelector('img');
    if (statImg) statsCell.push(statImg);

    // Big number
    const number = statsBlock.querySelector('.mp-client-testimonials__stats-block-number, [class*="stats-block-number"]');
    if (number && number.textContent.trim()) {
      const numEl = document.createElement('h3');
      numEl.textContent = number.textContent.trim();
      statsCell.push(numEl);
    }

    // Label
    const label = statsBlock.querySelector('.mp-client-testimonials__stats-block-text, [class*="stats-block-text"]');
    if (label && label.textContent.trim()) {
      const labelP = document.createElement('p');
      labelP.textContent = label.textContent.trim();
      statsCell.push(labelP);
    }
  }

  // Empty-block guard
  if (!quoteCell.length && !statsCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // One row, two columns
  const cells = [[
    quoteCell.length ? quoteCell : '',
    statsCell.length ? statsCell : '',
  ]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-testimonial', cells });
  element.replaceWith(block);
}
