/* eslint-disable */
/* global WebImporter */
/**
 * Parser for logos-marquee.
 * Base block: custom (no Block Collection match) — marquee of brand logos.
 * Source: https://www.semrush.com/ (section.mp-logo-marquee)
 * Generated: 2026-06-26
 *
 * Structure (inferred from source HTML + blocks/logos-marquee/logos-marquee.js):
 *   Row 1: block name
 *   One row per logo image (1 column). The block JS clones the track for the
 *   infinite-scroll animation, so we extract only the FIRST group of logos to
 *   avoid importing duplicate entries.
 */
export default function parse(element, { document }) {
  // Source duplicates the logo list (two .mp-logo-marquee__group <ul>s) for the
  // seamless scroll. Use only the first group so logos are not duplicated.
  const firstGroup = element.querySelector('.mp-logo-marquee__group, ul');
  const scope = firstGroup || element;

  const logos = Array.from(scope.querySelectorAll('img'))
    .filter((img) => img.getAttribute('src') || img.getAttribute('data-src'));

  const cells = [];

  logos.forEach((img) => {
    cells.push([img]); // 1-column row, one logo per row
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'logos-marquee', cells });
  element.replaceWith(block);
}
