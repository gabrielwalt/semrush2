/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-resources.
 * Base block: carousel (2 columns: image | text).
 * Source: https://www.semrush.com/ (section.mp-resources)
 * Generated: 2026-06-26
 *
 * Structure (from library-description "Carousel" + authoring-analysis):
 *   Row 1: block name
 *   One row per article slide: cell 1 = image, cell 2 = linked title, description, tag text.
 */
export default function parse(element, { document }) {
  const slides = Array.from(element.querySelectorAll('.mp-resources__item, article[class*="resources__item"]'));

  const cells = [];

  slides.forEach((slide) => {
    // Image cell
    const img = slide.querySelector('.mp-resources__item-img, img');
    const imageCell = img || '';

    // Text cell
    const textCell = [];

    // Linked title → preserve heading + anchor
    const titleLink = slide.querySelector('.mp-resources__item-link, .mp-resources__item-title a, h3 a');
    if (titleLink) {
      const heading = document.createElement('h3');
      const link = document.createElement('a');
      link.href = titleLink.href;
      link.textContent = titleLink.textContent.trim();
      heading.append(link);
      textCell.push(heading);
    } else {
      const titleEl = slide.querySelector('.mp-resources__item-title, h3');
      if (titleEl && titleEl.textContent.trim()) {
        const heading = document.createElement('h3');
        heading.textContent = titleEl.textContent.trim();
        textCell.push(heading);
      }
    }

    // Description
    const description = slide.querySelector('.mp-resources__item-description, p[class*="description"]');
    if (description && description.textContent.trim()) {
      const descP = document.createElement('p');
      descP.textContent = description.textContent.trim();
      textCell.push(descP);
    }

    // Tags
    const tags = Array.from(slide.querySelectorAll('.mp-resources__item-info-tag, footer span'))
      .map((t) => t.textContent.trim())
      .filter(Boolean);
    if (tags.length) {
      const tagP = document.createElement('p');
      tagP.textContent = tags.join(', ');
      textCell.push(tagP);
    }

    // Only add a slide row if there is some content
    if (img || textCell.length) {
      cells.push([imageCell, textCell.length ? textCell : '']);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-resources', cells });
  element.replaceWith(block);
}
