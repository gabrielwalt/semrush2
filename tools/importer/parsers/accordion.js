/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion (vanilla Block Collection "accordion").
 * Source: https://www.semrush.com/pricing/ (section:has(h3[class*=SItemToggle]))
 * Generated: 2026-06-26
 *
 * Structure (from library-description "Accordion" + blocks/accordion/accordion.js):
 *   Row 1: block name
 *   One row per Q&A pair, 2 cells:
 *     cell 1: question text
 *     cell 2: answer text
 *
 * Each FAQ item is an `h3.___SItemToggle` (the question). The answer lives in
 * the immediately-following sibling `___SCollapse`/`collapseContent` element
 * when present. Some answers are lazily rendered only on expand and may not be
 * in the static DOM; those rows are emitted with an empty answer cell so the
 * 2-column structure is preserved and the question is never lost.
 */
export default function parse(element, { document }) {
  const toggles = Array.from(
    element.querySelectorAll('h3[class*="SItemToggle"]'),
  );

  const cells = [];

  toggles.forEach((toggle) => {
    // Question text — the label span inside the toggle (ignore the chevron icon)
    const questionSpan = toggle.querySelector('span');
    const questionText = (questionSpan || toggle).textContent.replace(/\s+/g, ' ').trim();
    if (!questionText) return;

    const questionEl = document.createElement('p');
    questionEl.textContent = questionText;

    // Answer — the next sibling collapse/content element, if present in the DOM
    const answerCell = [];
    let sibling = toggle.nextElementSibling;
    if (sibling && /SCollapse|Collapse/.test(sibling.className || '')) {
      const content = sibling.querySelector('[class*="collapseContent--"]') || sibling;
      const answerText = content.textContent.replace(/\s+/g, ' ').trim();
      if (answerText) {
        const p = document.createElement('p');
        p.textContent = answerText;
        answerCell.push(p);
      }
    }

    cells.push([
      [questionEl],
      answerCell.length ? answerCell : '',
    ]);
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion', cells });
  element.replaceWith(block);
}
