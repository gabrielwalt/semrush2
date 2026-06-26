/**
 * Hero Search block.
 *
 * Authored structure (one cell) holds, in order:
 *   - h1            -> hero title
 *   - p             -> intro / subtitle
 *   - p             -> search-field placeholder text ("Enter your website")
 *   - p > a         -> primary CTA ("Get insights"), decorated by EDS as .button
 *   - p > a (.mp4)  -> background/demo video link (visual reference only, hidden)
 *
 * The decoration groups the placeholder text and the CTA into a single
 * "glass" search pill that mirrors the source design.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div') || block;

  // Locate the heading and the first paragraph (intro/subtitle).
  const heading = cell.querySelector('h1, h2');
  const paragraphs = [...cell.querySelectorAll(':scope > p')];

  // Remove any standalone media link (e.g. an .mp4 reference) — it is a design
  // reference on the source and has no visual counterpart here.
  paragraphs.forEach((p) => {
    const link = p.querySelector('a');
    if (link && /\.(mp4|webm|mov)(\?|$)/i.test(link.getAttribute('href') || '')) {
      p.remove();
    }
  });

  // Re-read paragraphs after pruning media links.
  const remaining = [...cell.querySelectorAll(':scope > p')];

  // The intro is the first paragraph that is plain text (no button link).
  const intro = remaining.find((p) => !p.querySelector('a'));
  if (intro) intro.classList.add('hero-search-subtitle');

  // The CTA is the first paragraph containing a link (decorated as a button).
  const ctaP = remaining.find((p) => p.querySelector('a'));
  // The placeholder is a plain-text paragraph that is NOT the intro.
  const placeholder = remaining.find((p) => p !== intro && !p.querySelector('a'));

  // Build the search pill: a placeholder "field" + the CTA button.
  if (placeholder || ctaP) {
    const pill = document.createElement('div');
    pill.className = 'hero-search-pill';

    if (placeholder) {
      placeholder.classList.add('hero-search-field');
      pill.append(placeholder);
    }
    if (ctaP) {
      ctaP.classList.add('hero-search-cta');
      const link = ctaP.querySelector('a');
      if (link) {
        link.classList.add('button', 'accent');
        // Avoid EDS button-container interfering with our flex layout.
        ctaP.classList.remove('button-container');
      }
      pill.append(ctaP);
    }

    if (heading && heading.parentElement === cell) {
      // Insert the pill after the intro (or heading) in document order.
      const anchor = intro || heading;
      anchor.after(pill);
    } else {
      cell.append(pill);
    }
  }
}
