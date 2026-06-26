/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-testimonial.
 * Base block: carousel (one row per slide; each slide's single cell holds content).
 * Source: https://www.semrush.com/pricing/ (div[class*=testimonialsSlider])
 * Generated: 2026-06-26
 *
 * Structure (from block JS + authoring-analysis):
 *   Row 1: block name
 *   One single-cell row per unique slide: quote (blockquote), author name, company.
 *
 * NOTE: The source duplicates the leading slides for seamless looping
 * (5 unique slides, then repeats). We dedupe by quote text so only the
 * unique slides are emitted (same approach as the logos-marquee parser).
 */
export default function parse(element, { document }) {
  const slides = Array.from(
    element.querySelectorAll('[class*="testimonialsSlide--"]'),
  );

  const cells = [];
  const seen = new Set();

  slides.forEach((slide) => {
    const quoteEl = slide.querySelector('[class*="testimonialsSlideText--"], p');
    const quoteText = quoteEl ? quoteEl.textContent.replace(/\s+/g, ' ').trim() : '';

    // Dedupe looping duplicates by quote text
    if (!quoteText || seen.has(quoteText)) return;
    seen.add(quoteText);

    const contentCell = [];

    const bq = document.createElement('blockquote');
    bq.textContent = quoteText;
    contentCell.push(bq);

    const person = slide.querySelector('[class*="testimonialsSlidePerson--"]');
    if (person && person.textContent.trim()) {
      const p = document.createElement('p');
      p.innerHTML = `<strong>${person.textContent.replace(/\s+/g, ' ').trim()}</strong>`;
      contentCell.push(p);
    }

    const position = slide.querySelector('[class*="testimonialsSlidePersonPosition--"]');
    if (position && position.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = position.textContent.replace(/\s+/g, ' ').trim();
      contentCell.push(p);
    }

    cells.push([contentCell]); // 1-column row, one slide per row
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-testimonial', cells });
  element.replaceWith(block);
}
