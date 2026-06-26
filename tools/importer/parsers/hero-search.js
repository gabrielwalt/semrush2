/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-search.
 * Base block: hero (1 column; row 2 = optional background image, row 3 = content).
 * Source: https://www.semrush.com/ (section.mp-hero)
 * Generated: 2026-06-26
 *
 * Structure (from library-description "Hero" + authoring-analysis):
 *   Row 1: block name
 *   Row 2: background image (optional)
 *   Row 3: title, subtitle, search form (modeled as a CTA), demo video link.
 *
 * NOTE: the hero section also contains a nested logo-marquee (handled by the
 * separate logos-marquee block). We scope strictly to direct hero content and
 * exclude any `.mp-logo-marquee` content.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Background image: first <img> that is not inside the logo marquee
  const bgImage = Array.from(element.querySelectorAll('img')).find(
    (img) => !img.closest('.mp-logo-marquee'),
  );
  if (bgImage) {
    cells.push([bgImage]); // 1-column background row
  }

  // Content cell (single column)
  const contentCell = [];

  // Title
  const title = element.querySelector('.mp-hero__title, h1');
  if (title && title.textContent.trim()) {
    const heading = document.createElement('h1');
    heading.textContent = title.textContent.trim();
    contentCell.push(heading);
  }

  // Subtitle
  const subtitle = element.querySelector('.mp-hero__subtitle, p[class*="subtitle"]');
  if (subtitle && subtitle.textContent.trim()) {
    const subP = document.createElement('p');
    subP.textContent = subtitle.textContent.trim();
    contentCell.push(subP);
  }

  // Search form → modeled as a CTA. Target the submit button (.mp-button),
  // NOT the flag/locale dropdown button.
  const searchBtn = element.querySelector('.mp-search .mp-button, .mp-search__container .mp-button');
  const searchInput = element.querySelector('.mp-search__input-value, .mp-search input');
  if (searchBtn) {
    const placeholder = element.querySelector('.suggest-placeholder-overlay, [class*="placeholder"]');
    const labelText = searchBtn.textContent.trim() || 'Get insights';
    // Represent the search prompt text if present
    if (placeholder && placeholder.textContent.trim()) {
      const promptP = document.createElement('p');
      promptP.textContent = placeholder.textContent.trim();
      contentCell.push(promptP);
    } else if (searchInput) {
      const promptP = document.createElement('p');
      promptP.textContent = 'Enter your website';
      contentCell.push(promptP);
    }
    const cta = document.createElement('a');
    cta.href = '#main-cta-top';
    cta.textContent = labelText;
    const ctaP = document.createElement('p');
    ctaP.append(cta);
    contentCell.push(ctaP);
  }

  // Demo video → link to first source (handle lazy-loaded src)
  const videoEl = element.querySelector('.mp-hero__video, video');
  if (videoEl) {
    const sourceEl = videoEl.querySelector('source');
    const videoSrc = (sourceEl && (sourceEl.getAttribute('src') || sourceEl.getAttribute('data-src')))
      || videoEl.getAttribute('src')
      || videoEl.getAttribute('data-src')
      || '';
    if (videoSrc) {
      const videoLink = document.createElement('a');
      videoLink.href = videoSrc;
      videoLink.textContent = videoSrc;
      const videoP = document.createElement('p');
      videoP.append(videoLink);
      contentCell.push(videoP);
    }
  }

  // Empty-block guard
  if (!cells.length && !contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  if (contentCell.length) {
    cells.push([contentCell]); // 1-column content row
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-search', cells });
  element.replaceWith(block);
}
